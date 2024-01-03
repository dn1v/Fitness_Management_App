import { IsOptional, IsNumber, IsString } from "class-validator";

export class UpdatePomsDto {

     @IsString()
     @IsOptional()
     owner: string;

     @IsNumber()
     @IsOptional()
     angry: number;

     @IsNumber()
     @IsOptional()
     annoyed: number;

     @IsNumber()
     @IsOptional()
     badTempered: number;

     @IsNumber()
     @IsOptional()
     bitter: number;

     @IsNumber()
     @IsOptional()
     confused: number;

     @IsNumber()
     @IsOptional()
     mixedUp: number;

     @IsNumber()
     @IsOptional()
     muddled: number;

     @IsNumber()
     @IsOptional()
     uncertain: number;

     @IsNumber()
     @IsOptional()
     depressed: number;

     @IsNumber()
     @IsOptional()
     downhearted: number;

     @IsNumber()
     @IsOptional()
     miserable: number;

     @IsNumber()
     @IsOptional()
     unhappy: number;

     @IsNumber()
     @IsOptional()
     exhausted: number;

     @IsNumber()
     @IsOptional()
     sleepy: number;

     @IsNumber()
     @IsOptional()
     tired: number;

     @IsNumber()
     @IsOptional()
     wornOut: number;

     @IsNumber()
     @IsOptional()
     anxious: number;

     @IsNumber()
     @IsOptional()
     nervous: number;

     @IsNumber()
     @IsOptional()
     panicky: number;

     @IsNumber()
     @IsOptional()
     worried: number;

     @IsNumber()
     @IsOptional()
     active: number;

     @IsNumber()
     @IsOptional()
     alert: number;

     @IsNumber()
     @IsOptional()
     energetic: number;

     @IsNumber()
     @IsOptional()
     lively: number;

    constructor(userData: UpdatePomsDto) {
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