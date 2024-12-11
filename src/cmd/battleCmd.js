import { BattleService } from "../domain/battles/service.js";
import { InteractionResponseType } from "discord-interactions";

const battleService = new BattleService();

const BATTLE_COMMAND = {
    name: 'battle',
    description: 'Battle commands',
    options: [
        {
            name: 'start',
            description: 'Start a new battle between two prompts',
            type: 1, // SUB_COMMAND
            options: [
                {
                    name: 'red',
                    description: 'Red team prompt ID',
                    type: 3, // STRING
                    required: true
                },
                {
                    name: 'blue',
                    description: 'Blue team prompt ID',
                    type: 3, // STRING
                    required: true
                }
            ]
        },
        {
            name: 'list',
            description: 'List all battles',
            type: 1, // SUB_COMMAND
            options: [
                {
                    type: 3,
                    name: 'query',
                    description: 'Filter battles by user or prompt ID',
                    required: false,
                }
            ]
        }
    ],
    type: 1,
    integration_types: [0, 1],
    contexts: [0, 1, 2]
};

async function handleBattleCmd(req, res) {
    try {
        const subcommand = req.body.data.options[0].name;

        switch (subcommand) {
            case 'start':
                return handleBattleStart(req, res);
            case 'list':
                return handleBattleList(req, res);
            default:
                throw new Error("Invalid subcommand");
        }
    } catch (error) {
        console.error("Error in handleBattleCmd:", error);
        await sendErrorResponse(res, "An error occurred while processing your command");
    }
}

async function handleBattleStart(req, res) {
    try {
        const red = req.body.data.options[0].options[0].value;
        const blue = req.body.data.options[0].options[1].value;
        let battle = await battleService.create(red, blue);
        
        await res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: { content: `⚔️ Battle/${battle.id} started!  ${battle.status}\n 🗡️ ${battle.prompts.red.id} 🆚 🛡️ ${battle.prompts.blue.id}` },
        });
        
        battle = await battleService.runBattle(battle.id);
        await res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: { content: `Battle/${battle.id} completed! ${battle.status} ${battle.winner}` },
        });
    } catch (error) {
        console.error("Error in handleBattleStart:", error);
        await sendErrorResponse(res, `Failed to start battle: ${error.message}`);
    }
}

async function handleBattleList(req, res) {
    try {
        const query = req.body.data.options[0]?.options?.[0]?.value;
        const battles = await battleService.getAll(query);
        
        const battleTable = [
            "| Battle | Status | Winner |",
            "|---------|---------|---------|",
            ...battles.map(b => `| Battle/${b.id} | ${b.status} | ${b.winner || '-'} |`)
        ].join('\n');

        await res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: { 
                content: battles.length 
                    ? `Battles${query ? ` matching \`${query}\`` : ''}:\n${battleTable}`
                    : "No battles found" 
            },
        });
    } catch (error) {
        console.error("Error in handleBattleList:", error);
        await sendErrorResponse(res, 
            "No matching battles found. Expected formats:\n" +
            "- <@userId>\n" +
            "- prompt/<promptId>"
        );
    }
}

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

export { handleBattleCmd, BATTLE_COMMAND };