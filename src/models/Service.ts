import mongoose, { Mongoose } from "mongoose"
  
const ServiceSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        required: true
    }
})
  
export const Service = mongoose.model("Service", ServiceSchema);
