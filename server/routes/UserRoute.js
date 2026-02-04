const express = require("express")
const { userLogin, userRegister, userLogout } = require("../controller/UserController")
const router = express.Router()
router.post("/register", userRegister);
router.post("/login", userLogin);
router.get("/logout", userLogout)

module.exports = router