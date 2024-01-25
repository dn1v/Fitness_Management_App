import { IsString, IsEmail, IsNotEmpty, IsOptional, IsDateString, minLength, MinLength, ValidateIf} from "class-validator";
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

    @IsString()
    @IsNotEmpty()
    @ValidateIf((obj) => obj.role === 'Coach') // Apply validation only if role is not 'athlete'
    position: string

    @IsString()
    @IsNotEmpty()
    role: string

    coachFields: string[]

    athleteFields: string[]

    constructor(userData: UserSignupDto) {
        super()
        this.firstName = userData.firstName || '';
        this.lastName = userData.lastName || '';
        this.email = userData.email || '';
        this.password = userData.password || '';
        this.position = userData.position || '';
        this.role = userData.role || '';
        this.coachFields = ['firstName', 'lastName', 'email', 'password', 'position', 'role']
        this.athleteFields = ['firstName', 'lastName', 'email', 'password', 'role']
    }

    getAllowedFields(): string[] {
        if (this.role === 'Coach') return this.coachFields
        return this.athleteFields
    }
}
