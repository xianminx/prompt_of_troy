import { Request, Response } from "express";
import { PromptService } from "../services/index";
import { InteractionResponseType, InteractionResponseFlags } from "discord-interactions";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

interface PromptCommandOption {
    type: number;
    name: string;
    description: string;
    required?: boolean;
    choices?: Array<{name: string; value: string}>;
    options?: PromptCommandOption[];
}

interface PromptCommand {
    name: string;
    description: string;
    options: PromptCommandOption[];
    type: number;
    integration_types: number[];
    contexts: number[];
}

const PROMPT_COMMAND: PromptCommand = {
    name: 'prompt',
    description: 'List / Create / Manage prompts',
    options: [
        {
            type: 1,
            name: 'list',
            description: 'List all prompts', 
            options: [
                {
                    type: 3,
                    name: 'query',
                    description: 'query ',
                    required: false,
                }
            ],
        },
        {
            type: 1, 
            name: 'create',
            description: 'Create a new prompt',
            options: [
                {
                    type: 3,
                    name: 'type',
                    description: 'The type of prompt',
                    required: true,
                    choices: [
                        {name: 'Attack', value: 'attack'},
                        {name: 'Defend', value: 'defend'},
                    ],
                },
                {
                    type: 3,
                    name: 'content',
                    description: 'The prompt content',
                    required: true
                }
            ]
        },
        {
            type: 1,
            name: 'delete',
            description: 'Delete a prompt',
            options: [
                {
                    type: 3,
                    name: 'prompt_id',
                    description: 'ID of the prompt to delete',
                    required: true
                }
            ]
        }
    ],
    type: 1,
    integration_types: [0, 1],
    contexts: [0, 1, 2]
};

const promptService = new PromptService();

async function handlePromptCmd(req: Request, res: Response): Promise<void> {
    try {
        const options = req.body.data.options;
        if (!options || options.length === 0) {
            throw new Error("No subcommand provided");
        }

        const subcommand = options[0].name;
        switch (subcommand) {
            case "list":
                await handlePromptList(req, res);
                break;
            case "create":
                await handlePromptCreate(req, res);
                break;
            case "delete":
                await handlePromptDelete(req, res);
                break;
            default:
                throw new Error("Invalid subcommand");
        }
    } catch (error) {
        console.error("Error in handlePromptCmd:", error);
        await sendErrorResponse(
            res,
            "An error occurred while processing your command"
        );
    }
}

async function handlePromptList(req: Request, res: Response): Promise<void> {
    const NO_PROMPTS_MESSAGE = "No matching prompts found. Expected formats:\n" +
                "/prompt list <query>\n" +
                '- "attack"(a) or "defend"(d)\n' +
                "- <@userId>\n" +
                "- <@userId>/attack(a) or <@userId>/defend(d)\n" +
                "- <@userId>/attack(a)/codename or <@userId>/defend(d)/codename"
    try {
        const query = req.body.data.options[0]?.options?.[0]?.value;
        console.log("query: ", query);
        const prompts = await promptService.getAll(query);
        
        if (prompts.length === 0) {
            await res.send({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                    content: NO_PROMPTS_MESSAGE,
                },
            });
            return;
        }

        // Create one action row per prompt
        const actionRows = prompts.map((p, i) => {
            const label = `<@${p.createdBy}>/${p.type}/${p.codeName}`
            const button = new ButtonBuilder()
                .setCustomId(`battle_${p.id}`)
                .setLabel(`Battle ${label}`)
                .setStyle(ButtonStyle.Primary);

            const row = new ActionRowBuilder<ButtonBuilder>()
                .addComponents(button);

            return {
                content: `${i + 1}. <@${p.createdBy}>/${p.type}/${p.codeName}`,
                row
            };
        });

        // Combine into a single message
        const content = actionRows.map(item => item.content).join('\n');
        const components = actionRows.map(item => item.row);

        await res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                content: `Prompts:\n${content}`,
                components: components
            },
        });
    } catch (error) {
        console.error("Error in handlePromptList:", error);
        await sendErrorResponse(
            res,
            NO_PROMPTS_MESSAGE
        );
    }
}

async function handlePromptCreate(req: Request, res: Response): Promise<void> {
    try {
        const user =
            req.body.context === 0 ? req.body.member.user : req.body.user;
        if (!user) {
            throw new Error("User information not found");
        }

        const userId = user.id;
        const createOptions = req.body.data.options[0]?.options;

        if (!createOptions) {
            throw new Error("No prompt options provided");
        }

        const type = createOptions.find((opt: PromptCommandOption) => opt.name === "type")?.value;
        const content = createOptions.find(
            (opt: PromptCommandOption) => opt.name === "content"
        )?.value;

        if (!type || !content) {
            throw new Error(
                "Missing required fields: type and content are required"
            );
        }

        const prompt = await promptService.create(userId, type, content);
        console.log("createPrompt: ", { userId, type, content });

        await res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                content: `<@${userId}> created \`${type}/${prompt.codeName}\``,
            },
        });
    } catch (error) {
        console.error("Error in handlePromptCreate:", error);
        await sendErrorResponse(
            res,
            `Failed to create prompt: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
    }
}

async function handlePromptDelete(req: Request, res: Response): Promise<void> {
    try {
        const promptId = req.body.data.options[0]?.options[0]?.value;
        if (!promptId) {
            throw new Error("No prompt ID provided");
        }

        await promptService.delete(promptId);
        await res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: { content: `Deleted prompt with ID: ${promptId}` },
        });
    } catch (error) {
        console.error("Error in handlePromptDelete:", error);
        await sendErrorResponse(
            res,
            `Failed to delete prompt: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
    }
}

async function sendErrorResponse(res: Response, message: string): Promise<void> {
    try {
        await res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                content: message,
                flags: 64, // Makes the error message ephemeral (only visible to the user)
            },
        });
    } catch (error) {
        console.error("Failed to send error response:", error);
    }
}

export { handlePromptCmd, PROMPT_COMMAND }; 