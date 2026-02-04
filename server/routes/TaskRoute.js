const express = require("express")
const { createTask, getTasks, updateTask, deleteTask } = require("../controller/TaskController");
const authMiddleware = require("../middleware/auth");
const router = express.Router()



/**
 * @swagger
 * tags:
 * name: Tasks
 * description: Task management APIs
 */

/**
 * @swagger
 * /api/task/createTask:
 * post:
 * summary: Create a new task
 * tags: [Tasks]
 * security:
 * - bearerAuth: []
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * title: {type: string}
 * description: {type: string}
 * responses:
 * 201:
 * description: Task created
 */
router.post("/createTask", authMiddleware, createTask);

/**
 * @swagger
 * /api/task/getTask:
 * get:
 * summary: Get all tasks for the user
 * tags: [Tasks]
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: List of tasks
 */
router.get("/getTask", authMiddleware, getTasks);

/**
 * @swagger
 * /api/task/updateTask/{id}:
 * patch:
 * summary: Update a task
 * tags: [Tasks]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * requestBody:
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * title: {type: string}
 * completed: {type: boolean}
 * responses:
 * 200:
 * description: Task updated
 */
router.patch("/updateTask/:id", authMiddleware, updateTask);


/**
 * @swagger
 * /api/task/deleteTask/{id}:
 * delete:
 * summary: Delete a task
 * tags: [Tasks]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * responses:
 * 200:
 * description: Task deleted
 */
router.delete("/deleteTask/:id", authMiddleware, deleteTask);



module.exports = router