import { SelectPrompt as Prompt, SelectBattle as Battle, SelectPlayer as Player } from "../../db";



export const mockPlayers: Player[] = [
    { id: '1', name: 'Alice Chen', rating: 1800, wins: 15, losses: 5, draws: 0, createdAt: new Date(), updatedAt: new Date() },
    { id: '2', name: 'Bob Smith', rating: 1650, wins: 10, losses: 8, draws: 2, createdAt: new Date(), updatedAt: new Date() },
    { id: '3', name: 'Carol Wu', rating: 2000, wins: 25, losses: 3, draws: 1, createdAt: new Date(), updatedAt: new Date() },
    { id: '4', name: 'David Jones', rating: 1550, wins: 5, losses: 7, draws: 3, createdAt: new Date(), updatedAt: new Date() },
    { id: '5', name: 'Elena Garcia', rating: 1900, wins: 20, losses: 10, draws: 0, createdAt: new Date(), updatedAt: new Date() },
    { id: '6', name: 'Frank Lee', rating: 1700, wins: 12, losses: 8, draws: 4, createdAt: new Date(), updatedAt: new Date() },
    { id: '7', name: 'Grace Kim', rating: 1850, wins: 18, losses: 7, draws: 2, createdAt: new Date(), updatedAt: new Date() },
    { id: '8', name: 'Henry Patel', rating: 1600, wins: 8, losses: 12, draws: 1, createdAt: new Date(), updatedAt: new Date() },
    { id: '9', name: 'Isabel Santos', rating: 1750, wins: 14, losses: 6, draws: 3, createdAt: new Date(), updatedAt: new Date() },
    { id: '10', name: 'James Wilson', rating: 1950, wins: 22, losses: 4, draws: 2, createdAt: new Date(), updatedAt: new Date() }
];

export const mockPrompts: Prompt[] = [
    { id: '1', codeName: 'time_traveler', type: 'attack', content: 'Write a story about a time traveler who changes history', createdBy: mockPlayers[Math.floor(Math.random() * mockPlayers.length)].name, createdAt: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 3) },
    { id: '2', codeName: 'perfect_day', type: 'defend', content: 'Describe your perfect day', createdBy: mockPlayers[Math.floor(Math.random() * mockPlayers.length)].name, createdAt: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 3) },
    { id: '3', codeName: 'ai_dialogue', type: 'attack', content: 'Create a dialogue between two AI systems', createdBy: mockPlayers[Math.floor(Math.random() * mockPlayers.length)].name, createdAt: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 3) },
    { id: '4', codeName: 'nature_poem', type: 'defend', content: 'Write a poem about nature', createdBy: mockPlayers[Math.floor(Math.random() * mockPlayers.length)].name, createdAt: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 3) },
    { id: '5', codeName: 'mystery_100', type: 'attack', content: 'Craft a mystery story in exactly 100 words', createdBy: mockPlayers[Math.floor(Math.random() * mockPlayers.length)].name, createdAt: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 3) },
    { id: '6', codeName: 'alien_sandwich', type: 'defend', content: 'Write instructions for making a sandwich to an alien', createdBy: mockPlayers[Math.floor(Math.random() * mockPlayers.length)].name, createdAt: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 3) },
    { id: '7', codeName: 'dialogue_story', type: 'attack', content: 'Create a story using only dialogue', createdBy: mockPlayers[Math.floor(Math.random() * mockPlayers.length)].name, createdAt: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 3) },
    { id: '8', codeName: 'childhood_memory', type: 'defend', content: 'Describe your favorite childhood memory', createdBy: mockPlayers[Math.floor(Math.random() * mockPlayers.length)].name, createdAt: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 3) },
    { id: '9', codeName: 'future_letter', type: 'attack', content: 'Write a letter to your future self', createdBy: mockPlayers[Math.floor(Math.random() * mockPlayers.length)].name, createdAt: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 3) },
    { id: '10', codeName: 'superhero_origin', type: 'defend', content: 'Create a new superhero origin story', createdBy: mockPlayers[Math.floor(Math.random() * mockPlayers.length)].name, createdAt: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 3) },
    { id: '11', codeName: 'no_tech_world', type: 'attack', content: 'Write about a world without technology', createdBy: mockPlayers[Math.floor(Math.random() * mockPlayers.length)].name, createdAt: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 3) },
    { id: '12', codeName: 'dream_house', type: 'defend', content: 'Describe your dream house', createdBy: mockPlayers[Math.floor(Math.random() * mockPlayers.length)].name, createdAt: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 3) },
    { id: '13', codeName: 'fairy_tale', type: 'attack', content: 'Create a new fairy tale', createdBy: mockPlayers[Math.floor(Math.random() * mockPlayers.length)].name, createdAt: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 3) },
    { id: '14', codeName: 'historical_perspective', type: 'defend', content: 'Write about a significant historical event from an unusual perspective', createdBy: mockPlayers[Math.floor(Math.random() * mockPlayers.length)].name, createdAt: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 3) },
    { id: '15', codeName: 'ideal_job', type: 'attack', content: 'Describe your ideal job', createdBy: mockPlayers[Math.floor(Math.random() * mockPlayers.length)].name, createdAt: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 3) }
];

export const mockBattles: Battle[] = Array.from({ length: 25 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i); // Each battle happened on a different day

    const player1Index = Math.floor(Math.random() * mockPlayers.length);
    let player2Index;
    do {
        player2Index = Math.floor(Math.random() * mockPlayers.length);
    } while (player1Index === player2Index);

    const player1 = mockPlayers[player1Index];
    const player2 = mockPlayers[player2Index];
    const attackPromptIndex = Math.floor(Math.random() * mockPrompts.length);
    const defendPromptIndex = Math.floor(Math.random() * mockPrompts.length);
    const winner = Math.random() > 0.5 ? player1.id : player2.id;
    const ratingChange = Math.floor(Math.random() * 20) + 10; // Rating change between 10-30 points

    return {
        id: crypto.randomUUID(),
        attackerId: player1.id,
        defenderId: player2.id,
        attackPromptId: mockPrompts[attackPromptIndex].id,
        defendPromptId: mockPrompts[defendPromptIndex].id,
        attackPrompt: mockPrompts[attackPromptIndex],
        defendPrompt: mockPrompts[defendPromptIndex],
        status: 'completed',
        winner: winner,
        secret: 'mock-secret',
        ratingChanges: {
            [player1.id]: winner === player1.id ? ratingChange : -ratingChange,
            [player2.id]: winner === player2.id ? ratingChange : -ratingChange
        },
        error: null,
        startedAt: new Date(date.getTime() - 1000 * 60 * 5), // 5 minutes before completion
        completedAt: date,
        createdAt: new Date(date.getTime() - 1000 * 60 * 10), // 10 minutes before completion
        updatedAt: date
    };
});
