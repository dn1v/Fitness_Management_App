import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString, isBoolean } from "class-validator";
import { AbstractDto, DTO } from "../DTO.dto";

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

    allowedFields: string[]

    constructor(userData: CreatePostDto) {
        super()
        this.groups = userData.groups
        this.isGeneral = true
        this.showMembers = userData.showMembers
        this.title = userData.title
        this.content = userData.content
        this.url = userData.url
        this.url = userData.url
        this.allowedFields = ['groups', 'isGeneral', 'title', 'content', 'url', 'showMembers']
    }

    getAllowedFields(): string[] {
        return this.allowedFields;
    }
}

// Decorator to mark fields as allowed
// export function AllowedFields(...fields: string[]) {
//     return function (target: any) {
//         target.allowedFields = fields;
//     };
// }

// Abstract DTO class
// export abstract class AbstractDto {
//     static allowedFields: string[];

//     public fieldsCheck(fields: string[]) {
//         const allowedFields = (this.constructor as typeof AbstractDto).allowedFields || [];
//         return allowedFields.length > 0 ?
//             fields.every((field: string) => allowedFields.includes(field)) :
//             true;
//     }
// }

// Usage in CreatePostDto
// import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

// @AllowedFields('groups', 'isGeneral', 'title', 'content', 'url', 'showMembers')
// export class CreatePostDto extends AbstractDto {
//     @IsArray()
//     @IsOptional()
//     groups: string[];

//     @IsBoolean()
//     @IsNotEmpty()
//     isGeneral: boolean;

//     @IsString()
//     @IsNotEmpty()
//     title: string;

//     @IsString()
//     @IsNotEmpty()
//     content: string;

//     @IsString()
//     @IsOptional()
//     url: string;

//     @IsBoolean()
//     @IsOptional()
//     showMembers: boolean;

//         constructor(userData: CreatePostDto) {
//         super()
//         this.groups = userData.groups
//         this.isGeneral = true
//         this.showMembers = userData.showMembers
//         this.title = userData.title
//         this.content = userData.content
//         this.url = userData.url
//         this.url = userData.url
//     }
// }
