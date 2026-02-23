import React, { createContext, useContext, useState } from 'react';
import type { User, UserRole } from '../types';

interface AuthContextType {
    user: User | null;
    login: (role: UserRole) => void;
    logout: () => void;
    isAuthenticated: boolean;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(() => {
        const saved = localStorage.getItem('user');
        return saved ? JSON.parse(saved) : null;
    });

    const login = (role: UserRole) => {
        const mockUser: User = {
            id: role === 'admin' ? 'admin-1' : role === 'coach' ? 'c1' : 'user-1',
            name: role === 'admin' ? 'Admin User' : role === 'coach' ? 'Coach Alex' : 'Regular Student',
            email: role === 'admin' ? 'admin@school.com' : role === 'coach' ? 'coach@school.com' : 'student@school.com',
            role: role,
            avatar: 'https://ui-avatars.com/api/?background=00c6ff&color=fff&name=' + (role === 'admin' ? 'Admin' : role === 'coach' ? 'Coach' : 'Student'),
        };
        setUser(mockUser);
        localStorage.setItem('user', JSON.stringify(mockUser));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                isAuthenticated: !!user,
                isAdmin: user?.role === 'admin',
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
