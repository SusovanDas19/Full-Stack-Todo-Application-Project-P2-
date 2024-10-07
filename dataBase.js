const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;


const UserSchema = new Schema({
    username: {type: String, unique: true, required: true},
    password: {type: String, required: true}
});

const TodoSchema = new Schema({
    title: {type: String, required: true, unique: true},
    done: {type: Boolean, default: false},
    time: {type: String},
    date: {type: Date},
    userId: {type: ObjectId},
    todoNo: {type: Number, require: true, unique: true}
    
})

const UserModel = mongoose.model("users",UserSchema);
const TodoModel = mongoose.model("todos",TodoSchema);

module.exports = {
    UserModel: UserModel,
    TodoModel: TodoModel
}