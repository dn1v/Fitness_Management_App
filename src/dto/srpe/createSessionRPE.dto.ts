import { IsNotEmpty, IsNumber, IsOptional, Min, Max, IsString } from "class-validator";
import { AbstractDto } from "../DTO.dto";

export class CreateSRPEDto extends AbstractDto {

    @IsString()
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

    allowedFields: string[]

    constructor(userData: CreateSRPEDto) {
        super()
        this.trainingType = userData.trainingType;
        this.duration = userData.duration;
        this.sRPE = userData.sRPE;
        this.allowedFields = []
    }

    getAllowedFields(): string[] {
        return this.allowedFields;
    }
}
