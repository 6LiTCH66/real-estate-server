import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import mongoose from "mongoose";
import cookieParser from "cookie-parser"
import authRoute from "./routes/auth.route.js"
import propertyRoute from "./routes/property.route.js";
import userRoute from "./routes/user.route.js";
import chatRoute from "./routes/chat.route.js";

import {Server} from "socket.io";
import http from "http";
import Message from "./models/Message.js";
import Room from "./models/Room.js";
import message from "./models/Message.js";

const app = express();
app.set("trust proxy", 1);

dotenv.config();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT,
        methods: ["GET", "POST"]
    }
})

io.on("connection", (socket) => {

    socket.on("join_room", async (data) => {
        socket.join(data.room_id);

        const messages = await Message.find({room: data.room_id})

        const room  = await Room.findById(data.room_id).populate("messages")

        const promises = messages.map(async (message) => {

            if (!message.readBy.includes(data.user_id)){
                message.readBy.push(data.user_id)

            }

            return message.save()

        })

        const updatedMessages = await Promise.all(promises);
        const lastMessage = updatedMessages.pop()

        socket.emit(`readMessage_${data.room_id}`, lastMessage)
        socket.broadcast.emit(`readMessage_${data.room_id}`, lastMessage)


    })

    socket.on('leaveRoom', (roomId) => {
        socket.leave(roomId);
    });

    socket.on("send_message", async (data) => {
        const newMessage = new Message()
        const room = await Room.findById(data.room);

        newMessage.content = data.content
        newMessage.user = data.user._id
        newMessage.room = data.room

        if (!newMessage.readBy.includes(data.user._id)){
            newMessage.readBy.push(data.user._id)
        }

        room.messages.push(newMessage)

        await newMessage.save()
        await room.save()


        socket.to(data.room).emit(`receive_message_${data.room}`, data)

        socket.broadcast.emit(data.room, data)

        socket.emit(data.room, data)

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
app.use("/chat", chatRoute)



app.get('/', (req, res) => {
    res.send('Hello World!')
})

server.listen(PORT, async () => {
    await connect()
    console.log(`App is running at http://localhost:${PORT}`)
})

