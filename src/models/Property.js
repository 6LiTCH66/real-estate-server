import {Schema, model} from "mongoose";

const Property = new Schema({
    address: {
        type: String,
        required: true
    },
    state_province:{
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    country:{
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    build_year:{
        type: Number,
        required: true,
    },
    bedrooms: {
        type: Number,
        required: true
    },
    bathrooms: {
        type: Number,
        required: true
    },
    square_footage: {
        type: Number,
        required: true
    },
    zipcode: {
        type: Number
    },
    property_type: {
        type: String,
        enum: ["Any", "Condo", "Multi Family Home", "Farm", "Single Family Home", "Townhouse", "Apartment", "Land", "Duplex"],
        default: "Any",
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    property_status: {
        type: String,
        enum: ["sell", "rent"],
        default: "sell",
        required: true
    },
    images: {
        type: [String],
        required: false, // true for production

    },
    agentId: {
        type: String, ref: "User"
    }
}, {
    timestamps: true
})

export default model("Property", Property)