import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Lock } from 'lucide-react';

export const Unauthorized: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 text-center px-4">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <Lock className="w-10 h-10 text-red-500" />
            </div>
            <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white mb-2">401 - Unauthorized</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">
                You must be logged in to access this page. Please sign in with your credentials.
            </p>
            <Button onClick={() => navigate('/login')} variant="gradient" className="rounded-full px-8">
                Go to Login
            </Button>
        </div>
    );
};
