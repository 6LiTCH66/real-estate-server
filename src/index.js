import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import mongoose from "mongoose";
import cookieParser from "cookie-parser"
import authRoute from "./routes/auth.route.js"
import propertyRoute from "./routes/property.route.js";
import userRoute from "./routes/user.route.js";
import {Server} from "socket.io";
import http from "http";

const app = express();
app.set("trust proxy", 1);

dotenv.config();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3001",
        methods: ["GET", "POST"]
    }
})
io.on("connection", (socket) => {

    socket.on("join_room", (data) => {
        socket.join(data);
    })

    socket.on("send_message", (data) => {
        socket.to(data.room).emit("receive_message", data)
    })
})

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

app.use('/images', express.static('images'));

app.use(cors(corsOptions));
app.use(express.json())
app.use(cookieParser());

app.use("/auth", authRoute)
app.use('/property', propertyRoute)
app.use("/user", userRoute)


app.get('/', (req, res) => {
    res.send('Hello World!')
})

server.listen(PORT, async () => {
    await connect()
    console.log(`App is running at http://localhost:${PORT}`)
})

