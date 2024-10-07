const { Router } = require("express");
const bcrypt = require("bcrypt");
const { z } = require("zod");
const jwt = require("jsonwebtoken")
const mainRouter = Router();
const { UserModel, TodoModel } = require("../dataBase");
const JWT_USER_KEY = process.env.JWT_USER_KEY;

const validBody = z.object({
    username: z.string().min(2, { message: "Too short username" }).max(20, { message: "Username must less then 20 character" }),
    password: z
        .string()
        .min(5, { message: "Too short password" })
        .max(20, { message: "Password is too big" })
        .refine((password) => /[A-Z]/.test(password), {
            message: "Add an uppercase character"
        })
        .refine((password) => /[a-z]/.test(password), {
            message: "Add a lowercase character"
        })
        .refine((password) => /[0-9]/.test(password), {
            message: "Add a number"
        })
        .refine((password) => /[!@#$%^&*]/.test(password), {
            message: "Add a special character"
        }),
    confirmPassword: z.string()
}).refine((data) => data.confirmPassword === data.password, {
    message: "Passwords do not match",
    path: ['confirmPassword']
});

mainRouter.post("/signup", async function (req, res) {
    console.log("i am here");
    const validBodyCheck = validBody.safeParse(req.body);
    if (!validBodyCheck.success) {
        const errorMessages = validBodyCheck.error.issues[0].message;
        res.status(400).send({ message: `Invalid input: ${errorMessages}` });
        return;
    }

    const { username, password } = validBodyCheck.data;

    try {
        const existingUser = await UserModel.findOne({ username });
        if (existingUser) {
            res.status(400).send({ message: "Username already exists" });
            return;
        }

        const hashedpassword = await bcrypt.hash(password, 5);
        await UserModel.create({
            username: username,
            password: hashedpassword
        });

        res.status(201).send({ message: "Signup Complete" });
    } catch (error) {
        res.status(500).send({ message: "Internal server error" });
    }
});


mainRouter.post("/signin", async function (req, res) {
    const { username, password } = req.body;

    if (!username || !password) {
        res.status(400).send({
            message: "Username and password are required"
        });
        return;
    }

    try {
        const user = await UserModel.findOne({
            username: username
        });

        if (!user) {
            res.status(400).send({
                message: "Invalid credentials"
            });
            return;
        }

        const passwordCheck = await bcrypt.compare(password, user.password);
        if (passwordCheck) {
            const token = jwt.sign({
                userId: user._id.toString()
            }, JWT_USER_KEY)

            res.status(200).send({
                message: "Sign in complete",
                token: token
            });
            return;
        } else {
            res.status(400).send({
                message: "Invalid credentials"
            });
        }
    } catch (error) {
        res.status(500).send({ message: "Internal server error" });
    }
});


mainRouter.post("/newTodo", userAuth, async function (req, res) {
    const userId = req.userId;
    const { title, done, time, date, todoNo } = req.body;

    try {
        const existingTodo = await TodoModel.findOne({ userId, $or: [{ title }, { todoNo }] });

        if (existingTodo) {

            if (existingTodo.title == title) {
                return res.status(400).json({ message: "A todo with this title already exists" });
            }
            if (existingTodo.todoNo == todoNo) {
                return res.status(400).json({ message: "TodoNo is already exists" });
            }
        }

        await TodoModel.create({
            title,
            done,
            time,
            date,
            userId,
            todoNo
        });

        const allTodo = await TodoModel.find({ userId });
        return res.status(201).json({
            message: "New todo created successfully",
            allTodo: allTodo
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error", error: error.message
        });
    }
});


mainRouter.put("/todo/edit", userAuth, async function (req, res) {
    const userId = req.userId;
    const { todoNo, title, done } = req.body;

    if (!todoNo) {
        return res.status(400).json({ message: "Todo No is required" });
    }

    try {

        const existingTodo = await TodoModel.findOne({ title, userId });
        if (existingTodo) {
            return res.status(400).json({ message: "A todo with this title already exists" });
        }


        const editTodo = await TodoModel.updateOne(
            { userId: userId, todoNo: todoNo },
            { title, done }
        );

        if (editTodo.acknowledged && editTodo.modifiedCount > 0) {
            const allTodo = await TodoModel.find({ userId });
            return res.status(200).json({
                message: "Todo updated successfully",
                allTodo: allTodo

            });
        } else {
            return res.status(404).json({ message: "Todo not found or no changes made" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
});


mainRouter.get("/todos", userAuth, async function (req, res) {
    const userId = req.userId;
    try {
        const allTodo = await TodoModel.find({ userId });

        if (allTodo.length > 0) {
            return res.status(200).json({
                message: "Todos fetched successfully",
                allTodo: allTodo
            });
        } else {
            return res.status(404).json({ message: "No todos found for this user" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
});

mainRouter.patch("/todo/isDone", userAuth , async function (req, res) {
    const userId = req.userId;  // Ensure this is set correctly in your authentication middleware
    const {todoNo, done }  = req.body; // ID of the todo to be marked as done

    try {
        const updatedTodo = await TodoModel.findOneAndUpdate(
            {
                todoNo: todoNo,
                userId: userId
            },
            { done: done }, // Update the 'done' field to true
            { new: true } // Return the updated document
        );

        if (updatedTodo) {
            return res.status(200).json({
              message: `Todo marked as ${done ? "done" : "not done"} successfully`,
              updatedTodo
            });
        } else {
            return res.status(404).json({ message: "Todo not found or you do not have permission" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
});


mainRouter.delete("/todo/delete", userAuth, async function (req, res) {
    const userId = req.userId;
    const todoNo = req.query.todoNo;

    if (!todoNo) {
        return res.status(400).json({ message: "Todo No is required" });
    }

    try {
        const deletedTodo = await TodoModel.findOneAndDelete({
            todoNo: todoNo,
            userId: userId
        });

        if (deletedTodo) {
            await TodoModel.updateMany(
                { userId: userId, todoNo: { $gt: todoNo } },
                { $inc: { todoNo: -1 } }
            );

            const allTodo = await TodoModel.find({ userId });

            return res.status(200).json({
                message: "Todo deleted successfully",
                allTodo: allTodo
            });
        } else {
            return res.status(404).json({ message: "Todo not found or does not belong to the user" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
});


async function userAuth(req, res, next) {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: "Token missing, authorization denied" });
    }

    try {
        jwt.verify(token, JWT_USER_KEY, (error, decodedData) => {
            if (error) {
                console.log(error);
                return res.status(401).json({ message: "Authentication failed" });
            }
            req.userId = decodedData.userId;
            next();
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error during authentication" });
    }
}


module.exports = {
    mainRouter: mainRouter
}