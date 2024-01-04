import { IsBoolean, IsOptional, IsString } from "class-validator";

export class UpdateGroupDto {

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
        this.admin = userData.admin
        this.groupName = userData.groupName
        this.about = userData.about
        this.showMembers = userData.showMembers
        this.showModerators = userData.showModerators
    }
}