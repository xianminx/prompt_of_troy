import crypto from 'crypto';
const adjectives = [
    "winter",
    "iron",
    "golden",
    "dark",
    "wild",
    "crimson",
    "black",
    "white",
    "red",
    "storm",
    "shadow",
    "frost",
    "northern",
    "southern",
    "eastern",
    "western",
    "valyrian",
    "dothraki",
    "braavosi",
    "dornish",
    "free",
    "royal",
    "noble",
    "ancient",
    "savage",
    "silent",
    "bloody",
    "burning",
    "frozen",
    "cold",
    "ice",
    "fire",
    "dragon",
    "wolf",
    "lion",
    "stag",
    "kraken",
    "falcon",
    "sun",
    "star",
    "moon",
    "night",
    "dawn",
    "dusk",
    "twilight",
    "broken",
    "lost",
    "forgotten",
    "cursed",
    "blessed",
];

const nouns = [
    "wolf",
    "dragon",
    "lion",
    "stag",
    "raven",
    "crow",
    "direwolf",
    "throne",
    "sword",
    "king",
    "knight",
    "queen",
    "castle",
    "keep",
    "tower",
    "wall",
    "gate",
    "bridge",
    "river",
    "mountain",
    "sea",
    "island",
    "hand",
    "crown",
    "shield",
    "banner",
    "realm",
    "kingdom",
    "winterfell",
    "kingslanding",
    "dragonstone",
    "highgarden",
    "sunspear",
    "pyke",
    "riverrun",
    "eyrie",
    "storm",
    "reach",
    "vale",
    "north",
    "south",
    "east",
    "west",
    "guard",
    "watch",
    "warrior",
    "maester",
    "lord",
    "lady",
    "prince",
    "princess",
    "bastard",
];

function generateCodeName(content) {
    let randomAdjective, randomNoun;
    
    if (!content) {
        randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
        randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    } else {
        const hash = crypto.createHash('md5').update(content).digest('hex');
        const adjIndex = parseInt(hash.substring(0, 2), 16);
        const nounIndex = parseInt(hash.substring(2, 4), 16);
        randomAdjective = adjectives[adjIndex % adjectives.length];
        randomNoun = nouns[nounIndex % nouns.length];
    }

    return `${randomAdjective}_${randomNoun}`;
}

export {
    generateCodeName,
};
