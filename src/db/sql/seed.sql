-- Reset tables
TRUNCATE TABLE players, prompts, battles CASCADE;

-- Seed players
INSERT INTO players (id, name, rating, wins, losses, draws, createdAt, updatedAt)
VALUES
  ('player1', 'Alice', 1500, 0, 0, 0, NOW(), NOW()),
  ('player2', 'Bob', 1500, 0, 0, 0, NOW(), NOW()),
  ('player3', 'Charlie', 1500, 0, 0, 0, NOW(), NOW());

-- Seed prompts
INSERT INTO prompts (id, codeName, content, createdBy, type, createdAt)
VALUES
  ('prompt1', 'haiku-nature', 'Write a haiku about nature', 'player1', 'attack', NOW()),
  ('prompt2', 'love-letter', 'Compose a love letter', 'player2', 'defend', NOW()),
  ('prompt3', 'time-travel', 'Create a short story about time travel', 'player3', 'attack', NOW()),
  ('prompt4', 'ocean-poem', 'Write a poem about the ocean', 'player1', 'defend', NOW()),
  ('prompt5', 'first-meeting', 'Draft a scene with two characters meeting for the first time', 'player2', 'attack', NOW());

-- Seed battles
INSERT INTO battles (
    id, 
    attackPromptId, 
    defendPromptId, 
    attackerId, 
    defenderId, 
    status, 
    winner, 
    startAt,
    createdAt
) VALUES
    ('battle1', 'prompt1', 'prompt2', 'player1', 'player2', 'completed', 'player1', NOW(), NOW()),
    ('battle2', 'prompt3', 'prompt4', 'player2', 'player3', 'in_progress', NULL, NOW(), NOW()),
    ('battle3', 'prompt4', 'prompt5', 'player3', 'player1', 'pending', NULL, NOW(), NOW());
