const express = require("express");
const app = express();
const colors = require("colors")
const dotenv = require("dotenv")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const connectDB = require("./config/connectDB")
const userRoute = require("./routes/UserRoute")

const taskRoute = require("./routes/TaskRoute")
dotenv.config()
const PORT = process.env.PORT || 3000


connectDB()
app.use(cookieParser())
app.use(express.json())

app.use(cors({
    origin: "https://backend-assignment-lf5m.onrender.com",
    methods: ["GET", "POST", "DELETE", "PATCH"],

    credentials: true
}))

app.use("/api/user", userRoute)
app.use("/api/task", taskRoute)
app.listen(PORT, (err) => {
    console.log(`The backend server is running on localhost:${PORT}`.bgGreen.white)
})