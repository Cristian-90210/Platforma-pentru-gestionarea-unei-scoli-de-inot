import React from 'react';

interface TableRowProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

export const TableRow: React.FC<TableRowProps> = ({ children, className, onClick }) => {
    return (
        <tr
            onClick={onClick}
            className={`
        border-b border-gray-200 dark:border-gray-700
        hover:bg-gray-50 dark:hover:bg-gray-700/50
        transition-colors duration-150
        ${onClick ? 'cursor-pointer' : ''}
        ${className || ''}
      `}
        >
            {children}
        </tr>
    );
};

export const Table: React.FC<{ children: React.ReactNode; headers: string[] }> = ({ children, headers }) => {
    return (
        <div className="w-full overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                    <tr>
                        {headers.map((header, index) => (
                            <th key={index} className="px-6 py-4 font-medium text-gray-700 dark:text-gray-300">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
                    {children}
                </tbody>
            </table>
        </div>
    )
}
