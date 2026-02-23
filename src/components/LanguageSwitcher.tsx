import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';

export const LanguageSwitcher: React.FC = () => {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const languages = [
        { code: 'en', label: 'English', flag: '🇬🇧' },
        { code: 'ro', label: 'Română', flag: '🇷🇴' },
        { code: 'ru', label: 'Русский', flag: '🇷🇺' }
    ];

    const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
        setIsOpen(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 text-slate-600 dark:text-gray-300 hover:text-host-cyan dark:hover:text-host-cyan transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5"
            >
                <Globe size={20} />
                <span className="text-sm font-bold uppercase hidden md:inline-block">{currentLanguage.code}</span>
                <ChevronDown size={14} className={clsx("transition-transform duration-300", isOpen && "rotate-180")} />
            </button>

            {/* Dropdown */}
            <div className={clsx(
                "absolute right-0 mt-2 w-48 bg-white/90 dark:bg-[#0f2027]/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300 transform origin-top-right z-50",
                isOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
            )}>
                <div className="p-2 space-y-1">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => changeLanguage(lang.code)}
                            className={clsx(
                                "w-full flex items-center justify-between px-4 py-2 text-sm rounded-lg transition-colors",
                                i18n.language === lang.code
                                    ? "bg-host-cyan/10 text-host-cyan font-bold"
                                    : "text-slate-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10"
                            )}
                        >
                            <span className="flex items-center space-x-3">
                                <span className="text-lg">{lang.flag}</span>
                                <span>{lang.label}</span>
                            </span>
                            {i18n.language === lang.code && (
                                <span className="w-1.5 h-1.5 rounded-full bg-host-cyan"></span>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
