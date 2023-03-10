import {Schema, model} from "mongoose";

const User = new Schema({
    name: {
        type: String,
        required: true
    },
    email:{
        type: String,
        unique: true,
        required: true
    },
    phone:{
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isAgent:{
        type: Boolean,
        default: false
    },
},{
    timestamps: true
})
export default model("User", User);