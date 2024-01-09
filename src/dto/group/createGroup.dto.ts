import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { AbstractDto } from "../DTO.dto";

export class CreateGroupDto extends AbstractDto {

    @IsString()
    @IsNotEmpty()
    groupName: string

    @IsString()
    @IsNotEmpty()
    about: string

    @IsBoolean()
    @IsOptional()
    showMembers: boolean

    @IsBoolean()
    @IsOptional()
    showModerators: boolean

    constructor(userData: CreateGroupDto) {
        super()
        this.groupName = userData.groupName
        this.about = userData.about
        this.showMembers = userData.showMembers
        this.showModerators = userData.showModerators
    }

    getAllowedFields(): string[] {
        return ['showMembers', 'showModerators', 'about', 'groupName']
    }
}