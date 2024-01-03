import { IsEmail, IsNotEmpty } from "class-validator";

export class ConnectionRequestDto {
    @IsEmail()
    @IsNotEmpty()
    email: string

    constructor(userData: ConnectionRequestDto) {
        this.email = userData.email
    }
}