import mongoose, { Schema } from "mongoose";
import { IPOMS } from "../interfaces/POMS.interface";

const props = {
    type: Number,
    min: 0,
    max: 4,
    required: false
}

const moodStatePoperties = {
    type: Number
};

const pomsSchema: Schema<IPOMS> = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        required: true
    },
    angry: props,
    annoyed: props,
    badTempered: props,
    bitter: props,
    confused: props,
    mixedUp: props,
    muddled: props,
    uncertain: props,
    depressed: props,
    downhearted: props,
    miserable: props,
    unhappy: props,
    exhausted: props,
    sleepy: props,
    tired: props,
    wornOut: props,
    anxious: props,
    nervous: props,
    panicky: props,
    worried: props,
    active: props,
    alert: props,
    energetic: props,
    lively: props,
    vigourMoodState: moodStatePoperties,
    tensionMoodState: moodStatePoperties,
    depressionMoodState: moodStatePoperties,
    fatigueMoodState: moodStatePoperties,
    confusionMoodState: moodStatePoperties,
    angerMoodState: moodStatePoperties,
    totalMoodScore:moodStatePoperties,
}, {
    timestamps: true
})

pomsSchema.pre('save', function (next) {
    this.angerMoodState = this.angry + this.annoyed + this.badTempered + this.bitter
    this.confusionMoodState = this.confused + this.mixedUp + this.muddled + this.uncertain
    this.depressionMoodState = this.depressed + this.downhearted + this.miserable + this.unhappy
    this.fatigueMoodState = this.exhausted + this.sleepy + this.tired + this.wornOut
    this.tensionMoodState = this.anxious + this.nervous + this.panicky + this.worried
    this.vigourMoodState = this.active + this.alert + this.energetic + this.lively
    this.totalMoodScore = this.angerMoodState + this.confusionMoodState + this.depressionMoodState + this.fatigueMoodState + this.tensionMoodState - this.vigourMoodState
    next()
})

export const POMS = mongoose.model('POMS', pomsSchema)