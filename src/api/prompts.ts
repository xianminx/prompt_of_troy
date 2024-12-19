import express from 'express';
import { PromptService } from '../services/PromptService';
import { mockPrompts } from './mock';

const router = express.Router();
const promptService = new PromptService();

router.get('/', async (req, res) => {
    try {
        const query = req.query.q as string;
        // const prompts = await promptService.getAll(query);
        const prompts = mockPrompts;
        res.json(prompts);
    } catch (error) {
        console.error('Error fetching prompts:', error);
        res.status(500).json({ error: 'Failed to fetch prompts' });
    }
});

export default router; 