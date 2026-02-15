import Image from 'next/image';

export default function DhaniyaaLogo({ className = "w-12 h-12" }: { className?: string }) {
    // Determine width/height based on className or use fill if complex
    // Since className usually has w-x h-y, we can just use a relative wrapper
    return (
        <div className={`relative ${className}`}>
            <Image
                src="/logo.png"
                alt="Dhaniyaa Logo"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                unoptimized
                style={{ background: 'transparent' }}
            />
        </div>
    );
}

