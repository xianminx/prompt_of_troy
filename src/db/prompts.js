import { db } from './index.js';

// Query type constants
const QUERY_TYPES = {
    TYPE_ONLY: 'TYPE_ONLY',
    USER_ONLY: 'USER_ONLY',
    USER_AND_TYPE: 'USER_AND_TYPE',
    SPECIFIC_PROMPT: 'SPECIFIC_PROMPT'
};

// Validation constants
const VALID_TYPES = {
    'attack': ['attack', 'a'],
    'defend': ['defend', 'd']
};

// Helper function to safely extract userId from mention format
const extractUserId = (mention) => {
    try {
        // Handle different possible formats: <@123>, <@!123>, 123
        const match = mention.match(/<@!?(\d+)>/) || mention.match(/^(\d+)$/);
        return match ? match[1] : null;
    } catch (error) {
        return null;
    }
};

// Helper function to sanitize input
const sanitizeInput = (input) => {
    if (!input) return '';
    // Remove any dangerous characters, allowing only alphanumeric, @, !, <, >, /, and -
    return input.toString().replace(/[^\w@!<>\/\-]/g, '');
};

// Helper function to normalize prompt type
const normalizeType = (type) => {
    if (!type) return null;
    
    const normalizedInput = type.toLowerCase().trim();
    
    // Check for full names and shortcuts
    for (const [fullType, aliases] of Object.entries(VALID_TYPES)) {
        if (aliases.includes(normalizedInput)) {
            return fullType;
        }
    }
    return null;
};

// Helper functions to parse and validate input
const parseQuery = (query) => {
    if (!query) return { type: null };

    const sanitizedQuery = sanitizeInput(query);
    if (!sanitizedQuery) return { type: null };

    // Case 1: Simple type query (attack/defend/a/d)
    const normalizedType = normalizeType(sanitizedQuery);
    if (normalizedType) {
        return {
            type: QUERY_TYPES.TYPE_ONLY,
            params: { promptType: normalizedType }
        };
    }

    // Case 2, 3, 4: User-related queries
    if (sanitizedQuery.includes('@')) {
        const parts = sanitizedQuery.split('/')
            .map(part => part.trim())
            .filter(part => part); // Remove empty parts
            
        const userId = extractUserId(parts[0]);

        if (!userId) {
            throw new Error('Invalid user ID format. Expected format: <@123456> or 123456');
        }

        // Case 2: User only
        if (parts.length === 1) {
            return {
                type: QUERY_TYPES.USER_ONLY,
                params: { userId }
            };
        }

        // Case 3: User and type
        if (parts.length === 2) {
            const promptType = normalizeType(parts[1]);
            if (!promptType) {
                throw new Error(`Invalid prompt type: "${parts[1]}". Must be "attack"(a) or "defend"(d)`);
            }
            return {
                type: QUERY_TYPES.USER_AND_TYPE,
                params: { userId, promptType }
            };
        }

        // Case 4: Specific prompt
        if (parts.length === 3) {
            const promptType = normalizeType(parts[1]);
            const codeName = parts[2];

            if (!promptType) {
                throw new Error(`Invalid prompt type: "${parts[1]}". Must be "attack"(a) or "defend"(d)`);
            }

            if (!codeName) {
                throw new Error('Code name cannot be empty');
            }

            return {
                type: QUERY_TYPES.SPECIFIC_PROMPT,
                params: { userId, promptType, codeName }
            };
        }

        // If more parts than expected, throw helpful error
        if (parts.length > 3) {
            throw new Error('Too many parameters. Format should be: <@userId>/type/codename');
        }
    }

    // If query doesn't match any expected format, provide helpful error message
    throw new Error(
        'Invalid query format.'
    );
};

// Build SQL query based on query type
const buildSqlQuery = (queryInfo) => {
    if (!queryInfo.type) {
        return {
            sql: 'SELECT * FROM prompts ORDER BY date DESC',
            params: []
        };
    }

    try {
        switch (queryInfo.type) {
            case QUERY_TYPES.TYPE_ONLY:
                return {
                    sql: 'SELECT * FROM prompts WHERE type = ? ORDER BY date DESC',
                    params: [queryInfo.params.promptType]
                };

            case QUERY_TYPES.USER_ONLY:
                return {
                    sql: 'SELECT * FROM prompts WHERE userId = ? ORDER BY date DESC',
                    params: [queryInfo.params.userId]
                };

            case QUERY_TYPES.USER_AND_TYPE:
                return {
                    sql: 'SELECT * FROM prompts WHERE userId = ? AND type = ? ORDER BY date DESC',
                    params: [queryInfo.params.userId, queryInfo.params.promptType]
                };

            case QUERY_TYPES.SPECIFIC_PROMPT:
                return {
                    sql: 'SELECT * FROM prompts WHERE userId = ? AND type = ? AND codeName = ? ORDER BY date DESC',
                    params: [
                        queryInfo.params.userId,
                        queryInfo.params.promptType,
                        queryInfo.params.codeName
                    ]
                };

            default:
                throw new Error('Invalid query type');
        }
    } catch (error) {
        console.error('Error building SQL query:', error);
        // Return a safe default query
        return {
            sql: 'SELECT * FROM prompts ORDER BY date DESC',
            params: []
        };
    }
};

export const promptsDb = {
    async getById(id) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM prompts WHERE id = ?', [id], (err, row) => {
                if (err) reject(err);
                resolve(row);
            });
        });
    },

    async getAll(query) {
        return new Promise((resolve, reject) => {
            try {
                const queryInfo = parseQuery(query);
                const { sql, params } = buildSqlQuery(queryInfo);

                console.log('Query:', { sql, params });

                db.all(sql, params, (err, rows) => {
                    if (err) {
                        console.error('Database error:', err);
                        reject(new Error('Failed to fetch prompts'));
                        return;
                    }
                    resolve(rows || []);
                });
            } catch (error) {
                console.error('Query parsing error:', error);
                // Instead of rejecting, return empty array with error message
                resolve({
                    rows: [],
                    error: error.message
                });
            }
        });
    },

    async create(prompt) {
        return new Promise((resolve, reject) => {
            db.run(
                'INSERT INTO prompts (id, codeName, date, userId, type, content) VALUES (?, ?, ?, ?, ?, ?)',
                [prompt.id, prompt.codeName, prompt.date, prompt.userId, prompt.type, prompt.content],
                (err) => {
                    if (err) reject(err);
                    resolve(prompt);
                }
            );
        });
    },

    async delete(id) {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM prompts WHERE id = ?', [id], (err) => {
                if (err) reject(err);
                resolve();
            });
        });
    }
}; 