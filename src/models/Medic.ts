import mongoose, { Mongoose } from "mongoose"
  
  const MedicSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        unique: true,
        dropDups: true,
        required: true
    },
    service: {
        type: String,
        required: true
    }
  })
  
export const Medic = mongoose.model("Medic", MedicSchema);