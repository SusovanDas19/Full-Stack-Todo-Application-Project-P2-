// user-authentication

window.onload = async function () {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "signup.html";
        return;
    }

    try {
        const response = await axios.get(
            "http://localhost:3000/api/v1/main/todos",
            {
                headers: { Authorization: token },
            }
        );
        if (response.status === 200) {
            const toastBox = document.querySelector("#toastBox");
            let toast = document.createElement("div");
            toast.classList.add("toast");
            toast.classList.add("toast-add");
            toast.innerHTML =
                '<i class="ri-checkbox-circle-fill"></i> Welcome Back😊';

            await render(response);
            toastBox.appendChild(toast);
            setTimeout(() => {
                toast.remove();
            }, 3000);
        }
    } catch (error) {
        console.log("Into the error");
        const toastBox = document.querySelector("#toastBox");
        let toast = document.createElement("div");
        toast.classList.add("toast");
        if (error.response) {
            const errorResponse = error.response;
            if (errorResponse.status === 404) {
                toast.classList.add("toast-add");
                toast.innerHTML = `<i class="ri-checkbox-circle-fill"></i> Create your first Todo😊`;
            } else {
                toast.classList.add("toast-inv");
                toast.innerHTML = '<i class="ri-edit-circle-fill"></i> Server Error';
            }
            toastBox.appendChild(toast);
            setTimeout(() => {
                toast.remove();
            }, 3000);
        }
    }
};

function logout() {
    localStorage.removeItem("token");

    window.location.href = "signin.html";
}

//Adding new todo

