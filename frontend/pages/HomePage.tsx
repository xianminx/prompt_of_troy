import React from 'react';

const HomePage: React.FC = () => {
    return (
        <div className="container mx-auto p-4">
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-3xl font-bold mb-6"> to Prompt of Troy</h1>
                <p className="text-gray-700 mb-4">
                    This is a Discord bot that helps manage prompts and battles. Use our Discord commands to interact with the bot and manage your prompts.
                </p>
                <p className="text-gray-700">
                    Visit the <a href="/prompts" className="text-blue-600 hover:text-blue-800">prompts page</a> to view and manage your prompts.
                </p>
            </div>
        </div>
    );
};

export default HomePage;
