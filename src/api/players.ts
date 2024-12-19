import express from 'express';
import { PlayerService } from '../services/PlayerService';
import { mockPlayers } from './mock';

const router = express.Router();
const playerService = new PlayerService();

router.get('/', async (req, res) => {
    try {
        // const players = await playerService.getAll();
        const players = mockPlayers;
        res.json(players);
    } catch (error) {
        console.error('Error fetching players:', error);
        res.status(500).json({ error: 'Failed to fetch players' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const player = await playerService.getById(req.params.id);
        if (!player) {
            await res.status(404).json({ error: 'Player not found' });
        }
        await res.json(player);
    } catch (error) {
        console.error('Error fetching player:', error);
        res.status(500).json({ error: 'Failed to fetch player' });
    }
});

router.post('/', async (req, res) => {
    try {
        const player = await playerService.create(req.body);
        res.status(201).json(player);
    } catch (error) {
        console.error('Error creating player:', error);
        res.status(500).json({ error: 'Failed to create player' });
    }
});

export default router; 