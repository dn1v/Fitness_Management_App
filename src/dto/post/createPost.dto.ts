import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString, isBoolean } from "class-validator";

export class CreatePostDto {

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

    allowedFields: string[]

    constructor(userData: CreatePostDto) {
        this.groups = userData.groups
        this.isGeneral = userData.isGeneral
        this.showMembers = userData.showMembers
        this.title = userData.title
        this.content = userData.content
        this.url = userData.url
        this.url = userData.url
        this.allowedFields = ['groups', 'isGeneral', 'title', 'content', 'url', 'showMembers']
    }

    public fieldsCheck(fields: string[]) {
        return fields.every((field: string) => this.allowedFields.includes(field))
    }
}