import { db } from "./index.js";
import { DbWrapper } from "./dbWrapper.js";

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
        const queryBuilder = DbWrapper.query('battles');

        if (query) {
            queryBuilder.where(`attackPromptId.ilike.${query}%,defendPromptId.ilike.${query}%`);
        }

        return queryBuilder
            .orderBy('date')
            .execute();
    }
};
