import { IsBoolean, IsOptional, IsString } from "class-validator";
import { AbstractDto } from "../DTO.dto";

export class UpdateGroupDto extends AbstractDto {

    @IsString()
    @IsOptional()
    admin: string

    @IsString()
    @IsOptional()
    groupName: string

    @IsString()
    @IsOptional()
    about: string

    @IsBoolean()
    @IsOptional()
    showMembers: boolean

    @IsBoolean()
    @IsOptional()
    showModerators: boolean

    constructor(userData: UpdateGroupDto) {
        super()
        this.admin = userData.admin
        this.groupName = userData.groupName
        this.about = userData.about
        this.showMembers = userData.showMembers
        this.showModerators = userData.showModerators
    }

    getAllowedFields(): string[] {
        return ['admin', 'groupName', 'about', 'showMembers', 'showModerators']
    }
}