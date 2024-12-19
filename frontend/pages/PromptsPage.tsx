import React, { useEffect, useState } from 'react';
import { SelectPrompt } from '../db';

const PromptsPage: React.FC = () => {
    const [prompts, setPrompts] = useState<SelectPrompt[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchPrompts();
    }, []);

    const fetchPrompts = async () => {
        try {
            const response = await fetch('/api/prompts');
            if (!response.ok) {
                throw new Error('Failed to fetch prompts');
            }
            const data = await response.json();
            setPrompts(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Prompts List</h1>
            <div className="grid gap-4">
                {prompts.map((prompt) => (
                    <div 
                        key={prompt.id} 
                        className="border p-4 rounded-lg shadow"
                    >
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-semibold">
                                {prompt.type}/{prompt.codeName}
                            </span>
                            <span className="text-sm text-gray-500">
                                Created by: {prompt.createdBy}
                            </span>
                        </div>
                        <p className="text-gray-700">{prompt.content}</p>
                        <div className="text-sm text-gray-500 mt-2">
                            Created: {new Date(prompt.createdAt).toLocaleString()}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PromptsPage; 