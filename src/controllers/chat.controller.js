import Room from "../models/Room.js";
import Message from "../models/Message.js";
import User from "../models/User.js";
import ObjectId from "mongoose"
class ChatController{

    async createRoom(req, res, next){
        const {message: userMessage, agentId} = req.body

        try{
            const roomDuplicate = await Room.find({users: [req.userId, agentId]})
            const user = await User.findById(req.userId)
            const agentUser = await User.findById(agentId)

            if (!roomDuplicate.length){
                const room = new Room();
                const message = new Message();

                message.content = userMessage;
                message.user = req.userId
                message.room = room._id

                room.users.push(...[req.userId, agentId])
                room.messages.push(message)

                user.rooms.push(room._id)
                agentUser.rooms.push(room._id)

                await user.save()
                await agentUser.save()
                await room.save()
                await message.save()




            }else{
                const newMessage = new Message();
                newMessage.content = userMessage
                newMessage.user = req.userId
                newMessage.room = roomDuplicate[0]._id
                await newMessage.save()
                const room = await Room.findById(roomDuplicate[0]._id)
                room.messages.push(newMessage)
                await room.save()

            }

            res.status(200).json({message: "Message was sent!"})

        }catch (err){
            res.status(400).json({error: "Cannot sent message!"})
        }
    }

    async getRooms(req, res, next){

        try{
            let rooms = await User.findById(req.userId).populate("rooms").select("rooms").populate({
                path: 'rooms',
                populate: [
                    { path: 'users', select: "-password" },
                    { path: 'messages' },
                ],
                options: {id: req.userId}
            });

            rooms.rooms.forEach((room) => {
                room.users = room.users.filter((user) => user._id.toString() !== req.userId)
            })

            res.status(200).send(rooms)

        }catch (err){
            res.status(400).json({error: "Cannot load your rooms history!"})
        }
    }

    async getMessages(req, res, next){
        const {params: { room_id }} = req.query;

        try{
            // const
            const roomsMessages = await Room.findById(room_id).populate({
                path: "messages",
                populate: [
                    { path: 'user', select: "-password" }
                ]
            })
            console.log(roomsMessages)
            res.status(200).send(roomsMessages)

        }catch (err){
            res.status(400).json({error: "Cannot load your messages history!"})
        }
    }
}

export default ChatController;