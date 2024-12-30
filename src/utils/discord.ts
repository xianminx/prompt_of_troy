import { APIApplicationCommand } from "discord.js";

// Server component for fetching data
export async function fetchGlobalCommands() {
    try {
      const commands = await fetch(`https://discord.com/api/v8/applications/${process.env.DISCORD_APP_ID}/commands`, {
        headers: {
          Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
        },
        next: { revalidate: 60 * 5 },
      }).then((res) => res.json() as Promise<APIApplicationCommand[]>);
      
      return commands;
    } catch (error) {
      console.error('Error fetching commands:', error);
      throw error;
    }
  }