import React, { useEffect, useState } from 'react';

interface Battle {
  id: string;
  player1Id: string;
  player2Id: string;
  winnerId: string | null;
  player1Name: string;
  player2Name: string;
  createdAt: string;
  prompt: string;
}

function BattleList() {
  const [battles, setBattles] = useState<Battle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBattles = async () => {
      try {
        const response = await fetch('/api/battles');
        if (!response.ok) throw new Error('Failed to fetch battles');
        const data = await response.json();
        setBattles(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchBattles();
  }, []);

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Players
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Winner
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Prompt
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {battles.map((battle) => (
            <tr key={battle.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(battle.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {battle.player1Name} vs {battle.player2Name}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {battle.winnerId ? (
                  battle.winnerId === battle.player1Id ? battle.player1Name : battle.player2Name
                ) : 'Pending'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="truncate max-w-xs">{battle.prompt}</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BattleList; 