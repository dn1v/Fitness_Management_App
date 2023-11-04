import mongoose, { Schema } from "mongoose";
import validator from "validator";
import jsonwebtoken from 'jsonwebtoken'
import * as bcrypt from 'bcryptjs'
import { IAthlete } from "../interfaces/athlete";
import { SessionRPE } from "./sRPE";
import { NextFunction } from "express";


const athleteSchema: Schema<IAthlete> = new Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value: string) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid email.')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 7,
    },
    height: {
        type: Number

    },
    weight: {
        type: Number
    },
    age: {
        type: Number,
        trim: true,
        validate(value: number) {
            if (value <= 0) throw new Error('Age must be greater than zero.')
        }
    },
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ],
    profilePhoto: {
        type: Buffer
    }
}, {
    timestamps: true
})

athleteSchema.methods.generateToken = async function () {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET not found in environment');
    }

    const token = jsonwebtoken.sign({ _id: this._id.toString() }, process.env.JWT_SECRET);
    this.tokens.push({ token });
    await this.save();

    return token;
};

athleteSchema.statics.credentialsCheck = async function (email: string, password: string): Promise<IAthlete | void> {
    const athlete = await Athlete.findOne({ email }).exec()
    if (!athlete) throw new Error('User does not exist.')
    const isMatch = await bcrypt.compare(password, athlete.password)
    if (!isMatch) throw new Error('Invalid password.')
    return athlete
}

athleteSchema.pre('save', async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 12)
    }
    next()
})

athleteSchema.methods.toJSON = function () {
    const athlete = this.toObject()
    delete athlete.password
    delete athlete.tokens
    delete athlete.profilePhoto

    return athlete
}

athleteSchema.virtual('sRPE', {
    ref: 'SessionRPE',
    localField: '_id',
    foreignField: 'owner'
})

export const Athlete = mongoose.model('Athlete', athleteSchema)


// dodati