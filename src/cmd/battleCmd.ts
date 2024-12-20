import { BattleService } from "../services/index";
import { InteractionResponseType, InteractionResponseFlags } from "discord-interactions";
import { NextRequest, NextResponse } from "next/server";

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

async function handleBattleCmd(req: NextRequest) {
    try {
        const body = await req.json();
        const subcommand = body.data.options[0].name;

        switch (subcommand) {
            case 'start':
                return handleBattleStart(req);
            case 'list':
                return handleBattleList(req);
            default:
                throw new Error("Invalid subcommand");
        }
    } catch (error) {
        console.error("Error in handleBattleCmd:", error);
        return sendErrorResponse("An error occurred while processing your command");
    }
}

async function handleBattleStart(req: NextRequest) {
    try {
        const body = await req.json();
        const red = body.data.options[0].options[0].value;
        const blue = body.data.options[0].options[1].value;
        let battle = await battleService.create(red, blue);
        
        const initialResponse = NextResponse.json({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: { content: `⚔️ Battle/${battle.id} started!  ${battle.status}\n 🗡️ ${battle.attackPromptId} 🆚 🛡️ ${battle.defendPromptId}` },
        });
        
        battle = await battleService.runBattle(battle.id);
        
        // Note: In Next.js we can only send one response, so we'll combine the messages
        return NextResponse.json({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: { 
                content: [
                    `⚔️ Battle/${battle.id} started!  ${battle.status}\n 🗡️ ${battle.attackPromptId} 🆚 🛡️ ${battle.defendPromptId}`,
                    `Battle/${battle.id} completed! ${battle.status} ${battle.winner}`
                ].join('\n\n')
            },
        });
    } catch (error: unknown) {
        console.error("Error in handleBattleStart:", error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return sendErrorResponse(`Failed to start battle: ${errorMessage}`);
    }
}

async function handleBattleList(req: NextRequest) {
    try {
        const body = await req.json();
        const query = body.data.options[0]?.options?.[0]?.value;
        const battles = await battleService.getAll(query);
        
        const battleTable = [
            "| Battle | Status | Winner |",
            "|---------|---------|---------|",
            ...battles.map(b => `| Battle/${b.id} | ${b.status} | ${b.winner || '-'} |`)
        ].join('\n');

        return NextResponse.json({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: { 
                content: battles.length 
                    ? `Battles${query ? ` matching \`${query}\`` : ''}:\n${battleTable}`
                    : "No battles found" 
            },
        });
    } catch (error) {
        console.error("Error in handleBattleList:", error);
        return sendErrorResponse(
            "No matching battles found. Expected formats:\n" +
            "- <@userId>\n" +
            "- prompt/<promptId>"
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

export { handleBattleCmd, BATTLE_COMMAND };