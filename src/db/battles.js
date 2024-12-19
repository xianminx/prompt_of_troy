import { db } from "./supabase.js";

export const battlesDb = {
    async getById(id) {
        const { data, error } = await db
            .from('battles')
            .select()
            .eq('id', id)
            .single();
            
        if (error) throw error;
        return data;
    },

    async create(battle) {
        const { data, error } = await db
            .from('battles')
            .insert([battle])
            .select()
            .single();
        
        if (error) throw error;
        return data;
    },

    async updateStatus(id, status, winner = null) {
        const { error } = await db
            .from('battles')
            .update({ status, winner })
            .eq('id', id);
        
        if (error) throw error;
    },

    async getAll(query) {
        // If query is empty or undefined, return all battles
        if (!query?.trim()) {
            const { data, error } = await db
                .from('battles')
                .select()
                .limit(50);

            if (error) throw error;
            if (!data) return [];
            return data;
        }

        // If there is a query, search by prompt IDs
        const { data, error } = await db
            .from('battles')
            .or([
                { attackPromptId: { ilike: `${query.trim()}%` } },
                { defendPromptId: { ilike: `${query.trim()}%` } }
            ])
            .limit(50);

        if (error) throw error;
        if (!data) return [];
        return data;
    }
};