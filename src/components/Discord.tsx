import { Suspense } from "react";
import { GlobalCommands } from "./global-commands";

export default async function Page() {
    return (
        <>
            <section className="grid grid-cols-1 gap-2">
                <Suspense fallback={null}>
                    <GlobalCommands />
                </Suspense>
            </section>
        </>
    );
}
