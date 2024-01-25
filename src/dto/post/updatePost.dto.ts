import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString, isBoolean } from "class-validator";
import { AbstractDto } from "../DTO.dto";

export class UpdatePostDto extends AbstractDto {

    @IsArray()
    @IsOptional()
    groups: string[]

    @IsBoolean()
    @IsNotEmpty()
    isGeneral: boolean

    @IsString()
    @IsNotEmpty()
    title: string

    @IsString()
    @IsNotEmpty()
    content: string

    @IsString()
    @IsOptional()
    url: string

    @IsBoolean()
    @IsOptional()
    showMembers: boolean

    @IsOptional()
    excelFile: Buffer

    allowedFields: string[]

    constructor(userData: UpdatePostDto) {
        super()
        this.groups = userData.groups
        this.isGeneral = true
        this.showMembers = userData.showMembers
        this.title = userData.title
        this.content = userData.content
        this.url = userData.url
        this.excelFile = userData.excelFile
        this.allowedFields = ['groups', 'excelFile', 'isGeneral', 'title', 'content', 'url', 'showMembers']
    }

    getAllowedFields(): string[] {
        return this.allowedFields;
    }
}

