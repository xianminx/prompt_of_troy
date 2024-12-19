import {
    InteractionResponseType,
    InteractionType,
    verifyKeyMiddleware
} from "discord-interactions";
import express, { NextFunction, Request, Response } from "express";
import { handleCommand, handleComponentInteraction } from "./cmd/index";
import { logger } from './utils/logger';
import promptsRouter from './api/prompts';
import path from 'path';
import battlesRouter from './api/battles';
import playersRouter from './api/players';

// Create an express app
const app = express();
// Get port, or default to 3000
const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../dist/public')));

// Add route for home page
app.get('/web', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../dist/public/index.html'));
});

// Add the prompts API router
app.use('/api/prompts', promptsRouter);
app.use('/api/battles', battlesRouter);
app.use('/api/players', playersRouter);

// Logging middleware
app.use(async (req: Request, res: Response, next: NextFunction) => {
    const start: number = Date.now();
    
    // Log request
    await logger.logRequest(req);

    // Intercept response to log it
    const originalSend = res.send;
    res.send = function(body: any) {
        const responseTime: number = Date.now() - start;
        // Log response asynchronously without awaiting
        logger.logResponse(res, body, responseTime);
        return originalSend.call(this, body);
    };

    next();
});

// Apply verification middleware only to /interactions endpoint
app.post('/interactions', verifyKeyMiddleware(process.env.DISCORD_PUBLIC_KEY as string), async (req: Request, res: Response) => {
    const { type } = req.body;
    
    if (type === InteractionType.PING) {
        await res.send({ type: InteractionResponseType.PONG });
    } else if (type === InteractionType.APPLICATION_COMMAND) {
        await handleCommand(req, res);
    } else if (type === InteractionType.MESSAGE_COMPONENT) {
        await handleComponentInteraction(req, res);
    } else {
        console.error("unknown interaction type", type);
        res.status(400).json({ error: "unknown interaction type" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 