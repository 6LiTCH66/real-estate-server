import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import mongoose from "mongoose";
import cookieParser from "cookie-parser"
import authRoute from "./routes/auth.route.js"
import propertyRoute from "./routes/property.route.js";
import userRoute from "./routes/user.route.js";

const app = express();

dotenv.config();

const PORT = process.env.PORT || 3005

const connect = async () => {
    try{
        await mongoose.connect(process.env.MONDODB_URL)
        console.log("Connected to mongoDB!");
    }catch (e){
        console.log(e)
    }
}

app.use(cors());
app.use(express.json())
app.use(cookieParser());

app.use("/auth", authRoute)
app.use('/property', propertyRoute)
app.use("/user", userRoute)





app.listen(PORT, async () => {
    await connect()
    console.log(`App is running at http://localhost:${PORT}`)
})