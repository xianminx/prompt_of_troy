-- Migration: 000_migrations_table
-- Created at: 2024-03-20
-- Description: Create migrations tracking table

BEGIN;

CREATE TABLE IF NOT EXISTS schema_migrations (
    id SERIAL PRIMARY KEY,
    migration_name TEXT NOT NULL UNIQUE,
    executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMIT; 