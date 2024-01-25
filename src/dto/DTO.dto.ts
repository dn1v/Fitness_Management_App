export abstract class AbstractDto {
    abstract getAllowedFields(): string[];

    public fieldsCheck(fields: string[]) {
        const allowedFields = this.getAllowedFields();
        return allowedFields.length > 0 ?
            fields.every((field: string) => allowedFields.includes(field)) :
            true;
    }
}