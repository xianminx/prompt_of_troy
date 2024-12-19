// Entity/model definition
export class Prompt {
    constructor({id, codeName, type, content, createdAt, createdBy}) {
        this.id = id;
        this.codeName = codeName;
        this.type = type;
        this.content = content;
        this.createdBy = createdBy;
        this.createdAt = createdAt || new Date();
    }

    static create(createdBy, type, content, codeName) {
        return new Prompt({
            id: `<@${createdBy}>/${type}/${codeName}`,
            codeName,
            createdAt: new Date(),
            createdBy,
            type,
            content
        });
    }
}