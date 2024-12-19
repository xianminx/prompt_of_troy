import { jest } from "@jest/globals";
import { PromptService } from "../../src/domain/prompts/service.js";
import { promptsDb } from "../../src/db/prompts.js";
import { PlayerService } from "../../src/domain/players/index.js";
import { Prompt } from "../../src/domain/prompts/prompt.js";
// , () => ({
//     promptsDb: {
//         getById: jest.fn(),
//         getAll: jest.fn(),
//         create: jest.fn(),
//         delete: jest.fn()
//     }
// })
// jest.mock("../../src/db/prompts.js");

describe("PromptService", () => {
    let promptService;

    beforeEach(() => {
        jest.clearAllMocks();
        promptService = new PromptService();
    });

    describe("getById", () => {
        it("should return null when prompt not found", async () => {
            promptsDb.getById = jest.fn().mockImplementation(() =>
                null
            );

            const result = await promptService.getById("non-existent-id");

            expect(result).toBeNull();
            expect(promptsDb.getById).toHaveBeenCalledWith("non-existent-id");
        });

        it("should return Prompt instance when found", async () => {
            const mockPromptData = {
                id: "test-id",
                codeName: "test-code",
                type: "test-type",
                content: "test content",
                createdBy: "user123",
                createdAt: new Date(),
            };
            promptsDb.getById = jest.fn().mockResolvedValue(mockPromptData);

            const result = await promptService.getById("test-id");

            expect(result).toBeInstanceOf(Prompt);
            expect(result).toEqual(expect.objectContaining(mockPromptData));
        });
    });

    describe("getAll", () => {
        it("should return array of Prompt instances", async () => {
            const mockPrompts = [
                {
                    id: "test-id-1",
                    codeName: "test-code-1",
                    type: "test-type",
                    content: "test content 1",
                    createdBy: "user123",
                },
                {
                    id: "test-id-2",
                    codeName: "test-code-2",
                    type: "test-type",
                    content: "test content 2",
                    createdBy: "user123",
                },
            ];
            promptsDb.getAll = jest.fn().mockResolvedValue(mockPrompts);

            const result = await promptService.getAll({ type: "test-type" });

            expect(result).toHaveLength(2);
            expect(result[0]).toBeInstanceOf(Prompt);
            expect(result[1]).toBeInstanceOf(Prompt);
            expect(promptsDb.getAll).toHaveBeenCalledWith({
                type: "test-type",
            });
        });

        it("should handle errors when getting prompts", async () => {
            promptsDb.getAll.mockRejectedValue(new Error("DB error"));

            await expect(promptService.getAll({})).rejects.toThrow(
                "Failed to retrieve prompts"
            );
        });
    });

    describe("create", () => {
        it("should create new prompt and player if user does not exist", async () => {
            const userId = "new-user";
            const type = "test-type";
            const content = "test content";

            PlayerService.prototype.getById = jest.fn().mockResolvedValue(null);

            const result = await promptService.create(userId, type, content);

            expect(PlayerService.prototype.create).toHaveBeenCalledWith(
                userId,
                `Player_${userId}`
            );
            expect(result).toBeInstanceOf(Prompt);
            expect(promptsDb.create).toHaveBeenCalled();
        });

        it("should create new prompt if user exists", async () => {
            const userId = "existing-user";
            const type = "test-type";
            const content = "test content";

            PlayerService.prototype.getById = jest.fn().mockResolvedValue({ id: userId });

            const result = await promptService.create(userId, type, content);

            expect(PlayerService.prototype.create).not.toHaveBeenCalled();
            expect(result).toBeInstanceOf(Prompt);
            expect(promptsDb.create).toHaveBeenCalled();
        });
    });

    describe("delete", () => {
        it("should call promptsDb.delete with correct id", async () => {
            await promptService.delete("test-id");

            expect(promptsDb.delete).toHaveBeenCalledWith("test-id");
        });
    });

    describe("create", () => {
        it("should create new prompt and player if user does not exist", async () => {
            const userId = "new-user";
            const type = "defense";
            const content = "test content";

            const result = await promptService.create(userId, type, content);

            expect(result).toBeInstanceOf(Prompt);
            // expect(promptsDb.create).toHaveBeenCalled();

            const saved = await promptsDb.getById(result.id);

            expect(saved).toBeInstanceOf(Prompt);
            expect(saved.id).toBe(result.id);
            expect(saved.codeName).toBe(`<@${userId}>/${type}/mock-code-name`);
            expect(saved.type).toBe(type);
            expect(saved.content).toBe(content);
            expect(saved.createdBy).toBe(userId);
            expect(saved.createdAt).toBeDefined();


        });
    });
});
