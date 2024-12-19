-- Schema for Prompt of Troy Database
-- Version: 1.0.0
-- Date: 2024-03-20


-- Players Table
CREATE TABLE IF NOT EXISTS players (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    rating INTEGER DEFAULT 1000,
    wins INTEGER DEFAULT 0,
    losses INTEGER DEFAULT 0,
    draws INTEGER DEFAULT 0,
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Prompts Table
CREATE TABLE IF NOT EXISTS prompts (
    id TEXT PRIMARY KEY,
    codeName TEXT,
    createdBy TEXT REFERENCES players(id),
    type TEXT,
    content TEXT,
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Battles Table
CREATE TABLE IF NOT EXISTS battles (
    id TEXT PRIMARY KEY,
    attackerId TEXT REFERENCES players(id),
    defenderId TEXT REFERENCES players(id),
    attackPromptId TEXT REFERENCES prompts(id),
    defendPromptId TEXT REFERENCES prompts(id),
    startAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    endAt TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    status TEXT,
    winner TEXT REFERENCES players(id),
    createdBy TEXT REFERENCES players(id),
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_players_rating ON players(rating DESC);
CREATE INDEX IF NOT EXISTS idx_players_name ON players(name);

CREATE INDEX IF NOT EXISTS idx_prompts_codename ON prompts(codeName);
CREATE INDEX IF NOT EXISTS idx_prompts_type ON prompts(type);
CREATE INDEX IF NOT EXISTS idx_prompts_created_by ON prompts(createdBy);

CREATE INDEX IF NOT EXISTS idx_battles_status ON battles(status);
CREATE INDEX IF NOT EXISTS idx_battles_created_by ON battles(createdBy);
