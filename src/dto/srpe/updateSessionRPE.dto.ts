import { IsNumber, IsOptional, Min, Max } from "class-validator";

export class UpdateSRPEDto {

    @IsNumber()
    @IsOptional()
    trainingType: string;

    @IsNumber()
    @IsOptional()
    duration: number;

    @IsNumber()
    @IsOptional()
    @Min(1)
    @Max(10)
    sRPE: number;

    constructor(userData: UpdateSRPEDto) {
        this.trainingType = userData.trainingType;
        this.duration = userData.duration;
        this.sRPE = userData.sRPE;
    }
}
