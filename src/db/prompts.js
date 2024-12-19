import { db } from './supabase.js';

const TABLE_NAME = 'prompts';

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

// Replace buildSqlQuery with buildSupabaseQuery
const buildSupabaseQuery = (queryInfo) => {
    if (!queryInfo.type) {
        return db.from(TABLE_NAME).select('*').order('createdAt', { ascending: false });
    }

    try {
        let query = db.from(TABLE_NAME).select('*');

        switch (queryInfo.type) {
            case QUERY_TYPES.TYPE_ONLY:
                return query
                    .eq('type', queryInfo.params.promptType)
                    .order('createdAt', { ascending: false });

            case QUERY_TYPES.USER_ONLY:
                return query
                    .eq('createdBy', queryInfo.params.createdBy)
                    .order('createdAt', { ascending: false });

            case QUERY_TYPES.USER_AND_TYPE:
                return query
                .eq('createdBy', queryInfo.params.createdBy)
                .eq('type', queryInfo.params.promptType)
                    .order('createdAt', { ascending: false });

            case QUERY_TYPES.SPECIFIC_PROMPT:
                return query
                .eq('createdBy', queryInfo.params.createdBy)
                .eq('type', queryInfo.params.promptType)
                .eq('codeName', queryInfo.params.codeName)
                    .order('createdAt', { ascending: false });
            default:
                throw new Error('Invalid query type');
        }
    } catch (error) {
        console.error('Error building Supabase query:', error);
        // Return a safe default query
        return db.from(TABLE_NAME).select('*').order('date', { ascending: false });
    }
};

export const promptsDb = {
    async getById(id) {
        const { data, error } = await db
            .from(TABLE_NAME)
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    },

    async getAll(query) {
        try {
            const queryInfo = parseQuery(query);
            const supabaseQuery = buildSupabaseQuery(queryInfo);

            const { data, error } = await supabaseQuery;

            if (error) {
                console.error('Database error:', error);
                throw new Error('Failed to fetch prompts');
            }

            return data || [];
        } catch (error) {
            console.error('Query parsing error:', error);
            return {
                rows: [],
                error: error.message
            };
        }
    },

    async create(prompt) {
        const { data, error } = await db
            .from(TABLE_NAME)
            .insert([{
                id: prompt.id,
                codeName: prompt.codeName,
                createdAt: prompt.date,
                createdBy: prompt.userId,
                type: prompt.type,
                content: prompt.content
            }])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async delete(id) {
        const { error } = await db
            .from(TABLE_NAME)
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
}; 