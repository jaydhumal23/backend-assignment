const express = require("express")
const { createTask, getTasks, updateTask, deleteTask } = require("../controller/TaskController");
const authMiddleware = require("../middleware/auth");
const router = express.Router()
router.post("/createTask", authMiddleware, createTask);
router.get("/getTask", authMiddleware, getTasks);
router.patch("/updateTask/:id", authMiddleware, updateTask);
router.delete("/deleteTask/:id", authMiddleware, deleteTask);



module.exports = router