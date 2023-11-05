import mongoose, { Schema } from "mongoose";
import { ISessionRPE } from "../interfaces/sRPE.interface";

const sRPESchema: Schema<ISessionRPE> = new Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    trainingType: {
        type: String,
        trim: true
    },
    duration: {
        type: Number,
        required: true,
        trim: true,
        min: 1,
    },
    sRPE: {
        type: Number,
        required: true,
        trim: true,
        min: 1,
        max: 10,
    },
    trainingLoad: {
        type: Number
    }
},{
    timestamps: true
})

sRPESchema.pre('save', function (next) {
    this.trainingLoad = this.duration * this.sRPE
    next()
})

export const SessionRPE = mongoose.model('SessionRPE', sRPESchema)