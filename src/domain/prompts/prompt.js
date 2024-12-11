// Entity/model definition
export class Prompt {
    constructor({id, codeName, date, userId, type, content}) {
        this.id = id;
        this.codeName = codeName;
        this.date = date;
        this.userId = userId;
        this.type = type;
        this.content = content;
    }

    static create(userId, type, content, codeName) {
        return new Prompt({
            id: `<@${userId}>/${type}/${codeName}`,
            codeName,
            date: Math.floor(Date.now() / 1000),
            userId,
            type,
            content
        });
    }
} 