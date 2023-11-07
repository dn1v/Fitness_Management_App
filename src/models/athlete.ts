import { Schema } from "mongoose";
import validator from "validator";
import { IAthlete } from "../interfaces/athlete";
import { User } from "./user";


const athleteSchema: Schema<IAthlete> = new Schema({
    dateOfBirth: {
        type: Date,
    },
    role: {
        type: String,
        required: true,
        default: 'athlete',
        validate(value: string) {
            if (value !== 'athlete') {
                throw new Error("Role property must be 'athlete'.")
            }
        }
    }, 
    sport: {
        type: String,
    },
}, {
    timestamps: true
})

athleteSchema.virtual('sRPE', {
    ref: 'SessionRPE',
    localField: '_id',
    foreignField: 'owner'
})

athleteSchema.virtual('pomsQ', {
    ref: 'POMS', 
    localField: '_id', 
    foreignField: 'owner'
})

export const Athlete = User.discriminator<IAthlete>("Athlete", athleteSchema)

// athleteSchema.methods.generateToken = async function () {
//     if (!process.env.JWT_SECRET) {
//         throw new Error('JWT_SECRET not found in environment');
//     }

//     const token = jsonwebtoken.sign({ _id: this._id.toString() }, process.env.JWT_SECRET);
//     this.tokens.push({ token });
//     await this.save();

//     return token;
// };

// athleteSchema.statics.credentialsCheck = async function (email: string, password: string): Promise<IAthlete | void> {
//     const athlete = await Athlete.findOne({ email }).exec()
//     if (!athlete) throw new Error('User does not exist.')
//     const isMatch = await bcrypt.compare(password, athlete.password)
//     if (!isMatch) throw new Error('Invalid password.')
//     return athlete
// }

// athleteSchema.pre('save', async function (next) {
//     if (this.isModified("password")) {
//         this.password = await bcrypt.hash(this.password, 12)
//     }
//     next()
// })

// athleteSchema.methods.toJSON = function () {
//     const athlete = this.toObject()
//     delete athlete.password
//     delete athlete.tokens
//     delete athlete.profilePhoto

//     return athlete
// }


// export const Athlete = mongoose.model<IAthlete>('Athlete', athleteSchema)