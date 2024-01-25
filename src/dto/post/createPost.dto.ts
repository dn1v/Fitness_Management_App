import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString, isBoolean } from "class-validator";
import { AbstractDto } from "../DTO.dto";

export class CreatePostDto extends AbstractDto {

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

    constructor(userData: CreatePostDto) {
        super()
        this.groups = userData.groups
        this.isGeneral = true
        this.showMembers = userData.showMembers
        this.title = userData.title
        this.content = userData.content
        this.url = userData.url
        this.excelFile = userData.excelFile
        this.allowedFields = ['groups', 'isGeneral', 'title', 'content', 'url', 'showMembers', 'excelFile']
    }

    getAllowedFields(): string[] {
        return this.allowedFields;
    }
}

