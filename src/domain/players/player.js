export class Player {
    constructor(dbPlayer) {
        let {
            id,
            name,
            rating,
            wins = 0,
            losses = 0,
            draws = 0,
        } = dbPlayer;

        this.id = id;
        this.name = name;
        this.rating = rating;
        this.wins = wins;
        this.losses = losses;
        this.draws = draws;

        const createdAt = dbPlayer.createdAt || dbPlayer.createdat || dbPlayer.created_at;

        this.createdAt = createdAt instanceof Date 
            ? createdAt 
            : new Date(createdAt);

        const updatedAt = dbPlayer.updatedAt || dbPlayer.updatedat || dbPlayer.updated_at;
        this.updatedAt = updatedAt instanceof Date 
            ? updatedAt 
            : new Date(updatedAt);
    }

    static create({ id, name }) {
        return new Player({
            id,
            name,
            rating: 1000,
            wins: 0,
            losses: 0,
            draws: 0,
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
}