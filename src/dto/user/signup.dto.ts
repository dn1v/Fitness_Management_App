import { IsString, IsEmail, IsNotEmpty, IsOptional, IsDateString, minLength, MinLength } from "class-validator";

export class UserSignupDto {
    
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @MinLength(7)
    password: string

    constructor(userData: UserSignupDto) {
        this.firstName = userData.firstName || '';
        this.lastName = userData.lastName || '';
        this.email = userData.email || '';
        this.password = userData.password || '';
    }
}
