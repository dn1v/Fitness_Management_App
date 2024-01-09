import { IsNumber, IsOptional, Min, Max } from "class-validator";
import { AbstractDto } from "../DTO.dto";

export class UpdateSRPEDto extends AbstractDto {

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

    allowedFields: string[]
    
    constructor(userData: UpdateSRPEDto) {
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
