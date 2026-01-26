const bcrypt = require("bcrypt")
const userModel = require("../model/UserModel")
const jwt = require("jsonwebtoken")


// registering user function
const userRegister = async () => {

    const { name, email, role, password } = req.body;
    bcrypt.genSalt(10, (err, salt) => {

        bcrypt.hash(password, salt, async (error, hash) => {
            if (error) return res.status(400).send("something went wrong at hash")
            try {
                const user = await userModel.create({
                    name,
                    email,
                    role,
                    password: hash
                });
                console.log(`User Registered \n ${user}`)
                res.status(200).json({
                    success: true,

                })
            } catch (error) {
                console.log(`error here buddy : ${error}`)
                res.status(400).json({
                    sucess: false,
                    user: {
                        username: user.name, email: user.email, role: user.role
                    }
                })
            }
        })
    })




}

const userLogin = async () => {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email })
}