async function addTodo() {
    const title = document.getElementById("add").value;
    const todoNo = document.getElementById("todo-no").value;

    const now = new Date();
    const date = now.toLocaleDateString();
    const time = now.toLocaleTimeString();
    const token = localStorage.getItem("token");

    try {
        const response = await axios.post(
            "http://localhost:3000/api/v1/main/newTodo",
            {
                title,
                todoNo,
                date,
                time,
                done: false,
            },
            {
                headers: { Authorization: token },
            }
        );
        const toastBox = document.querySelector("#toastBox");

        let toast = document.createElement("div");
        toast.classList.add("toast");
        if (response.status === 201) {
            toast.classList.add("toast-add");
            toast.innerHTML =
                '<i class="ri-checkbox-circle-fill"></i> New Task Added';

            render(response);
        }
        toastBox.appendChild(toast);
        setTimeout(() => {
            toast.remove();
        }, 3000);
    } catch (error) {
        const errorResponse = error.response;
        const errorMessage = errorResponse.data.message;
        const toastBox = document.querySelector("#toastBox");
        let toast = document.createElement("div");
        toast.classList.add("toast");
        toast.classList.add("toast-inv");
        if (errorResponse.status === 400 && errorMessage.includes("title")) {
            toast.innerHTML =
                '<i class="ri-checkbox-circle-fill"></i> Title already exist';
        } else if (
            errorResponse.status === 400 &&
            errorMessage.includes("TodoNo")
        ) {
            toast.innerHTML =
                '<i class="ri-checkbox-circle-fill"></i> Todo No already exist';
        } else {
            toast.innerHTML = '<i class="ri-checkbox-circle-fill"></i> Server Error';
        }

        toastBox.appendChild(toast);
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
}

async function modifyTodo() {
    const todoNo = document.querySelector("#todo-no").value;
    const modifyTask = document.querySelector("#modify").value;
    const checkBox = document.getElementById("todoNo");
    let done = false;
    if (checkBox && checkBox.type === "checkbox" && checkBox.checked) {
        done = true;
    }
    const token = localStorage.getItem("token");

    try {
        const response = await axios.put(
            "http://localhost:3000/api/v1/main/todo/edit",
            {
                title: modifyTask,
                todoNo: todoNo,
                done: done,
            },
            {
                headers: { Authorization: token },
            }
        );
        console.log(response);
        const toastBox = document.querySelector("#toastBox");
        let toast = document.createElement("div");
        toast.classList.add("toast");
        if (response.status === 200) {
            toast.innerHTML = '<i class="ri-edit-circle-fill"></i> Todo Modified';
            toast.classList.add("toast-mod");
        }
        toastBox.appendChild(toast);
        setTimeout(() => {
            toast.remove();
        }, 3000);
        render(response);
    } catch (error) {
        const errorResponse = error.response;
        const errorMessage = errorResponse.data.message;
        const toastBox = document.querySelector("#toastBox");
        let toast = document.createElement("div");
        toast.classList.add("toast");
        toast.classList.add("toast-inv");

        if (
            errorResponse.status === 400 &&
            errorMessage.includes("already exist")
        ) {
            toast.innerHTML =
                '<i class="ri-edit-circle-fill"></i> Todo already exists';
        } else if (
            errorResponse.status === 400 &&
            errorMessage.includes("required")
        ) {
            toast.innerHTML = '<i class="ri-edit-circle-fill"></i> TodoNo required';
        } else if (errorResponse.status === 404) {
            toast.innerHTML = '<i class="ri-edit-circle-fill"></i> Todo not found';
        } else {
            toast.innerHTML = '<i class="ri-edit-circle-fill"></i> Server Error';
        }
        toastBox.appendChild(toast);
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
}

async function deleteTodo() {
    const todoNo = document.querySelector("#todo-no").value;
    const token = localStorage.getItem("token");
    try {
        const response = await axios.delete(
            `http://localhost:3000/api/v1/main/todo/delete?todoNo=${todoNo}`,
            {
                headers: { Authorization: token },
            }
        );
        const toastBox = document.querySelector("#toastBox");
        let toast = document.createElement("div");
        toast.classList.add("toast");
        if (response.status === 200) {
            toast.innerHTML = '<i class="ri-edit-circle-fill"></i> Todo deleted';
            toast.classList.add("toast-del");
            render(response);
        }
        toastBox.appendChild(toast);
        setTimeout(() => {
            toast.remove();
        }, 3000);
    } catch (error) {
        const errorResponse = error.response;
        const errorMessage = errorResponse.data.message;
        const toastBox = document.querySelector("#toastBox");
        let toast = document.createElement("div");
        toast.classList.add("toast");
        toast.classList.add("toast-inv");

        if (errorResponse.status === 400 && errorMessage.includes("required")) {
            toast.innerHTML = '<i class="ri-edit-circle-fill"></i> TodoNo required';
        } else if (errorResponse.status === 404) {
            toast.innerHTML = '<i class="ri-edit-circle-fill"></i> Todo not found';
        } else {
            toast.innerHTML = '<i class="ri-edit-circle-fill"></i> Server Error';
        }
        toastBox.appendChild(toast);
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
}

async function handleCheckboxChange(box) {
    try {
        // Assuming you have the token stored in localStorage or any other storage
        const token = localStorage.getItem("token");
        const todoNo = box.id;
        const done = box.checked;
        const response = await axios.patch(
            `http://localhost:3000/api/v1/main/todo/isDone`,
            {
                todoNo: todoNo,
                done: done
            },
            {
                headers: { Authorization: token },
            });
        const toastBox = document.querySelector("#toastBox");
        let toast = document.createElement("div");
        toast.classList.add("toast");
        const responseMesg = response.data.message;
        if(response.status === 200){
            toast.classList.add("toast-add");
            toast.innerHTML = `<i class="ri-edit-circle-fill"></i> ${responseMesg}`;
        }
        else if(response.status === 404){
            toast.classList.add("toast-inv");
            toast.innerHTML = `<i class="ri-edit-circle-fill"></i> ${responseMesg}`;
        }
        toastBox.appendChild(toast);
        setTimeout(() => {
            toast.remove();
        }, 3000);
    } catch (error) {
        const errorResponse = error.response;
        const errorMessage = errorResponse.data.message;
        const toastBox = document.querySelector("#toastBox");
        let toast = document.createElement("div");
        toast.classList.add("toast");
        toast.classList.add("toast-inv");
        toast.innerHTML = `<i class="ri-edit-circle-fill"></i> ${errorMessage}`;
        toastBox.appendChild(toast);
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

}

function createNewTodo(title, todoNo, done) {
    const div = document.createElement("div");
    div.classList.add("newTask");
    const p = document.createElement("p");
    p.textContent = `${todoNo}. ${title}`;
    const label = document.createElement("label");
    const box = document.createElement("input");
    box.id = "todoNo";
    const span = document.createElement("span");
    box.type = "checkbox";
    box.checked = done;
    box.id = todoNo;
    box.addEventListener("change", () => handleCheckboxChange(box));
    label.appendChild(box);
    label.appendChild(span);
    div.append(p);
    div.append(label);
    return div;
}

async function render(response) {
    document.querySelector("#todos").innerHTML = "";
    try {
        await response.data.allTodo.forEach((todo) => {
            const title = todo.title;
            const todoNo = todo.todoNo;
            const done = todo.done;
            const userId = todo.userId;
            const newEle = createNewTodo(title, todoNo, done, userId);
            document.querySelector("#todos").appendChild(newEle);
        });
    } catch (error) {
        if (error.response) {
            console.error("Error creating todo:", error.response.data.message);
        } else if (error.request) {
            console.error("No response received:", error.request);
        } else {
            console.error("Error in setting up request:", error.message);
        }
    }
}
