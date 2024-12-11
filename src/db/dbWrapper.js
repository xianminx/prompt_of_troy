import { db } from "./index.js";
import { config } from '../config/index.js';

export class DbWrapper {
    static query(table) {
        if (config.isDevelopment) {
            console.log(`[DEV] Querying ${table}`);
        }
        return new QueryBuilder(table);
    }
}

class QueryBuilder {
    constructor(table) {
        this.queryBuilder = db.from(table).select('*');
        this.table = table;
    }

    select(columns) {
        if (columns) {
            this.queryBuilder = this.queryBuilder.select(columns);
        }
        return this;
    }

    where(condition) {
        this.queryBuilder = this.queryBuilder.filter(condition);
        return this;
    }

    orderBy(column, direction = 'desc') {
        this.queryBuilder = this.queryBuilder.order(column, { ascending: direction === 'asc' });
        return this;
    }

    limit(limit) {
        this.queryBuilder = this.queryBuilder.limit(limit);
        return this;
    }

    async execute() {
        if (config.isDevelopment) {
            console.log(`[DEV] Executing query on ${this.table}`);
        }
        const { data, error } = await this.queryBuilder;
        if (error) throw error;
        return data;
    }

    async single() {
        const { data, error } = await this.queryBuilder.single();
        if (error) throw error;
        return data;
    }
} 