const taskModel = require("../model/TaskModel")
const userModel = require("../model/UserModel");

const createTask = async (req, res) => {
    const { title, description, status, priority } = req.body;
    const task = await taskModel.create(
        {
            title,
            description,
            status,
            priority,
            user: req.user.id
        });

    res.status(201).json({ success: true, task });
}

const getTasks = async (req, res) => {
    const tasks = await taskModel.find();
    res.status(200).json({ success: true, tasks });
}
const updateTask = async (req, res) => {
    const { id } = req.params;
    const { title, description, status, priority } = req.body;
    const task = await taskModel.findByIdAndUpdate(id, { title, description, status, priority }, { new: true });
    res.status(200).json({ success: true, task });
}
const deleteTask = async (req, res) => {
    const { id } = req.params;
    await taskModel.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Task deleted successfully" });
}
module.exports = { createTask, getTasks, updateTask, deleteTask }