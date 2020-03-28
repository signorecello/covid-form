import mongoose from "mongoose"

export enum ISymptoms {
    "Tosse" = "Tosse",
    "Febre" = "Febre",
    "Cefaleias" = "Cefaleias",
    "Mialgias" = "Mialgias",
    "Fraqueza" = "Fraqueza",
    "Dispneia" = "Dispneia",
    "Outros" = "Outros"
}

export enum IConclusion {
    "SemSuspeita" = "SemSuspeita",
    "Suspeita" = "Suspeita",
    "SuspeitaGrave" = "SuspeitaGrave"
}

export interface ISubmission extends mongoose.Document {

    Name: string,
    Identification: string,
    FamilyDoctor: string,
    Address: string,
    Phone: string,
    Email: string,
    Clinical: {
        DateSymptomsStarted: number,
        InitialSymptom: string,
        SymptomEvolution: string,
        OtherSymptoms: string
    },
    Epidemiology: {
        TripHistory: string,
        ContactWithCovid: boolean,
        DateOfContactCovid: number
    },
    Conclusion: string,
    Medic: string,
    number: number

}

export interface IMedic extends mongoose.Document {
    name: string
    email: string
}

export interface IService extends mongoose.Document {
    name: string,
    email: string
}