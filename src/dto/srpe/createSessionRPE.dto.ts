import { IsNotEmpty, IsNumber, IsOptional, Min, Max } from "class-validator";

export class CreateSRPEDto {

    @IsNumber()
    @IsOptional()
    trainingType: string;

    @IsNumber()
    @IsNotEmpty()
    duration: number;

    @IsNumber()
    @IsNotEmpty()
    @Min(1)
    @Max(10)
    sRPE: number;

    constructor(userData: CreateSRPEDto) {
        this.trainingType = userData.trainingType;
        this.duration = userData.duration;
        this.sRPE = userData.sRPE;
    }
}
