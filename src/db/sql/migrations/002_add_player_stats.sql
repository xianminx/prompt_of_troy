-- Migration: 002_add_player_stats
-- Created at: 2024-03-20
-- Description: Add statistics columns to players table

BEGIN;

ALTER TABLE players
ADD COLUMN IF NOT EXISTS total_games INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS win_streak INTEGER DEFAULT 0;

COMMIT; 