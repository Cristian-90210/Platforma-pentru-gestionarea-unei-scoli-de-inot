import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, User, Users, BookOpen, LayoutDashboard, X, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Logo } from '../components/Logo';
import clsx from 'clsx';

interface SideMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SideMenu: React.FC<SideMenuProps> = ({ isOpen, onClose }) => {
    const { t } = useTranslation();
    const { logout, user } = useAuth();

    // Public menu: landing page links only when NOT logged in
    // Authenticated: role-specific dashboard + relevant links
    const links = user
        ? [
            ...(user.role === 'student' ? [
                { to: '/student', label: t('header.dashboard'), icon: LayoutDashboard },
                { to: '/courses', label: t('header.courses'), icon: BookOpen },
                { to: '/coaches', label: t('header.our_team'), icon: User },
            ] : []),
            ...(user.role === 'coach' ? [
                { to: '/coach', label: t('header.dashboard'), icon: LayoutDashboard },
                { to: '/courses', label: t('header.courses'), icon: BookOpen },
                { to: '/students', label: t('header.students'), icon: Users },
            ] : []),
            ...(user.role === 'admin' ? [
                { to: '/admin', label: t('header.dashboard'), icon: LayoutDashboard },
                { to: '/admin/users', label: 'Users', icon: User },
                { to: '/admin/reservations', label: 'Reservations', icon: BookOpen },
                { to: '/admin/announcements', label: 'Announcements', icon: BookOpen },
                { to: '/courses', label: t('header.courses'), icon: BookOpen },
                { to: '/coaches', label: t('header.coaches'), icon: User },
                { to: '/students', label: t('header.students'), icon: Users },
            ] : []),
        ]
        : [
            { to: '/', label: t('header.home'), icon: Home },
            { to: '/courses', label: t('header.courses'), icon: BookOpen },
            { to: '/coaches', label: t('header.our_team'), icon: User },
        ];

    return (
        <>
            {/* Backdrop */}
            <div
                className={clsx(
                    "fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={onClose}
            />

            {/* Sidebar Drawer */}
            <aside
                className={clsx(
                    "fixed top-0 left-0 w-64 h-full bg-white dark:bg-gray-900 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out md:hidden flex flex-col",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                {/* Header */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <Logo className="h-8 w-8 text-host-blue" />
                        <span className="font-bold text-gray-800 dark:text-white">Menu</span>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {links.map((link: any) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            onClick={onClose}
                            className={({ isActive }) => clsx(
                                "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200",
                                isActive
                                    ? "bg-host-cyan/10 text-host-cyan font-bold"
                                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-host-blue"
                            )}
                        >
                            <link.icon size={20} />
                            <span>{link.label}</span>
                        </NavLink>
                    ))}
                </nav>

                {/* Footer Actions */}
                <div className="p-4 border-t border-gray-100 dark:border-gray-800 space-y-2">
                    {user ? (
                        <button
                            onClick={() => { logout(); onClose(); }}
                            className="flex items-center space-x-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 w-full transition-colors"
                        >
                            <LogOut size={20} />
                            <span>{t('header.logout')}</span>
                        </button>
                    ) : (
                        <NavLink
                            to="/login"
                            onClick={onClose}
                            className="flex items-center justify-center w-full bg-host-gradient text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-cyan-500/20 transition-all"
                        >
                            {t('header.login')}
                        </NavLink>
                    )}
                </div>
            </aside>
        </>
    );
};
