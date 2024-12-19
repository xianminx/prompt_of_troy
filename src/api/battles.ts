import express from 'express';
import { BattleService } from '../services/BattleService';

const router = express.Router();
const battleService = new BattleService();

router.get('/', async (req, res) => {
    try {
        const battles = await battleService.getAll();
        res.json(battles);
    } catch (error) {
        console.error('Error fetching battles:', error);
        res.status(500).json({ error: 'Failed to fetch battles' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const battle = await battleService.getById(req.params.id);
        if (!battle) {
            await res.status(404).json({ error: 'Battle not found' });
        }
        await res.json(battle);
    } catch (error) {
        console.error('Error fetching battle:', error);
        await res.status(500).json({ error: 'Failed to fetch battle' });
    }
});

// router.post('/', async (req, res) => {
//     try {
//         const battle = await battleService.create(req.body);
//         await res.status(201).json(battle);
//     } catch (error) {
//         console.error('Error creating battle:', error);
//         await res.status(500).json({ error: 'Failed to create battle' });
//     }
// });

export default router; 