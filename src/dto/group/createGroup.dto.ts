import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateGroupDto {

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
        this.groupName = userData.groupName
        this.about = userData.about
        this.showMembers = userData.showMembers
        this.showModerators = userData.showModerators
    }
}