const mongoose = require("mongoose");
const userSchema = new mongoose.Schema
    (
        {
            name: {
                type: String,
                require: [
                    true, "name is required"
                ]
            },
            email: {
                type: String,
                require: [
                    true, "email is required"
                ],
                unique: true,
                lowercase: true,
                trim: true,
            },
            password: {
                type: String,
                require: [
                    true, "password is required"
                ],

            },
            role: {
                type: String,
                enum: ["user", "admin"],
                default: 'user'
            },
            task: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: "Task",
            }]

        },
        {
            timestamps: true


        }
    )
userModel = mongoose.model("User", userSchema)
module.exports = userModel 