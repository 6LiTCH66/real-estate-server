import Room from "../models/Room.js";
import Message from "../models/Message.js";
import User from "../models/User.js";
import ObjectId from "mongoose"
class ChatController{

    async createRoom(req, res, next){
        const {message: userMessage, agentId, first_name, last_name, phone} = req.body


        try{
            const roomDuplicate = await Room.find({users: [req.userId, agentId]})
            const user = await User.findById(req.userId)
            const agentUser = await User.findById(agentId)

            if (!roomDuplicate.length){

                // Creating a room if the room with agent is not created yet
                const room = new Room();
                const message = new Message();

                message.content = userMessage;
                message.user = req.userId
                message.room = room._id

                room.users.push(...[req.userId, agentId])
                room.messages.push(message)

                user.rooms.push(room._id)
                message.readBy.push(user._id)

                agentUser.rooms.push(room._id)

                if (first_name && last_name && phone){
                    user.first_name = first_name
                    user.last_name = last_name
                    user.phone = phone
                }

                await user.save()
                await agentUser.save()
                await room.save()
                await message.save()


            }else{
                // Just sent a new message if the room with agent is created
                const newMessage = new Message();
                const room = await Room.findById(roomDuplicate[0]._id)

                newMessage.content = userMessage
                newMessage.user = req.userId
                newMessage.room = roomDuplicate[0]._id
                newMessage.readBy.push(user._id)

                await newMessage.save()

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
            const roomsMessages = await Room.findById(room_id).populate({
                path: "messages",
                populate: [
                    { path: 'user', select: "-password" }
                ]
            })
            res.status(200).send(roomsMessages)

        }catch (err){
            res.status(400).json({error: "Cannot load your messages history!"})
        }
    }
    async readMessage(req, res, next){

        const {params: { room_id }} = req.query;

        // const countUnreadMessages = await Message.aggregate([
        //     { $match: { readBy: { $ne: req.userId } } },
        //     { $group: { _id: '$room', count: { $sum: 1 } } },
        // ]);

        const unreadCount = await Message.countDocuments({
            room: room_id,
            readBy: { $ne: req.userId },
        });
        // console.log(unreadCount)
        res.status(200).send("ok")

        // const message = await Message.findById(room_id)
        //
        // if (!message.readBy.includes(room_id)){
        //     message.readBy.push(room_id)
        //     await message.save();
        // }
    }

    async getUnreadMessage(req, res, next){

        const {params: { room_id }} = req.query;

        // const countUnreadMessages = await Message.aggregate([
        //     { $match: { readBy: { $ne: req.userId } } },
        //     { $group: { _id: '$room', count: { $sum: 1 } } },
        // ]);

        const unreadCount = await Message.countDocuments({
            room: room_id,
            readBy: { $ne: req.userId },
        });


        res.status(200).json({unreadCount})
    }
}

export default ChatController;