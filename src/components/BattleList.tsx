import React, { useEffect, useState } from 'react';
import { type SelectBattle as Battle } from '../db/index';

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

  if (loading) return (<div className="text-center p-4">Loading...</div>);
  if (error) return (<div className="text-red-500 p-4">{error}</div>);

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Attacker
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Defender
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {battles.map((battle) => (
            <tr key={battle.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(battle.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {battle.status}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className={`truncate max-w-[250px] ${battle.winner === battle.attackerId ? 'font-bold text-green-600' : ''}`}>
                  @{battle.attackerId}/attack/{battle.attackPromptId}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className={`truncate max-w-[250px] ${battle.winner === battle.defenderId ? 'font-bold text-green-600' : ''}`}>
                   @{battle.defenderId}/defend/{battle.defendPromptId}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BattleList; 