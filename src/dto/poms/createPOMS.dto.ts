import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreatePomsDto {

     @IsString()
     @IsNotEmpty()
     owner: string;

     @IsNumber()
     @IsNotEmpty()
     angry: number;

     @IsNumber()
     @IsNotEmpty()
     annoyed: number;

     @IsNumber()
     @IsNotEmpty()
     badTempered: number;

     @IsNumber()
     @IsNotEmpty()
     bitter: number;

     @IsNumber()
     @IsNotEmpty()
     confused: number;

     @IsNumber()
     @IsNotEmpty()
     mixedUp: number;

     @IsNumber()
     @IsNotEmpty()
     muddled: number;

     @IsNumber()
     @IsNotEmpty()
     uncertain: number;

     @IsNumber()
     @IsNotEmpty()
     depressed: number;

     @IsNumber()
     @IsNotEmpty()
     downhearted: number;

     @IsNumber()
     @IsNotEmpty()
     miserable: number;

     @IsNumber()
     @IsNotEmpty()
     unhappy: number;

     @IsNumber()
     @IsNotEmpty()
     exhausted: number;

     @IsNumber()
     @IsNotEmpty()
     sleepy: number;

     @IsNumber()
     @IsNotEmpty()
     tired: number;

     @IsNumber()
     @IsNotEmpty()
     wornOut: number;

     @IsNumber()
     @IsNotEmpty()
     anxious: number;

     @IsNumber()
     @IsNotEmpty()
     nervous: number;

     @IsNumber()
     @IsNotEmpty()
     panicky: number;

     @IsNumber()
     @IsNotEmpty()
     worried: number;

     @IsNumber()
     @IsNotEmpty()
     active: number;

     @IsNumber()
     @IsNotEmpty()
     alert: number;

     @IsNumber()
     @IsNotEmpty()
     energetic: number;

     @IsNumber()
     @IsNotEmpty()
     lively: number;

    constructor(userData: CreatePomsDto) {
        this.owner = userData.owner;
        this.angry = userData.angry;
        this.annoyed = userData.annoyed;
        this.badTempered = userData.badTempered;
        this.bitter = userData.bitter;
        this.confused = userData.confused;
        this.mixedUp = userData.mixedUp;
        this.muddled = userData.muddled;
        this.uncertain = userData.uncertain;
        this.depressed = userData.depressed;
        this.downhearted = userData.downhearted;
        this.miserable = userData.miserable;
        this.unhappy = userData.unhappy;
        this.exhausted = userData.exhausted;
        this.sleepy = userData.sleepy;
        this.tired = userData.tired;
        this.wornOut = userData.wornOut;
        this.anxious = userData.anxious;
        this.nervous = userData.nervous;
        this.panicky = userData.panicky;
        this.worried = userData.worried;
        this.active = userData.active;
        this.alert = userData.alert;
        this.energetic = userData.energetic;
        this.lively = userData.lively;
    }
}