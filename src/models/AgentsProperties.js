import {Schema, model} from "mongoose";

const AgentsProperties = new Schema({
    agentId:{
        type: String,
        required: true
    },
    propertyId: [{type:String, ref: "Property"}]
})
export default model("AgentsProperties", AgentsProperties)