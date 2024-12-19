import { Player } from '../../src/domain/players/player.js';

describe('Player', () => {
    describe('constructor', () => {
        it('should create a player with default values', () => {
            const player = new Player({
                id: 'test-id',
                name: 'Test Player',
                rating: 1000,
                createdAt: new Date(),
                updatedAt: new Date()
            });

            expect(player.id).toBe('test-id');
            expect(player.name).toBe('Test Player');
            expect(player.rating).toBe(1000);
            expect(player.wins).toBe(0);
            expect(player.losses).toBe(0);
            expect(player.draws).toBe(0);
            expect(player.createdAt).toBeInstanceOf(Date);
            expect(player.updatedAt).toBeInstanceOf(Date);
        });

        it('should handle date strings in constructor', () => {
            const dateStr = '2024-03-21T00:00:00.000Z';
            const player = new Player({
                id: 'test-id',
                name: 'Test Player',
                rating: 1000,
                createdAt: dateStr,
                updatedAt: dateStr
            });

            expect(player.createdAt).toBeInstanceOf(Date);
            expect(player.updatedAt).toBeInstanceOf(Date);
            expect(player.createdAt.toISOString()).toBe(dateStr);
            expect(player.updatedAt.toISOString()).toBe(dateStr);
        });
    });

    describe('create', () => {
        it('should create a new player with default values', () => {
            const player = Player.create({
                id: 'test-id',
                name: 'Test Player'
            });

            expect(player.id).toBe('test-id');
            expect(player.name).toBe('Test Player');
            expect(player.rating).toBe(1000);
            expect(player.wins).toBe(0);
            expect(player.losses).toBe(0);
            expect(player.draws).toBe(0);
            expect(player.createdAt).toBeInstanceOf(Date);
            expect(player.updatedAt).toBeInstanceOf(Date);
        });
    });

    describe('updateRating', () => {
        it('should update rating and updatedAt', () => {
            const player = Player.create({
                id: 'test-id',
                name: 'Test Player'
            });
            const oldUpdatedAt = player.updatedAt;

            player.updateRating(1200);

            expect(player.rating).toBe(1200);
            expect(player.updatedAt.getTime()).toBeGreaterThan(oldUpdatedAt.getTime());
        });

        it('should throw error for invalid rating', () => {
            const player = Player.create({
                id: 'test-id',
                name: 'Test Player'
            });

            expect(() => player.updateRating(-100)).toThrow('Invalid rating value');
            expect(() => player.updateRating('not a number')).toThrow('Invalid rating value');
        });
    });

    describe('recordGameResult', () => {
        it('should record wins correctly', () => {
            const player = Player.create({
                id: 'test-id',
                name: 'Test Player'
            });

            player.recordGameResult('win');
            expect(player.wins).toBe(1);
        });

        it('should record losses correctly', () => {
            const player = Player.create({
                id: 'test-id',
                name: 'Test Player'
            });

            player.recordGameResult('loss');
            expect(player.losses).toBe(1);
        });

        it('should record draws correctly', () => {
            const player = Player.create({
                id: 'test-id',
                name: 'Test Player'
            });

            player.recordGameResult('draw');
            expect(player.draws).toBe(1);
        });

        it('should throw error for invalid result', () => {
            const player = Player.create({
                id: 'test-id',
                name: 'Test Player'
            });

            expect(() => player.recordGameResult('invalid')).toThrow('Invalid game result');
        });
    });

    describe('toJSON', () => {
        it('should serialize player data correctly', () => {
            const now = new Date();
            const player = new Player({
                id: 'test-id',
                name: 'Test Player',
                rating: 1200,
                wins: 5,
                losses: 3,
                draws: 2,
                createdAt: now,
                updatedAt: now
            });

            const json = player.toJSON();

            expect(json).toEqual({
                id: 'test-id',
                name: 'Test Player',
                rating: 1200,
                wins: 5,
                losses: 3,
                draws: 2,
                createdAt: now.toISOString(),
                updatedAt: now.toISOString()
            });
        });
    });
}); 