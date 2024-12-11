import { db } from './index.js';

export const playersDb = {
    async getById(id) {
        return new Promise((resolve, reject) => {
            db.get(
                'SELECT * FROM players WHERE id = ?',
                [id],
                (err, row) => {
                    if (err) reject(err);
                    if (!row) resolve(null);
                    resolve(row);
                }
            );
        });
    },
    
    async create(player) {
        return new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO players 
                (id, name, rating, wins, losses, draws, created_at, updated_at) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    player.id,
                    player.name,
                    player.rating,
                    player.wins,
                    player.losses,
                    player.draws,
                    player.createdAt.getTime(),
                    player.updatedAt.getTime()
                ],
                (err) => {
                    if (err) reject(err);
                    resolve(player);
                }
            );
        });
    },
    
    async update(player) {
        return new Promise((resolve, reject) => {
            db.run(
                `UPDATE players 
                SET rating = ?, wins = ?, losses = ?, draws = ?, updated_at = ? 
                WHERE id = ?`,
                [
                    player.rating,
                    player.wins,
                    player.losses,
                    player.draws,
                    player.updatedAt.getTime(),
                    player.id
                ],
                (err) => {
                    if (err) reject(err);
                    resolve(player);
                }
            );
        });
    },
    
    async getTopPlayers(limit) {
        return new Promise((resolve, reject) => {
            db.all(
                'SELECT * FROM players ORDER BY rating DESC LIMIT ?',
                [limit],
                (err, rows) => {
                    if (err) reject(err);
                    resolve(rows);
                }
            );
        });
    },
    
    async search(query) {
        return new Promise((resolve, reject) => {
            const searchPattern = `%${query}%`;
            db.all(
                'SELECT * FROM players WHERE name LIKE ? ORDER BY rating DESC',
                [searchPattern],
                (err, rows) => {
                    if (err) reject(err);
                    resolve(rows);
                }
            );
        });
    }
};