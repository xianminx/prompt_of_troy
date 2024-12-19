import fs from 'fs/promises';
import path from 'path';
import { Request, Response } from 'express';
const LOG_DIR = 'logs';

class Logger {
    constructor() {
        this.ensureLogDirectory();
    }

    async ensureLogDirectory() {
        try {
            await fs.access(LOG_DIR);
        } catch {
            await fs.mkdir(LOG_DIR);
        }
    }

    async log(type: string, data: any) {
        const date = new Date();
        const fileName = `${date.toISOString().split('T')[0]}.log`;
        const filePath = path.join(LOG_DIR, fileName);
        
        const logEntry = {
            timestamp: date.toISOString(),
            type,
            data
        };

        try {
            const logLine = JSON.stringify(logEntry) + '\n';
            await fs.appendFile(filePath, logLine);
        } catch (error) {
            console.error('Failed to write to log file:', error);
        }
    }

    async logRequest(req: Request) {
        const requestData = {
            method: req.method,
            url: req.url,
            headers: req.headers,
            body: req.body,
        };
        await this.log('REQUEST', requestData);
        console.log('REQUEST', requestData);
    }

    async logResponse(res: Response, body: any, responseTime: number) {
        const responseData = {
            statusCode: res.statusCode,
            headers: res.getHeaders(),
            body,
            responseTime,
        };
        await this.log('RESPONSE', responseData);
        console.log('RESPONSE', responseData);
    }
}

export const logger = new Logger();