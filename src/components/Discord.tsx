import { GlobalCommands } from "./global-commands";

export default async function Page() {
    return (
        <>
            <section className="grid grid-cols-1 gap-2">
                <h2 className="text-2xl font-bold mb-4 text-center">
                    Discord Commands
                </h2>

                <GlobalCommands />
            </section>
        </>
    );
}
