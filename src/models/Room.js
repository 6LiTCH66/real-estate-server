import mongoose, {Schema, model} from "mongoose";

const Room = new Schema({
    users: [{
        type: String,
        ref: "User"
    }],
    messages: [{
        type: Schema.Types.ObjectId,
        ref: "Message"

    }]
})


export default model("Room", Room)