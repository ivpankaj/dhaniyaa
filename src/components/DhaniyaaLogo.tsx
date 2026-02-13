export default function DhaniyaaLogo({ className = "w-10 h-10" }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <linearGradient id="dhaniyaa-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2563EB" />
                    <stop offset="100%" stopColor="#9333EA" />
                </linearGradient>
            </defs>

            {/* Outer rounded square */}
            <rect
                x="5"
                y="5"
                width="90"
                height="90"
                rx="20"
                fill="url(#dhaniyaa-gradient)"
                opacity="0.1"
            />

            {/* Stylized "D" with workflow elements */}
            <path
                d="M30 25 L30 75 L55 75 C 70 75 75 65 75 50 C 75 35 70 25 55 25 Z"
                fill="url(#dhaniyaa-gradient)"
            />

            {/* Inner cutout to form the D */}
            <path
                d="M42 37 L42 63 L55 63 C 62 63 65 58 65 50 C 65 42 62 37 55 37 Z"
                fill="white"
            />

            {/* Connected nodes representing workflow */}
            <circle cx="70" cy="30" r="4" fill="url(#dhaniyaa-gradient)" />
            <circle cx="70" cy="50" r="4" fill="url(#dhaniyaa-gradient)" />
            <circle cx="70" cy="70" r="4" fill="url(#dhaniyaa-gradient)" />

            {/* Connecting lines */}
            <line x1="70" y1="34" x2="70" y2="46" stroke="url(#dhaniyaa-gradient)" strokeWidth="2" />
            <line x1="70" y1="54" x2="70" y2="66" stroke="url(#dhaniyaa-gradient)" strokeWidth="2" />
        </svg>
    );
}
