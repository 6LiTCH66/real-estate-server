import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import mongoose from "mongoose";
import cookieParser from "cookie-parser"
import authRoute from "./routes/auth.route.js"
import propertyRoute from "./routes/property.route.js";
import userRoute from "./routes/user.route.js";
// import sessionMiddleware from "./middlewares/sessionMiddleware.js"
// import passport from "./config/passport.js"

const app = express();
app.set("trust proxy", 1);

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

const corsOptions ={
    credentials: true,
    optionSuccessStatus: 200,
    origin: true,
}



app.use(cors(corsOptions));
app.use(express.json())
app.use(cookieParser());

app.use("/auth", authRoute)
app.use('/property', propertyRoute)
app.use("/user", userRoute)


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(PORT, async () => {
    await connect()
    console.log(`App is running at http://localhost:${PORT}`)
})

export default app;