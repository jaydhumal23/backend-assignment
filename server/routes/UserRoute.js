const express = require("express")
const { userLogin, userRegister, userLogout, getMe } = require("../controller/UserController");
const authMiddleware = require("../middleware/auth");
const router = express.Router()



/**
 * @swagger
 * tags:
 * name: Auth
 * description: User authentication and management
 */

/**
 * @swagger
 * /api/user/register:
 * post:
 * summary: Register a new user
 * tags: [Auth]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * username: {type: string}
 * email: {type: string}
 * password: {type: string}
 * responses:
 * 201:
 * description: User registered successfully
 */
router.post("/register", userRegister);



/**
 * @swagger
 * /api/user/login:
 * post:
 * summary: User login
 * tags: [Auth]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * email: {type: string}
 * password: {type: string}
 * responses:
 * 200:
 * description: Login successful
 */
router.post("/login", userLogin);

/**
 * @swagger
 * /api/user/me:
 * get:
 * summary: Get current logged-in user details
 * tags: [Auth]
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: User details retrieved
 */
router.get("/me", authMiddleware, getMe)



router.get("/logout", authMiddleware, userLogout)
module.exports = router