import {Schema, model} from "mongoose";

const Favorite = new Schema({
    userId: {
        type: String,
        required: true
    },
    propertyId: [{type:String, ref: "Property"}]
})

export default model("Favorite", Favorite)