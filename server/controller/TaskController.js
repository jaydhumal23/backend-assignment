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
    await userModel.findByIdAndUpdate(req.user.id, {
        $push: { task: task._id }
    })
    await task.populate("user", "name email")
    res.status(201).json({ success: true, task });
}

const getTasks = async (req, res) => {
    try {
        // --- BONUS CHANGE: Filter Tasks based on Role ---
        let tasks;
        if (req.user.role === "admin") {
            // Admin sees ALL tasks + who owns them
            tasks = await taskModel.find().populate("user", "name email");
        } else {
            // User sees ONLY their own tasks
            tasks = await taskModel.find({ user: req.user.id }).populate("user", "name email");
        }
        res.status(200).json({ success: true, tasks });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
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