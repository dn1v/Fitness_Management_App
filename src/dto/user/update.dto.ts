import { IsString, IsEmail, IsNotEmpty, IsOptional, IsDateString, minLength, MinLength } from "class-validator";

export class CoachUpdateDto {

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
        this.firstName = userData.firstName
        this.lastName = userData.lastName
        this.password = userData.password
        this.position = userData.position
    }
}

export class AthleteUpdateDto {

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
        this.firstName = userData.firstName
        this.lastName = userData.lastName
        this.password = userData.password
        this.date = userData.date
        this.sport = userData.sport
    }
}