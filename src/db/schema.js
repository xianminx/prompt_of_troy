export const schema = {
    battles: {
        id: 'text primary key',
        date: 'bigint',
        attackerId: 'text references players(id)',
        defenderId: 'text references players(id)',
        attackPromptId: 'text references prompts(id)',
        defendPromptId: 'text references prompts(id)',
        status: 'text',
        winner: 'text references players(id)',
    },

    players: {
        id: 'text primary key',
        name: 'text not null',
        rating: 'integer default 1000',
        wins: 'integer default 0',
        losses: 'integer default 0',
        draws: 'integer default 0',
        created_at: 'timestamp with time zone default now()',
        updated_at: 'timestamp with time zone default now()',
    },

    prompts: {
        id: 'text primary key',
        codeName: 'text',
        date: 'bigint',
        userId: 'text references players(id)',
        type: 'text',
        content: 'text',
    },
};

export const indexes = {
    players: [
        'CREATE INDEX IF NOT EXISTS idx_players_rating ON players(rating DESC)',
        'CREATE INDEX IF NOT EXISTS idx_players_name ON players(name)',
    ],
    battles: [
        'CREATE INDEX IF NOT EXISTS idx_battles_date ON battles(date DESC)',
        'CREATE INDEX IF NOT EXISTS idx_battles_status ON battles(status)',
    ],
    prompts: [
        'CREATE INDEX IF NOT EXISTS idx_prompts_codename ON prompts(codeName)',
        'CREATE INDEX IF NOT EXISTS idx_prompts_type ON prompts(type)',
    ],
};

// Helper function to generate CREATE TABLE statements
export function generateCreateTableSQL() {
    return Object.entries(schema).map(([tableName, columns]) => {
        const columnDefinitions = Object.entries(columns)
            .map(([name, type]) => `${name} ${type}`)
            .join(',\n    ');

        return `
CREATE TABLE IF NOT EXISTS ${tableName} (
    ${columnDefinitions}
);

${(indexes[tableName] || []).join(';\n')}
`;
    }).join('\n');
}

// Helper function to generate Supabase types
export function generateSupabaseTypes() {
    return `
export type Database = {
    public: {
        Tables: {
            ${Object.entries(schema).map(([tableName, columns]) => `
            ${tableName}: {
                Row: {
                    ${Object.entries(columns).map(([name, type]) => `
                    ${name}: ${mapPostgresToTS(type)}`).join('')}
                }
                Insert: {
                    ${Object.entries(columns).map(([name, type]) => `
                    ${name}${isNullable(type) ? '?' : ''}: ${mapPostgresToTS(type)}`).join('')}
                }
                Update: {
                    ${Object.entries(columns).map(([name, type]) => `
                    ${name}?: ${mapPostgresToTS(type)}`).join('')}
                }
            }`).join('')}
        }
    }
}`;
}

function mapPostgresToTS(postgresType) {
    const typeMap = {
        'text': 'string',
        'integer': 'number',
        'bigint': 'number',
        'timestamp with time zone': 'string',
        'boolean': 'boolean',
    };

    const baseType = postgresType.split(' ')[0];
    return typeMap[baseType] || 'any';
}

function isNullable(type) {
    return !type.includes('not null');
} 