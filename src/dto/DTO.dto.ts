export abstract class AbstractDto {
    abstract getAllowedFields(): string[];

    public fieldsCheck(fields: string[]) {
        const allowedFields = this.getAllowedFields();
        return allowedFields.length > 0 ?
            fields.every((field: string) => allowedFields.includes(field)) :
            true;
    }
}


export class DTO {

    public allowedFields: string[]

    constructor() {
        this.allowedFields = []
    }

    public fieldsCheck(fields: string[]) {
        return this.allowedFields.length > 0 ?
        fields.every((field: string) => this.allowedFields.includes(field)) :
        true;
    }
}