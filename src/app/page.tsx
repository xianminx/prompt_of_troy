import Image from "next/image";
import Discord from "@/components/Discord";
import { Footer } from "@/components/Footer";
import { Leaderboard } from "@/components/Leaderboard";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-8 sm:p-12">
            <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
                <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
                    <div className="flex flex-col items-center justify-center">
                        <Image
                            src="/trojan_logo_256x256.png"
                            alt="Prompt of Troy Logo"
                            width={64}
                            height={64}
                            className="mb-8"
                            priority
                        />
                        <p className="text-center text-lg">
                            Prompt of Troy - Your AI-powered Discord Bot for the
                            game of Troy
                        </p>
                    </div>
                    <Leaderboard />
                    <Discord />
                </main>
            </div>
            <Footer />
        </main>
    );
}
