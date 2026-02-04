const express = require("express");
const { userLogin, userRegister, userLogout, getMe } = require("../controller/UserController");
const authMiddleware = require("../middleware/auth");
const router = express.Router();


router.post("/register", userRegister)
router.post("/login", userLogin)
router.get("/me", authMiddleware, getMe);
router.get("/logout", authMiddleware, userLogout);

module.exports = router;