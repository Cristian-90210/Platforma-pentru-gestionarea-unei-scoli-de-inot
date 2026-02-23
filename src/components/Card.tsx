import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface CardProps {
    className?: string;
    children: React.ReactNode;
    header?: React.ReactNode;
    footer?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ className, children, header, footer }) => {
    return (
        <div className={cn(
            'bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1',
            className
        )}>
            {header && (
                <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                    <h3 className="text-xl font-bold text-host-purple dark:text-white uppercase tracking-wide text-center">
                        {header}
                    </h3>
                </div>
            )}
            <div className="p-8">
                {children}
            </div>
            {footer && (
                <div className="px-8 py-6 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-700 text-center">
                    {footer}
                </div>
            )}
        </div>
    );
};
