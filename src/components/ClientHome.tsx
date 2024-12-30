'use client';

import { useState } from 'react';
import Image from "next/image";
import Discord from "@/components/Discord";
import { Footer } from "@/components/Footer";
import { Leaderboard } from "@/components/Leaderboard";
import { Modal } from "@/components/Modal";
import type { APIApplicationCommand } from "discord-api-types/v10";

export function ClientHome({ initialCommandsData }: { initialCommandsData: APIApplicationCommand[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-4 sm:p-8">
            <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen w-full max-w-7xl mx-auto">
                <main className="flex flex-col gap-8 w-full items-center py-8">
                    <div className="flex flex-col items-center justify-center mb-4">
                        <Image
                            src="/trojan_logo_256x256.png"
                            alt="Prompt of Troy Logo"
                            width={80}
                            height={80}
                            className="mb-6"
                            priority
                        />
                        
                        <h1 className="text-4xl font-bold mb-3 text-center bg-gradient-to-r from-amber-200 to-yellow-400 bg-clip-text text-transparent group-hover:from-amber-300 group-hover:to-yellow-500 transition-all">
                            Prompt of Troy
                        </h1>
                        <p className="text-center text-gray-400 text-lg max-w-xl group-hover:text-gray-300 transition-colors">
                            Your AI-powered Discord Bot for the game of Troy
                        </p>
                    </div>
                    <Leaderboard />
                </main>
            </div>
            <Footer onOpenModal={() => setIsModalOpen(true)} />
            
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <Discord commandsData={initialCommandsData} />
            </Modal>
        </main>
    );
} 