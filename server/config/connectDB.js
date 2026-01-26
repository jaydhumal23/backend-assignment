const mongoose = require("mongoose")
const dotenv = require("dotenv")
const colors = require("colors")
dotenv.config();

const connectDB = async () => {

    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log(`DB connected ${mongoose.connection.host}`.bgGreen.white)
    }
    catch (err) {

        console.log(`DB connection Failed: ${err} `.bgRed.white)
    }
}

module.exports = connectDB;