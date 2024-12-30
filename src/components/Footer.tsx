import Image from 'next/image'

interface FooterProps {
    onOpenModal: () => void;
}

export function Footer({ onOpenModal }: FooterProps) {
    return (
        <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
            <button
                onClick={onOpenModal}
                className="flex items-center gap-2 hover:underline hover:underline-offset-4"
            >
                <Image
                    aria-hidden
                    src="/discord.svg"
                    alt="Discord icon"
                    width={16}
                    height={16}
                />
                Discord Command
            </button>
            <a
                className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                target="_blank"
                rel="noopener noreferrer"
            >
                <Image
                    aria-hidden
                    src="/window.svg"
                    alt="Window icon"
                    width={16}
                    height={16}
                />
                Examples
            </a>
            <a
                className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                href="https://discord.com/channels/1305380738711027732/1305380738711027734"
                target="_blank"
                rel="noopener noreferrer"
            >
                <Image
                    aria-hidden
                    src="/globe.svg"
                    alt="Globe icon"
                    width={16}
                    height={16}
                />
                Go to Discord →
            </a>
        </footer>
    )
} 