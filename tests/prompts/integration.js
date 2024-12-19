import { PromptService, PlayerService } from "../../src/domain/index.js";

async function main() {
    try {
        const promptService = new PromptService();
        const playerService = new PlayerService();

        
        let player = await playerService.getById("test-user");
        console.log({player});
        if (!player) {
            console.log("Creating player");
            player = await playerService.create("test-user", "test-name");
            console.log("Player created");
        }


        const prompt = await promptService.create("test-user", "defense", "test content");

        console.log(prompt);
    } catch (error) {
        console.error(error);
    }
}

main();
