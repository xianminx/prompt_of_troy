import { generateVariableLengthSecret } from '../../utils/secretKeyGenerator.js';

export const BATTLE_STATUS = {
    PENDING: 'pending',
    RUNNING: 'running',
    COMPLETED: 'completed',
    ERROR: 'error'
};

export class Battle {
    constructor({
        id,
        date,
        attackerId,
        defenderId,
        attackPromptId,
        defendPromptId,
        status,
        winner,
        secret,
        ratingChanges,
        error,
        startedAt,
        completedAt
    }) {
        this.id = id;
        this.date = date;
        this.attackerId = attackerId;
        this.defenderId = defenderId;
        this.attackPromptId = attackPromptId;
        this.defendPromptId = defendPromptId;
        this.status = status;
        this.winner = winner;
        this.secret = secret;
        this.ratingChanges = ratingChanges;
        this.error = error;
        this.startedAt = startedAt;
        this.completedAt = completedAt;
    }

    static create({ attackPromptId, defendPromptId, attackerId, defenderId }) {
        return new Battle({
            id: crypto.randomUUID(),
            date: Math.floor(Date.now() / 1000),
            attackerId,
            defenderId,
            attackPromptId,
            defendPromptId,
            status: BATTLE_STATUS.PENDING,
            winner: null,
            secret: generateVariableLengthSecret(),
            ratingChanges: null,
            error: null,
            startedAt: null,
            completedAt: null
        });
    }

    getDuration() {
        if (!this.startedAt || !this.completedAt) {
            return null;
        }
        return this.completedAt - this.startedAt;
    }

    isComplete() {
        return this.status === BATTLE_STATUS.COMPLETED;
    }

    hasError() {
        return this.status === BATTLE_STATUS.ERROR;
    }

    isPending() {
        return this.status === BATTLE_STATUS.PENDING;
    }

    isRunning() {
        return this.status === BATTLE_STATUS.RUNNING;
    }

    setRunning() {
        this.status = BATTLE_STATUS.RUNNING;
        this.startedAt = Date.now();
        return this;
    }

    setError(error) {
        this.status = BATTLE_STATUS.ERROR;
        this.error = error;
        this.completedAt = Date.now();
        return this;
    }

    setComplete(winner, ratingChanges) {
        this.status = BATTLE_STATUS.COMPLETED;
        this.winner = winner;
        this.ratingChanges = ratingChanges;
        this.completedAt = Date.now();
        return this;
    }
} 