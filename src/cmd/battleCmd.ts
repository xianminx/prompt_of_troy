/* eslint-disable @typescript-eslint/no-explicit-any */
import { BattleService } from "../services/index";
import {
    InteractionResponseType,
    InteractionResponseFlags,
} from "discord-interactions";
import { NextResponse } from "next/server";
import { Battle } from "../types/battle";
import { getDiscordUser } from ".";
import { after } from "next/server";

const BATTLE_COMMAND = {
    name: "battle",
    description: "Battle commands",
    options: [
        {
            name: "start",
            description: "Start a new battle between two prompts",
            type: 1, // SUB_COMMAND
            options: [
                {
                    name: "red",
                    description: "Red team prompt ID",
                    type: 3, // STRING
                    required: true,
                },
                {
                    name: "blue",
                    description: "Blue team prompt ID",
                    type: 3, // STRING
                    required: true,
                },
            ],
        },
        {
            name: "list",
            description: "List all battles",
            type: 1, // SUB_COMMAND
            options: [
                {
                    type: 3,
                    name: "query",
                    description: "Filter battles by user or prompt ID",
                    required: false,
                },
            ],
        },
    ],
    type: 1,
    integration_types: [0, 1],
    contexts: [0, 1, 2],
};

async function handleBattleCmd(body: any) {
    try {
        const subcommand = body.data.options[0].name;

        switch (subcommand) {
            case "start":
                return handleBattleStart(body);
            case "list":
                return handleBattleList(body);
            default:
                throw new Error("Invalid subcommand");
        }
    } catch (error) {
        console.error("Error in handleBattleCmd:", error);
        return sendErrorResponse(
            "An error occurred while processing your command"
        );
    }
}

// Function to send a message to Discord and get message ID
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function sendMessageToDiscord(channelId: string, content: string) {
    const response = await fetch(
        `https://discord.com/api/v10/channels/${channelId}/messages`,
        {
            method: "POST",
            headers: {
                Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
                "Content-Type": "application/json; charset=UTF-8",
                "User-Agent":
                    "DiscordBot (https://github.com/discord/discord-example-app, 1.0.0)",
            },
            body: JSON.stringify({ content }),
        }
    );

    return response.json();
}

async function sendFollowupMessage(application_id: string, token: string, content: string) {
    await fetch(
        `https://discord.com/api/v10/webhooks/${application_id}/${token}`,
        {
            method: "POST",
            headers: {
                Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ content }),
        }
    );
}

async function runBattleAsync(
    battle: Battle,
    application_id: string,
    token: string,
    attack: string,
    defend: string
) {
    try {
        battle = await BattleService.getInstance().runBattle(battle.id);

        const formatChange = (change: number) =>
            change > 0 ? `+${change}` : change;

        const { attacker, defender } = battle.ratingChanges || {};
        const attackRate = `${attacker?.after}/${formatChange(
            attacker?.change || 0
        )}`;
        const defendRate = `${defender?.after}/${formatChange(
            defender?.change || 0
        )}`;
        const rateChangeMessage = `\n* ${attack}: \`${attackRate}\` \n* ${defend}: \`${defendRate}\` \n `;

        const attackerWinMessageTemplate = `🏆  <ATTACKER> delivers a devastating blow! The defense of <DEFENDER> collapses under the force of a relentless assault. Victory belongs to the unstoppable attacker!`;

        const defenderWinMessageTemplate = `🏆  <DEFENDER> stands unshaken! The relentless assault is neutralized by an impenetrable defense. Victory belongs to the steadfast protector! `;

        const winnerMessageTemplate =
            battle.winner === "attack"
                ? attackerWinMessageTemplate
                : defenderWinMessageTemplate;

        const winnerMessage = winnerMessageTemplate
            .replace("<ATTACKER>", attack)
            .replace("<DEFENDER>", defend);

        const finalMessage = `⚔️ Battle/\`${battle.id}\` \`${(
            battle.status || ""
        ).toUpperCase()}\`! \n${winnerMessage} ${rateChangeMessage}`;

        // Send battle result as a followup message
        await sendFollowupMessage(application_id, token, finalMessage);

    } catch (error) {
        console.error("Error in runBattleAsync:", error);
        try {
            const errorMessage = `⚠️ Battle/\`${battle.id}\` failed! An error occurred while running the battle.`;
            await sendFollowupMessage(application_id, token, errorMessage);
        } catch (followupError) {
            console.error("Failed to send error message:", followupError);
        }
    }
}

async function handleBattleStart(body: any) {
    try {
        const red = body.data.options[0].options[0].value;
        const blue = body.data.options[0].options[1].value;
        const battle = await BattleService.getInstance().create(red, blue);
        const channelId = body?.channel_id;
        const { token, application_id } = body;

        if (!channelId) {
            return NextResponse.json(
                { error: "Channel ID not found" },
                { status: 400 }
            );
        }
        const { attackPrompt, defendPrompt } = battle;

        const attack = `<@${battle.attackerId}>\`/attack/${attackPrompt?.codeName}\``;
        const defend = `<@${battle.defenderId}>\`/defend/${defendPrompt?.codeName}\``;

        // First, respond to the interaction with the starting message
        const battleStartMessage = `⚔️ Battle/\`${battle.id}\` \`STARTING...\` \n🗡️ ${attack}    🆚    🛡️ ${defend}`;

        // Send immediate response to Discord to acknowledge the command
        const response = NextResponse.json({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                content: battleStartMessage,
            },
        });

        // Run the battle and update the message asynchronously
        after(() =>
            runBattleAsync(battle, application_id, token, attack, defend)
        );

        return response;
    } catch (error: unknown) {
        console.error("Error in handleBattleStart:", error);
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error occurred";
        return sendErrorResponse(`Failed to start battle: ${errorMessage}`);
    }
}

// list my battles
async function handleBattleList(body: any) {
    try {
        const user = await getDiscordUser(body);
        const query: any = { participantId: user.id };

        const battles = await BattleService.getInstance().getAll(query);

        const battleTable = [
            "| Battle | Status | Winner |",
            "|---------|---------|---------|",
            ...battles.map(
                (b: Battle) =>
                    `| Battle/${b.id} | ${b.status} | ${b.winner || "-"} |`
            ),
        ].join("\n");

        return NextResponse.json({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                content: battles.length
                    ? `Battles${
                          query ? ` matching \`${query}\`` : ""
                      }:\n${battleTable}`
                    : "No battles found",
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
