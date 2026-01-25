const express = require("express");
const app = express();
const dotenv = require("dotenv")
dotenv.config()
const PORT = process.env.PORT || 3000
app.use(express.json())


app.listen(PORT, (err) => {
    console.log(`The backend server is running on localhost:${PORT}`)
})