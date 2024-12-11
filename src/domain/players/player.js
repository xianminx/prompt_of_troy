export class Player {
    constructor({
        id,
        name,
        rating,
        wins = 0,
        losses = 0,
        draws = 0,
        createdAt,
        updatedAt
    }) {
        this.id = id;
        this.name = name;
        this.rating = rating;
        this.wins = wins;
        this.losses = losses;
        this.draws = draws;
        this.createdAt = createdAt instanceof Date ? createdAt : new Date(createdAt);
        this.updatedAt = updatedAt instanceof Date ? updatedAt : new Date(updatedAt);
    }

    static create({ id, name }) {
        return new Player({
            id,
            name,
            rating: 1000,
            createdAt: new Date(),
            updatedAt: new Date()
        });
    }

    updateRating(newRating) {
        if (typeof newRating !== 'number' || newRating < 0) {
            throw new Error('Invalid rating value');
        }
        this.rating = newRating;
        this.updatedAt = new Date();
        return this;
    }

    recordGameResult(result) {
        switch(result) {
            case 'win': this.wins++; break;
            case 'loss': this.losses++; break;
            case 'draw': this.draws++; break;
            default: throw new Error('Invalid game result');
        }
        this.updatedAt = new Date();
        return this;
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            rating: this.rating,
            wins: this.wins,
            losses: this.losses,
            draws: this.draws,
            createdAt: this.createdAt.getTime(),
            updatedAt: this.updatedAt.getTime()
        };
    }
}