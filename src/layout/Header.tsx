import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Menu, Sun, Moon, LogOut, Search, LogIn, ShoppingCart } from 'lucide-react';
import { clsx } from 'clsx';

import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { Button } from '../components/Button';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext';

const CartIcon: React.FC = () => {
    const { totalItems } = useCart();
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate('/cart')}
            className="relative p-2 text-slate-600 dark:text-gray-300 hover:text-host-cyan transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            title="Coșul meu"
        >
            <ShoppingCart size={20} />
            {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-lg animate-in zoom-in duration-200">
                    {totalItems}
                </span>
            )}
        </button>
    );
};

interface HeaderProps {
    onMenuClick: () => void;
    onSearchClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick, onSearchClick }) => {
    const { t } = useTranslation();
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();

    // Scroll-based hide/show
    const [hidden, setHidden] = React.useState(false);
    const lastScrollY = React.useRef(0);

    React.useEffect(() => {
        const handleScroll = () => {
            const currentY = window.scrollY;
            if (currentY > lastScrollY.current && currentY > 80) {
                setHidden(true);
            } else {
                setHidden(false);
            }
            lastScrollY.current = currentY;
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Public nav: shown ONLY when NOT authenticated (landing page visitors)
    // Authenticated nav: role-specific dashboard links only
    const navItems = user
        ? [
            // Authenticated: role-based dashboard + relevant links
            ...(user.role === 'student' ? [
                { label: t('header.dashboard'), to: '/student' },
                { label: t('header.courses'), to: '/courses' },
                { label: t('header.our_team'), to: '/coaches' },
            ] : []),
            ...(user.role === 'coach' ? [
                { label: t('header.dashboard'), to: '/coach' },
                { label: t('header.courses'), to: '/courses' },
                { label: t('header.students'), to: '/students' },
            ] : []),
            ...(user.role === 'admin' ? [
                { label: t('header.dashboard'), to: '/admin' },
                { label: t('header.courses'), to: '/courses' },
                { label: t('header.coaches'), to: '/coaches' },
                { label: t('header.students'), to: '/students' },
            ] : []),
        ]
        : [
            // Public: visible ONLY on the landing page (not authenticated)
            { label: t('header.home'), to: '/' },
            { label: t('header.courses'), to: '/courses' },
            { label: t('header.our_team'), to: '/coaches' },
        ];

    return (
        <header className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 bg-white dark:bg-[#0f2027] border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm ${hidden ? '-translate-y-full' : 'translate-y-0'}`}>
            <nav className="container mx-auto px-6 py-4">
                <div className="flex items-center">

                    {/* Left: Logo */}
                    <div className="flex items-center flex-1">
                        <img src="https://atlantisswim.md/wp-content/uploads/2025/08/cropped-asat-03-scaled-1-e1755890850322.png" alt="Atlantis SwimSchool" className="h-10 w-10 mr-2 object-contain" />
                        <span className="text-2xl font-extrabold text-slate-800 dark:text-white tracking-wider transition-colors">
                            ATLANTIS <span className="text-host-cyan">SWIMSCHOOL</span>
                        </span>
                    </div>

                    {/* Center: Navigation Links (truly centered) */}
                    <div className="hidden lg:flex items-center justify-center space-x-8">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                className={({ isActive }) => clsx(
                                    "text-sm font-bold uppercase tracking-wide transition-all duration-300 relative py-1",
                                    isActive
                                        ? "text-host-cyan scale-105"
                                        : "text-slate-600 dark:text-gray-300 hover:text-host-cyan dark:hover:text-host-cyan"
                                )}
                            >
                                {({ isActive }) => (
                                    <>
                                        {item.label}
                                        <span className={clsx(
                                            "absolute bottom-0 left-0 w-full h-0.5 bg-host-cyan transform origin-left transition-transform duration-300",
                                            isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                                        )} />
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </div>

                    {/* Right: Actions (mirror weight of logo) */}
                    <div className="hidden lg:flex items-center justify-end flex-1 space-x-4">
                        <button
                            onClick={onSearchClick}
                            className="p-2 text-slate-600 dark:text-gray-300 hover:text-host-cyan transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            <Search size={20} />
                        </button>

                        {/* Cart Icon */}
                        <CartIcon />

                        <LanguageSwitcher />

                        <button
                            onClick={toggleTheme}
                            className="text-slate-600 dark:text-gray-300 hover:text-host-cyan dark:hover:text-host-cyan transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                        </button>

                        {user ? (
                            <div className="flex items-center space-x-3 bg-gray-100 dark:bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-gray-200 dark:border-white/10 transition-colors">
                                <span className="text-slate-800 dark:text-white text-sm font-medium">{user.name.split(' ')[0]}</span>
                                <button onClick={logout} className="text-slate-500 dark:text-white/70 hover:text-red-500 dark:hover:text-red-400 transition-colors">
                                    <LogOut size={16} />
                                </button>
                            </div>
                        ) : (
                            <div className="relative group">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-host-cyan to-blue-600 rounded-lg blur opacity-30 group-hover:opacity-70 transition duration-1000 group-hover:duration-200"></div>
                                <Button
                                    onClick={() => window.location.href = '/login'}
                                    className="relative flex items-center gap-2 px-6 py-2 rounded-lg bg-gradient-to-r from-host-cyan to-blue-600 text-white font-bold text-sm uppercase tracking-wide shadow-lg hover:shadow-cyan-500/50 border-none"
                                >
                                    <LogIn className="w-4 h-4" />
                                    {t('header.connect', { defaultValue: 'Conectare' })}
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="lg:hidden flex items-center space-x-4">
                        <button onClick={onSearchClick} className="text-slate-800 dark:text-white hover:text-host-cyan transition-colors">
                            <Search size={24} />
                        </button>
                        <button onClick={onMenuClick} className="text-slate-800 dark:text-white hover:text-host-cyan transition-colors">
                            <Menu size={28} />
                        </button>
                    </div>
                </div>
            </nav>
        </header>
    );
};
