'use client';

import { GlobalCommands } from "./global-commands";
import type { APIApplicationCommand } from "discord-api-types/v10";

export default function Page({ commandsData }: { commandsData: APIApplicationCommand[] }) {
    return (
        <section className="grid grid-cols-1 gap-2">
            <h2>Discord Commands</h2>
            <GlobalCommands data={commandsData} />
        </section>
    );
}
