import { getPlayerById, insertPlayer, type SelectPlayer, getAllPlayers } from "../db/index";
import { db } from '../db';
import { eq } from 'drizzle-orm';
import { playersTable } from '../db/schema';
import { findPlayers } from '../db/players';
import { type SortDirection, type PlayerSortableFields, Player } from '../types/player';
import { PaginatedResponse } from "@/types";

interface DiscordUser {
    username: string;
    id: string;
    // add other Discord user fields as needed
}

export class PlayerService {
    private static instance: PlayerService | null = null;

    private constructor() {
        // private constructor
    }

    public static getInstance(): PlayerService {
        if (!PlayerService.instance) {
            PlayerService.instance = new PlayerService();
        }
        return PlayerService.instance;
    }

    public static resetInstance(): void {
        PlayerService.instance = null;
    }

    async getAll() {
        const players = await getAllPlayers();
        const discordUsers = await Promise.all(players.map(player => this.getByDiscordId(player.id)));
        return players.map((player, index) => ({ ...player, ...discordUsers[index] }));
    }

    async getPaginated(
        page: number = 1, 
        limit: number = 10,
        sortBy: PlayerSortableFields = 'rating',
        sortDirection: SortDirection = 'desc'
    ): Promise<PaginatedResponse<Player>> {
        const offset = (page - 1) * limit;
        const [players, total] = await Promise.all([
            findPlayers({
                limit,
                offset,
                orderBy: {
                    field: sortBy,
                    direction: sortDirection
                }
            }),
            findPlayers({ count: true })
        ]);

        const totalPages = Math.ceil(total / limit);

        return {
            items: players,
            total,
            page,
            limit,
            totalPages,
            hasMore: page < totalPages,
        };
    }

    async create(userId: string, name?: string ) {
        // If name is empty, fetch Discord user info and use their username
        if (!name) {
            const discordUser = await this.getByDiscordId(userId);
            name = discordUser?.username || '';
        }

        const player = await insertPlayer({
            id: userId,
            name,
            createdAt: new Date()
        });
        return player;
    }

    async getById(id: string): Promise<SelectPlayer | null> {
        const player = await getPlayerById(id);
        const discordUser = await this.getByDiscordId(id);
        
        return {...player, ...discordUser};
    }

    async getByDiscordId(discordId: string): Promise<DiscordUser | null> {
        const response = await fetch(`https://discord.com/api/v10/users/${discordId}`, {
            headers: {
                'Authorization': `Bot ${process.env.DISCORD_TOKEN}`
            }
        });

        if (!response.ok) {
            console.error('Failed to fetch Discord user');
            return null;
        }

        const discordUser = await response.json();
        return discordUser;
    }

    async updateRating(playerId: string, newRating: number): Promise<void> {
        await db.update(playersTable)
            .set({ rating: newRating })
            .where(eq(playersTable.id, playerId));
    }
}