export { Player } from './player.js';
export { PlayerService } from './service.js'; 

import { PlayerService } from './service.js';
async function test() {
    try {   
        const playerService = new PlayerService();
        const player = await playerService.getById("id-1");
        // const player = await playerService.create({ id: "test-user", name: "test-name" });
        console.log(player);
    } catch (error) {
        console.error(error);
    }
}

test();