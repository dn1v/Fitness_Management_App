import { IsString, IsEmail, IsNotEmpty, IsOptional, IsDateString, minLength, MinLength } from "class-validator";
import { AbstractDto } from "../DTO.dto";

export class UserSignupDto extends AbstractDto {

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
        super()
        this.firstName = userData.firstName || '';
        this.lastName = userData.lastName || '';
        this.email = userData.email || '';
        this.password = userData.password || '';
    }

    getAllowedFields(): string[] {
        return ['firstName', 'lastName', 'email', 'password']
    }
}
