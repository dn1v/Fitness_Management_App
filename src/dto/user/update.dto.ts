import { IsString, IsEmail, IsNotEmpty, IsOptional, IsDateString, minLength, MinLength } from "class-validator";
import { AbstractDto } from "../DTO.dto";

export class CoachUpdateDto extends AbstractDto {

    @IsString()
    @IsNotEmpty()
    firstName?: string;

    @IsString()
    @IsNotEmpty()
    lastName?: string;

    @IsString()
    @MinLength(7)
    password?: string

    @IsString()
    @IsOptional()
    position?: string

    constructor(userData: CoachUpdateDto) {
        super()
        this.firstName = userData.firstName
        this.lastName = userData.lastName
        this.password = userData.password
        this.position = userData.position
    }

    getAllowedFields(): string[] {
        return ['firstName', 'lastName', 'password', 'position']
    }
}

export class AthleteUpdateDto extends AbstractDto {

    @IsString()
    @IsOptional()
    firstName?: string;

    @IsString()
    @IsOptional()
    lastName?: string;

    @IsString()
    @MinLength(7)
    @IsOptional()
    password?: string;

    @IsDateString()
    @IsOptional()
    date?: string;

    @IsString()
    @IsOptional()
    sport?: string;

    constructor(userData: Partial<AthleteUpdateDto>) {
        super()
        this.firstName = userData.firstName
        this.lastName = userData.lastName
        this.password = userData.password
        this.date = userData.date
        this.sport = userData.sport
    }

    getAllowedFields(): string[] {
        return ['firstName', 'lastName', 'password', 'date', 'sport']
    }
}