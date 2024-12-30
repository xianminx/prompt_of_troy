/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { PromptService } from "../services/index";
import {
    InteractionResponseType,
    InteractionResponseFlags,
} from "discord-interactions";
import { getDiscordUser } from ".";
import { PromptQuery, PromptType } from "@/types/prompt";
// import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

interface PromptCommandOption {
    type: number;
    name: string;
    description: string;
    required?: boolean;
    choices?: Array<{ name: string; value: string }>;
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
    name: "prompt",
    description: "List / Create / Manage prompts",
    options: [
        {
            type: 1,
            name: "list",
            description: "List all prompts",
            options: [
                {
                    type: 3,
                    name: "query",
                    description: "query ",
                    required: false,
                },
            ],
        },
        {
            type: 1,
            name: "create",
            description: "Create a new prompt",
            options: [
                {
                    type: 3,
                    name: "type",
                    description: "The type of prompt",
                    required: true,
                    choices: [
                        { name: "Attack", value: "attack" },
                        { name: "Defend", value: "defend" },
                    ],
                },
                {
                    type: 3,
                    name: "content",
                    description: "The prompt content",
                    required: true,
                },
            ],
        },
        {
            type: 1,
            name: "delete",
            description: "Delete a prompt",
            options: [
                {
                    type: 3,
                    name: "prompt_id",
                    description: "ID of the prompt to delete",
                    required: true,
                },
            ],
        },
    ],
    type: 1,
    integration_types: [0, 1],
    contexts: [0, 1, 2],
};

function parsePromptQuery(queryString: string | undefined): {
    createdBy?: string;
    type?: string;
    codeName?: string;
} {
    const query: any = {};

    if (!queryString) {
        return query;
    }

    // Parse user mention format: <@userId>
    const userMentionMatch = queryString.match(/<@(\d+)>/);

    // Parse type shortcuts
    const typeMatch = queryString.match(/^(attack|defend|a|d)$/i);

    // Parse combined format: <@userId>/type/codename
    const combinedMatch = queryString.match(
        /<@(\d+)>\/(attack|defend|a|d)(?:\/(\w+))?/i
    );

    if (combinedMatch) {
        // Format: <@userId>/type[/codename]
        query.createdBy = combinedMatch[1];
        query.type = combinedMatch[2].toLowerCase().startsWith("a")
            ? "attack"
            : "defend";
        if (combinedMatch[3]) {
            query.codeName = combinedMatch[3];
        }
    } else if (userMentionMatch) {
        // Format: <@userId>
        query.createdBy = userMentionMatch[1];
    } else if (typeMatch) {
        // Format: attack|defend|a|d
        query.type = typeMatch[1].toLowerCase().startsWith("a")
            ? "attack"
            : "defend";
    } else {
        // Use as general search query
        query.query = queryString;
    }

    return query;
}

async function handlePromptCmd(body: any) {
    try {
        const options = body.data.options;
        if (!options || options.length === 0) {
            throw new Error("No subcommand provided");
        }

        const subcommand = options[0].name;
        switch (subcommand) {
            case "list":
                return await handlePromptList(body);
            case "create":
                return await handlePromptCreate(body);
            case "delete":
                return await handlePromptDelete(body);
            default:
                throw new Error("Invalid subcommand");
        }
    } catch (error) {
        console.error("Error in handlePromptCmd:", error);
        return sendErrorResponse(
            "An error occurred while processing your command"
        );
    }
}

async function handlePromptList(body: any) {
    const NO_PROMPTS_MESSAGE =
        "No matching prompts found. Expected formats:\n" +
        "/prompt list <query>\n" +
        '- "attack"(a) or "defend"(d)\n' +
        "- <@userId>\n" +
        "- <@userId>/attack(a) or <@userId>/defend(d)\n" +
        "- <@userId>/attack(a)/codename or <@userId>/defend(d)/codename";
    try {
        const queryString = body.data.options[0]?.options?.[0]?.value;
        console.log("query: ", queryString);

        const { createdBy, type, codeName } = parsePromptQuery(queryString);
        const query: PromptQuery = {
            createdBy: createdBy,
            type: type as PromptType,
            codeName,
        };
        const paginatedPrompts = await PromptService.getInstance().getAll(
            query
        );

        if (paginatedPrompts.length === 0) {
            return NextResponse.json({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                    content: NO_PROMPTS_MESSAGE,
                },
            });
        }

        // Create one action row per prompt
        const actionRows = paginatedPrompts.map((p, i) => {
            return {
                content: `${i + 1}. <@${p.createdBy}>/${p.type}/${p.codeName} (id: \`${p.id}\`)`,
                // row
            };
        });

        const content = actionRows.map((item) => item.content).join("\n");
        // const components = actionRows.map(item => item.row);

        return NextResponse.json({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                content: `Prompts:\n${content}`,
                // components: components
            },
        });
    } catch (error) {
        console.error("Error in handlePromptList:", error);
        return sendErrorResponse(NO_PROMPTS_MESSAGE);
    }
}

async function handlePromptCreate(body: any) {
    try {
        const user = await getDiscordUser(body);

        const userId = user.id;
        const createOptions = body.data.options[0]?.options;

        if (!createOptions) {
            throw new Error("No prompt options provided");
        }

        const type = createOptions.find(
            (opt: PromptCommandOption) => opt.name === "type"
        )?.value;
        const content = createOptions.find(
            (opt: PromptCommandOption) => opt.name === "content"
        )?.value;

        if (!type || !content) {
            throw new Error(
                "Missing required fields: type and content are required"
            );
        }

        const prompt = await PromptService.getInstance().create(
            userId,
            type,
            content
        );
        console.log("createPrompt: ", { userId, type, content });

        return NextResponse.json({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                content: `<@${userId}> created \`${type}/${prompt.codeName}\``,
            },
        });
    } catch (error) {
        console.error("Error in handlePromptCreate:", error);
        return sendErrorResponse(
            `Failed to create prompt: ${
                error instanceof Error ? error.message : "Unknown error"
            }`
        );
    }
}

async function handlePromptDelete(body: any) {
    try {
        const promptId = body.data.options[0]?.options[0]?.value;
        if (!promptId) {
            throw new Error("No prompt ID provided");
        }

        await PromptService.getInstance().delete(promptId);
        return NextResponse.json({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: { content: `Deleted prompt with ID: ${promptId}` },
        });
    } catch (error) {
        console.error("Error in handlePromptDelete:", error);
        return sendErrorResponse(
            `Failed to delete prompt: ${
                error instanceof Error ? error.message : "Unknown error"
            }`
        );
    }
}

function sendErrorResponse(message: string) {
    return NextResponse.json({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            content: message,
            flags: InteractionResponseFlags.EPHEMERAL, // Makes the error message ephemeral
        },
    });
}

export { handlePromptCmd, PROMPT_COMMAND };
