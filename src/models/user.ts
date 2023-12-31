import mongoose, { Schema } from "mongoose";
import validator from "validator";
import jsonwebtoken from 'jsonwebtoken'
import * as bcrypt from 'bcryptjs'
import { IUser } from "../interfaces/user.interface";
import { BadRequestException } from "../exceptions/badRequestException";
import { NotFoundException } from "../exceptions/notFoundException";
import { ErrorMessages } from "../constants/errorMessages";

const userSchema: Schema<IUser> = new Schema({
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
    sentReqs: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    receivedReqs: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    connections: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    coaches: [{
        type: Schema.Types.ObjectId,
        ref: 'Coach'
    }],
    athletes: [{
        type: Schema.Types.ObjectId,
        ref: 'Athlete'
    }],
    pending: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
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

userSchema.methods.generateToken = async function () {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET not found in environment');
    }

    const token = jsonwebtoken.sign({ _id: this._id.toString() }, process.env.JWT_SECRET);
    this.tokens.push({ token });
    await this.save();

    return token;
};

userSchema.statics.credentialsCheck = async function (email: string, password: string): Promise<IUser | void> {
    const user = await User.findOne({ email }).exec()
    if (!user) throw new NotFoundException(ErrorMessages.USER_404, { reason: email })
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) throw new BadRequestException(ErrorMessages.BAD_REQUEST, { reason: password })
    return user
}

userSchema.pre('save', async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 12)
    }
    next()
})

userSchema.methods.toJSON = function () {
    const user = this.toObject()
    delete user.password
    delete user.tokens
    delete user.profilePhoto

    return user
}

export const User = mongoose.model<IUser>('User', userSchema)