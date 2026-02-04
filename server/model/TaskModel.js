const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,

    },
    status: {
        type: String,
        enum: ["pending", "inprogress", "completed"],
        default: "pending"
    },
    priority: {
        type: String,
        enum: ["high", "medium", "low"],
        default: "medium"
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",

    }
}, { timestamps: true })
module.exports = mongoose.model("Task", taskSchema)