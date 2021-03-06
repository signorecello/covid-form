
import { ISubmission, ISymptoms, IMedic, IConclusion }from "../types/Types";
import mongoose, { Mongoose, Types } from "mongoose"

const SubmissionSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true
    },
    Identification: {
        type: String,
        required: true
    },
    FamilyDoctor: {
        type: String
    },
    Address: String,
    Phone: String,
    Email: {
        type: String,
        match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    },
    Clinical: {
        DateSymptomsStarted: {
          type: Date,
          required: true
        },
        InitialSymptom: String,
        SymptomEvolution: [String],
        OtherSymptoms: String
    },
    Epidemiology: {
      TripHistory: String,
      ContactWithCovid: Boolean,
      DateOfContactCovid: Date
    },
    Conclusion: {
        type: String,
        enum: ["SemSuspeita", "Suspeita", "SuspeitaGrave"],
        required: true
    },
    Medic: {
        type: String,
        required: true
    },
    Date: Number
  })
  
export const Submission = mongoose.model("Submission", SubmissionSchema);