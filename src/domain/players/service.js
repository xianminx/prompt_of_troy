import { playersDb } from '../../db/players.js';
import { Player } from './player.js';

export class PlayerService {
    async getById(id) {
        const playerData = await playersDb.getById(id);
        return playerData ? new Player(playerData) : null;
    }

    async create(id, name) {
        const existingPlayer = await this.getById(id);
        if (existingPlayer) {
            throw new Error(`Player with id ${id} already exists`);
        }

        const player = Player.create({ id, name });
        await playersDb.create(player);
        return player;
    }

    async updateRating(id, newRating) {
        const player = await this.getById(id);
        if (!player) {
            throw new Error(`Player ${id} not found`);
        }

        player.updateRating(newRating);
        await playersDb.update(player);
        return player;
    }

    async getLeaderboard(limit = 10) {
        const players = await playersDb.getTopPlayers(limit);
        return players.map(data => new Player(data));
    }

    async search(query) {
        const players = await playersDb.search(query);
        return players.map(data => new Player(data));
    }
} 