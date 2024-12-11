
import { InteractionResponseType } from "discord-interactions";

async function handleTestCmd(req, res) {
    await res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: { content: "Hello, world!" },
    });
}

// Simple test command
const TEST_COMMAND = {
    name: 'test',
    description: 'Basic command',
    type: 1,
    integration_types: [0, 1],
    contexts: [0, 1, 2],
  };
  

export { handleTestCmd, TEST_COMMAND };