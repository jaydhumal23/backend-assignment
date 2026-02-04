const bcrypt = require("bcrypt")
const userModel = require("../model/UserModel")
const jwt = require("jsonwebtoken")


// registering user function
const userRegister = async (req, res) => {

    const { name, email, role, password } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);

        const hash = await bcrypt.hash(password, salt);
        const user = await userModel.create({
            name,
            email,
            role,
            password: hash
        });
        console.log(`User Registered: ${user.email}`);
        res.status(200).json({
            success: true,
            user: { name: user.name, email: user.email, role: user.role }
        });
    } catch (error) {
        console.log(`Registration Error: ${error}`);
        res.status(400).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });

    }






}

const userLogin = async (req, res) => {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email })
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({
            message: "Invalid Credentials", success: true,

        })
    }
    const token = jwt.sign({
        id: user._id,
        email: user.email,
        role: user.role,
    }, process.env.JWT_SECRET, { expiresIn: "1d" })
    res.cookie(token, "token")
    res.status(200).json({
        success: true,
        user: {
            username: user.name, email: user.email, role: user.role
        }

    })
}
const userLogout = (req, res) => {
    try {
        res.clearCookie("token")

        res.status(200).json({
            success: true,

        })
    }
    catch (err) {
        res.status(400).json({
            success: false,
            err,
        })
    }
}
module.exports = { userLogin, userRegister, userLogout }