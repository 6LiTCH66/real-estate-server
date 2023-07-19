import {Schema, model} from "mongoose";

const Message = new Schema({
    room: {
        type: Schema.Types.ObjectId,
        ref: "Room"
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    content: String,

},{
    timestamps: true
})

export default model("Message", Message)