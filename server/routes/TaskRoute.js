const express = require("express");
const { createTask, getTasks, updateTask, deleteTask } = require("../controller/TaskController");
const authMiddleware = require("../middleware/auth");
const router = express.Router();
router.post("/createTask", authMiddleware, createTask);
router.patch("/updateTask/:id", authMiddleware, updateTask);
router.delete("/deleteTask/:id", authMiddleware, deleteTask);
router.get("/getTask", authMiddleware, getTasks);

module.exports = router;