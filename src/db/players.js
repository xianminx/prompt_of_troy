import { db } from './supabase.js';

const TABLE_NAME = 'players';
export const playersDb = {
    async getById(id) {
        const { data, error } = await db
            .from(TABLE_NAME)
            .select('*')
            .eq('id', id)
            .single();
        console.log({data, error});
            
        if (error) return null;
        return data;
    },
    
    async create(player) {
        const { data, error } = await db
            .from(TABLE_NAME)
            .insert([{
                id: player.id,
                name: player.name,
                rating: player.rating,
                wins: player.wins,
                losses: player.losses,
                draws: player.draws,
                createdAt: player.createdAt,
                updatedAt: player.updatedAt
            }])
            .select()
            .single();
            
        if (error) throw error;
        return data;
    },
    
    async update(player) {
        const { data, error } = await db
            .from(TABLE_NAME)
            .update({
                rating: player.rating,
                wins: player.wins,
                losses: player.losses,
                draws: player.draws,
                updatedAt: player.updatedAt
            })
            .eq('id', player.id)
            .select()
            .single();
            
        if (error) throw error;
        return data;
    },
    
    async getTopPlayers(limit) {
        const { data, error } = await db
            .from(TABLE_NAME)
            .select('*')
            .order('rating', { ascending: false })
            .limit(limit);
            
        if (error) throw error;
        return data;
    },
    
    async search(query) {
        const { data, error } = await db
            .from(TABLE_NAME)
            .select('*')
            .ilike('name', `%${query}%`)
            .order('rating', { ascending: false });
            
        if (error) throw error;
        return data;
    }
};