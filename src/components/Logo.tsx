import React from 'react';

interface LogoProps {
    className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            className={className}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            {/* Wave 1 (Top) */}
            <path
                d="M15 35 C30 25 50 45 65 35 C80 25 95 35 95 35"
                className="stroke-host-blue dark:stroke-white transition-colors duration-300 animate-pulse"
                strokeWidth="8"
            />
            {/* Wave 2 (Middle - Cyan) */}
            <path
                d="M10 55 C25 45 45 65 60 55 C75 45 90 55 90 55"
                className="stroke-host-cyan transition-colors duration-300 animate-pulse delay-75"
                strokeWidth="8"
            />
            {/* Wave 3 (Bottom) */}
            <path
                d="M15 75 C30 65 50 85 65 75 C80 65 95 75 95 75"
                className="stroke-host-blue dark:stroke-white transition-colors duration-300 animate-pulse delay-150"
                strokeWidth="8"
            />
        </svg>
    );
};

