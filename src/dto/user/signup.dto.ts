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

    // @IsString()
    // @IsOptional()
    // position?: string;

    // @IsString()
    // @IsOptional()
    // sport?: string;

    // @IsDateString()
    // @IsOptional()
    // dateOfBirth?: Date;

    constructor(userData: UserSignupDto) {
        this.firstName = userData.firstName || '';
        this.lastName = userData.lastName || '';
        this.email = userData.email || '';
        this.password = userData.password || '';
        // this.position = userData.position || '';
        // this.sport = userData.sport || '';
        // this.dateOfBirth = userData.dateOfBirth || undefined;
    }
}
