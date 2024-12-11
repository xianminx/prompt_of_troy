const users = [];

const DEFAULT_RATING = 1200;

function getPlayer(id) {
    const player = users.find((p) => p.id === id);
    if (!player) {
        player = createPlayer(id);
        users.push(player);
    }
    return player;
}

function createPlayer(id) {
    return {
        id,
        rating: DEFAULT_RATING,
    };
}

function updatePlayerRating(id, rating) {
    const player = users.find((p) => p.id === id);
    player.rating = rating;
}

export { getPlayer, createPlayer, updatePlayerRating };
