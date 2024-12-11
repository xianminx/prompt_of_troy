-- Schema for Prompt of Troy Database
-- Version: 1.0.0
-- Date: 2024-03-20

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Set up Row Level Security (RLS)
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE battles ENABLE ROW LEVEL SECURITY;

-- Players Table
CREATE TABLE IF NOT EXISTS players (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    rating INTEGER DEFAULT 1000,
    wins INTEGER DEFAULT 0,
    losses INTEGER DEFAULT 0,
    draws INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    -- Add Supabase auth integration
    auth_id UUID REFERENCES auth.users(id)
);

-- RLS Policies for players
CREATE POLICY "Players are viewable by everyone" 
    ON players FOR SELECT 
    USING (true);

CREATE POLICY "Players can only be updated by themselves" 
    ON players FOR UPDATE 
    USING (auth.uid() = auth_id);

-- Prompts Table
CREATE TABLE IF NOT EXISTS prompts (
    id TEXT PRIMARY KEY,
    codeName TEXT,
    date BIGINT,
    userId TEXT REFERENCES players(id),
    type TEXT,
    content TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    -- Add Supabase metadata
    created_by UUID REFERENCES auth.users(id) DEFAULT auth.uid()
);

-- RLS Policies for prompts
CREATE POLICY "Prompts are viewable by everyone" 
    ON prompts FOR SELECT 
    USING (true);

CREATE POLICY "Prompts can only be created by authenticated users" 
    ON prompts FOR INSERT 
    WITH CHECK (auth.role() = 'authenticated');

-- Battles Table
CREATE TABLE IF NOT EXISTS battles (
    id TEXT PRIMARY KEY,
    date BIGINT,
    attackerId TEXT REFERENCES players(id),
    defenderId TEXT REFERENCES players(id),
    attackPromptId TEXT REFERENCES prompts(id),
    defendPromptId TEXT REFERENCES prompts(id),
    status TEXT,
    winner TEXT REFERENCES players(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    -- Add Supabase metadata
    created_by UUID REFERENCES auth.users(id) DEFAULT auth.uid()
);

-- RLS Policies for battles
CREATE POLICY "Battles are viewable by everyone" 
    ON battles FOR SELECT 
    USING (true);

CREATE POLICY "Battles can only be created by authenticated users" 
    ON battles FOR INSERT 
    WITH CHECK (auth.role() = 'authenticated');

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_players_rating ON players(rating DESC);
CREATE INDEX IF NOT EXISTS idx_players_name ON players(name);
CREATE INDEX IF NOT EXISTS idx_players_auth_id ON players(auth_id);

CREATE INDEX IF NOT EXISTS idx_prompts_codename ON prompts(codeName);
CREATE INDEX IF NOT EXISTS idx_prompts_type ON prompts(type);
CREATE INDEX IF NOT EXISTS idx_prompts_created_by ON prompts(created_by);

CREATE INDEX IF NOT EXISTS idx_battles_date ON battles(date DESC);
CREATE INDEX IF NOT EXISTS idx_battles_status ON battles(status);
CREATE INDEX IF NOT EXISTS idx_battles_created_by ON battles(created_by);

-- Add triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_players_updated_at
    BEFORE UPDATE ON players
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 