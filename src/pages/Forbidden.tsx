import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { CTAButton } from '../components/CTAButton';
import { ShieldAlert } from 'lucide-react';

export const Forbidden: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 text-center px-4">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                <ShieldAlert className="w-10 h-10 text-orange-500" />
            </div>
            <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white mb-2">403 - Forbidden</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">
                You do not have permission to access this resource. Please contact your administrator if you believe this is an error.
            </p>
            <div className="flex space-x-4">
                <Button onClick={() => navigate(-1)} variant="secondary" className="rounded-full px-6 text-gray-600">
                    Go Back
                </Button>
                <CTAButton fullWidth={false} onClick={() => navigate('/')}>
                    Go Home
                </CTAButton>
            </div>
        </div>
    );
};
