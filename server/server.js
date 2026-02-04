const express = require("express");
const app = express();
const colors = require("colors")
const dotenv = require("dotenv")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const connectDB = require("./config/connectDB")
const userRoute = require("./routes/UserRoute")
const swaggerUi = require("swagger-ui-express");
const taskRoute = require("./routes/TaskRoute")
dotenv.config()
const swaggerDocument = require("./swaggerDocs.js");
const PORT = process.env.PORT || 3000



connectDB()
app.use(cookieParser())
app.use(express.json())

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE", "PATCH"],


}))

app.get('/ping', (req, res) => {
    res.status(200).send('Pong');
});



app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api/user", userRoute)
app.use("/api/task", taskRoute)
app.listen(PORT, (err) => {
    console.log(`The backend server is running on localhost:${PORT}`.bgGreen.white)
})