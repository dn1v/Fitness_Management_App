import { IsEmail, IsNotEmpty } from "class-validator";
import { AbstractDto } from "../DTO.dto";

export class UserLoginDto extends AbstractDto {
    @IsEmail()
    @IsNotEmpty()
    public email: string;

    @IsNotEmpty()
    public password: string;

    allowedFields: string[]

    constructor(userData: UserLoginDto) {
        super()
        this.email = userData.email
        this.password = userData.password
        this.allowedFields = ['email', 'password']
    }

    getAllowedFields(): string[] {
        return this.allowedFields
    }
}