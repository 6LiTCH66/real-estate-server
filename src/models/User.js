import {Schema, model} from "mongoose";

const User = new Schema({
    first_name: {
        type: String,
        required: false
    },
    last_name: {
        type: String,
        required: false
    },
    email:{
        type: String,
        unique: true,
        required: true
    },
    phone:{
        type: String,
        required: false
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