
interface EmbedProps {
    iframe: string;
}

export function Embed({ iframe }: EmbedProps) {
    if (!iframe) return null;

    return (
        <div 
            className="relative h-0 overflow-hidden w-full" 
            style={{ paddingBottom: '56.25%' }}
            dangerouslySetInnerHTML={{ __html: iframe }}
        />
    )
}
