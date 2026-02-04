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

const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

connectDB()
app.use(cookieParser())
app.use(express.json())

app.use(cors({
    origin: ["http://localhost:8080", "https://backendassign-1jay.vercel.app"],
    methods: ["GET", "POST", "DELETE", "PATCH"],

    credentials: true
}))



const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Backend Intern Assignment API",
            version: "1.0.0",
            description: "Secure Task Management API with JWT Authentication",
        },
        servers: [
            {
                url: "https://backendassign-1jay.vercel.app", // Your backend Render URL
                description: "Production server"
            },
            {
                url: "http://localhost:3000",
                description: "Local development server"
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
    },
    apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/user", userRoute)
app.use("/api/task", taskRoute)
app.listen(PORT, (err) => {
    console.log(`The backend server is running on localhost:${PORT}`.bgGreen.white)
})