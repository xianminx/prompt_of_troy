import { PromptService } from "../domain/prompts/index.js";
import { InteractionResponseType } from "discord-interactions";

const PROMPT_COMMAND = {
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

async function handlePromptCmd(req, res) {
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

async function handlePromptList(req, res) {
    try {
        const query = req.body.data.options[0]?.options[0]?.value;
        const prompts = await promptService.getAll(query);
        const promptList = prompts
            .map((p, i) => `${i + 1}. ${p.id}`)
            .join("\n");

        await res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                content: promptList.length
                    ? `Prompts matching \`${query}\`:\n${promptList}`
                    : "No prompts available",
            },
        });
    } catch (error) {
        console.error("Error in handlePromptList:", error);
        await sendErrorResponse(
            res,
            "No matching prompts found, Expected formats:\n" +
                '- "attack"(a) or "defend"(d)\n' +
                "- <@userId>\n" +
                "- <@userId>/attack(a) or <@userId>/defend(d)\n" +
                "- <@userId>/attack(a)/codename or <@userId>/defend(d)/codename"
        );
    }
}

async function handlePromptCreate(req, res) {
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

        const type = createOptions.find((opt) => opt.name === "type")?.value;
        const content = createOptions.find(
            (opt) => opt.name === "content"
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
            `Failed to create prompt: ${error.message}`
        );
    }
}

async function handlePromptDelete(req, res) {
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
            `Failed to delete prompt: ${error.message}`
        );
    }
}

// Helper function for consistent error responses
async function sendErrorResponse(res, message) {
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
