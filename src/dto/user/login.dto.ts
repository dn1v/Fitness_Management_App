import { IsEmail, IsNotEmpty } from "class-validator";

export class UserLoginDto {
    @IsEmail()
    @IsNotEmpty()
    public email: string;

    @IsNotEmpty()
    public password: string;

    constructor(userData: UserLoginDto) {
        this.email = userData.email
        this.password = userData.password
    }
}