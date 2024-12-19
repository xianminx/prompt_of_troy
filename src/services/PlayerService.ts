import { getPlayerById, insertPlayer, type SelectPlayer } from "../db/index";
import { db } from '../db';
import { eq } from 'drizzle-orm';
import { playersTable } from '../db/schema';

export class PlayerService {
    async create(userId: string, name: string = `Player_${userId}`) {
        const player = await insertPlayer({
            id: userId,
            name,
            createdAt: new Date()
        });
        return player;
    }
    async getById(id: string): Promise<SelectPlayer | null> {
        const player = await getPlayerById(id);
        return player;
    }
    async updateRating(playerId: string, newRating: number): Promise<void> {
        await db.update(playersTable)
            .set({ rating: newRating })
            .where(eq(playersTable.id, playerId));
    }
}