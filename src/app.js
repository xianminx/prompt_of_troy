import "dotenv/config";
import express, { json } from "express";
import {
    InteractionType,
    InteractionResponseType,
    InteractionResponseFlags,
    MessageComponentTypes,
    ButtonStyleTypes,
    verifyKeyMiddleware,
} from "discord-interactions";
import { handleCommand, handleComponentInteraction } from "./cmd/index.js";
import { logger } from './utils/logger.js';



// Create an express app
const app = express();
// Get port, or default to 3000
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(verifyKeyMiddleware(process.env.DISCORD_PUBLIC_KEY));

// Logging middleware
app.use(async (req, res, next) => {
    const start = Date.now();
    
    // Log request
    await logger.logRequest(req);

    // Intercept response to log it
    const originalSend = res.send;
    res.send = async function(body) {
        const responseTime = Date.now() - start;
        await logger.logResponse(res, body, responseTime);
        return originalSend.call(this, body);
    };

    next();
});


app.post('/interactions', async (req, res) => {
    const { type } = req.body;
    if (type === InteractionType.PING) {
        await res.send({ type: InteractionResponseType.PONG });
    } else if (type === InteractionType.APPLICATION_COMMAND) {
        await handleCommand(req, res);
    } else if (type === InteractionType.MESSAGE_COMPONENT) {
        await handleComponentInteraction(req, res);
    } else {
        console.error("unknown interaction type", type);
        return res.status(400).json({ error: "unknown interaction type" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});