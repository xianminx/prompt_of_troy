import { fetchGlobalCommands } from "@/utils/discord";
import { ClientHome } from "@/components/ClientHome";

// Server Component
export default async function Page() {
    try {
        const commandsData = await fetchGlobalCommands();
        return <ClientHome initialCommandsData={commandsData} />;
    } catch (error) {
        console.error('Error fetching commands:', error);
        return <ClientHome initialCommandsData={[]} />;
    }
}
