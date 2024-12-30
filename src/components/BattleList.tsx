import React, { useEffect, useState } from "react";
import { type SelectBattle as Battle } from "../db/index";
import type { PaginatedResponse } from "@/types";
import PaginationControls from "./PaginationControls";
import LoadingState from "./LoadingState";

function BattleList() {
    const [battles, setBattles] = useState<Battle[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 10;

    useEffect(() => {
        const fetchBattles = async () => {
            try {
                setLoading(true);
                const response = await fetch(
                    `/api/battles?page=${page}&limit=${limit}`
                );
                if (!response.ok) throw new Error("Failed to fetch battles");
                const data: PaginatedResponse<Battle> = await response.json();
                setBattles(data.items);
                setTotalPages(data.totalPages);
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : "An error occurred"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchBattles();
    }, [page]);

    return (
        <div>
            <LoadingState loading={loading} error={error} />
            {!loading && !error && (
                <>
                    <div className="overflow-x-auto bg-white rounded-lg shadow">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Date
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Status
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Attacker (Δ)
                                    </th>

                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Defender (Δ)
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {battles.map((battle) => (
                                    <tr
                                        key={battle.id}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(
                                                battle.createdAt
                                            ).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {battle.status}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div
                                                className={`truncate max-w-[200px] ${
                                                    battle.winner ===
                                                    battle.attackerId
                                                        ? "font-bold text-green-600"
                                                        : ""
                                                }`}
                                            >
                                                @{battle.attackerId}/attack/{battle.attackPromptId}
                                                {battle?.ratingChanges?.attacker?.change !== undefined && (
                                                    <div className={
                                                        (battle.ratingChanges.attacker.change > 0)
                                                            ? "text-green-600"
                                                            : "text-red-600"
                                                    }>
                                                        ({battle.ratingChanges.attacker.change > 0 ? "+" : ""}
                                                        {battle.ratingChanges.attacker.change})
                                                    </div>
                                                )}
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div
                                                className={`truncate max-w-[200px] ${
                                                    battle.winner ===
                                                    battle.defenderId
                                                        ? "font-bold text-green-600"
                                                        : ""
                                                }`}
                                            >
                                                @{battle.defenderId}/defend/{battle.defendPromptId}
                                                {battle?.ratingChanges?.defender?.change !== undefined && (
                                                    <div className={
                                                        (battle.ratingChanges.defender.change > 0)
                                                            ? "text-green-600"
                                                            : "text-red-600"
                                                    }>
                                                        ({battle.ratingChanges.defender.change > 0 ? "+" : ""}
                                                        {battle.ratingChanges.defender.change})
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <PaginationControls
                        page={page}
                        totalPages={totalPages}
                        onPageChange={setPage}
                    />
                </>
            )}
        </div>
    );
}

export default BattleList;
