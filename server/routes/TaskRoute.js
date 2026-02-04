const express = require("express")
const { createTask, getTasks, updateTask, deleteTask } = require("../controller/TaskController");
const router = express.Router()
router.post("/createTask", createTask);
router.get("/getTask", getTasks);
router.patch("/updateTask", updateTask);
router.delete("/deleteTask", deleteTask);



module.exports = router