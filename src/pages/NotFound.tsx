import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { AlertTriangle } from 'lucide-react';

export const NotFound: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 text-center px-4">
            <AlertTriangle className="w-20 h-20 text-host-cyan mb-6 animate-bounce" />
            <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-host-blue to-host-cyan mb-4">404</h1>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Page Not Found</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">
                The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>
            <Button onClick={() => navigate('/')} variant="gradient" className="rounded-full px-8">
                Go Home
            </Button>
        </div>
    );
};
