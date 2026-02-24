import React, { type ButtonHTMLAttributes } from 'react';

interface CTAButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    fullWidth?: boolean;
}

/**
 * Unified CTA Button — single source of truth for all primary action buttons.
 * Matches the "START NOW" reference design exactly.
 * Changing styles here updates ALL CTA buttons across the app.
 */
export const CTAButton: React.FC<CTAButtonProps> = ({
    children,
    fullWidth = true,
    className = '',
    ...props
}) => {
    return (
        <button
            {...props}
            style={{
                borderRadius: '9999px',
                background: 'linear-gradient(145deg, #0ea5e9 0%, #2563eb 100%)',
                minHeight: '44px',
                ...props.style,
            }}
            className={[
                'inline-flex items-center justify-center',
                'font-bold uppercase tracking-wide',
                'text-white border-none',
                'px-10 py-3 text-sm',
                'shadow-2xl shadow-cyan-500/30',
                'hover:shadow-[0_0_15px_rgba(0,198,255,0.5)] hover:shadow-cyan-500/50',
                'hover:scale-[1.02] active:scale-95',
                'transition-all duration-300',
                'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-400',
                'disabled:opacity-50 disabled:pointer-events-none',
                fullWidth ? 'w-full' : '',
                className,
            ].join(' ')}
        >
            {children}
        </button>
    );
};
