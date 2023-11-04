import { ObjectId } from "mongoose"

export interface IPOMS extends Document {
    owner: ObjectId
    angry: number
    annoyed: number 
    badTempered: number
    bitter: number
    confused: number
    mixedUp: number
    muddled: number
    uncertain: number
    depressed: number
    downhearted: number
    miserable: number
    unhappy: number
    exhausted: number
    sleepy: number
    tired: number
    wornOut: number
    anxious: number
    nervous: number
    panicky: number
    worried: number
    active: number
    alert: number
    energetic: number
    lively: number
    vigourMoodState: number
    tensionMoodState: number
    fatigueMoodState: number
    depressionMoodState: number
    confusionMoodState: number
    angerMoodState: number
    totalMoodScore:number
}