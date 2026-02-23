import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Waves } from 'lucide-react';

import type { UserRole } from '../types';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';

export const Login: React.FC = () => {
    const { login, isAuthenticated, user } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [role, setRole] = useState<UserRole>('student');
    const [isLoading, setIsLoading] = useState(false);

    // Auto-redirect if already logged in
    React.useEffect(() => {
        if (isAuthenticated && user) {
            if (user.role === 'admin') navigate('/admin', { replace: true });
            else if (user.role === 'coach') navigate('/coach', { replace: true });
            else navigate('/student', { replace: true });
        }
    }, [isAuthenticated, user, navigate]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate network delay for effect
        setTimeout(() => {
            login(role);
            // Navigation will be handled by the effect or we can leave it here, 
            // but effect is safer for state updates. 
            // logic(role) updates state -> effect triggers -> navigation.
        }, 800);
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-host-gradient animate-gradient-x font-sans selection:bg-host-cyan selection:text-white">

            {/* --- FLUID BACKGROUND EFFECTS (Shared with Home) --- */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/30 rounded-full mix-blend-overlay filter blur-3xl animate-blob"></div>
                <div className="absolute top-[20%] right-[-20%] w-[50%] h-[50%] bg-cyan-600/20 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-[-20%] left-[30%] w-[40%] h-[40%] bg-host-blue/40 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-4000"></div>

                {/* Grid Overlay for Tech feel */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
            </div>

            <div className="max-w-md w-full relative z-10 px-6">

                {/* --- HEADER SECTION --- */}
                <div className="text-center mb-10">
                    <div className="mb-6 flex justify-center relative">
                        {/* Glow behind logo */}
                        <div className="absolute inset-0 bg-host-cyan/40 blur-2xl rounded-full transform scale-150 animate-pulse"></div>
                        <div className="relative animate-float">
                            <img src="https://atlantisswim.md/wp-content/uploads/2025/08/cropped-asat-03-scaled-1-e1755890850322.png" alt="Atlantis SwimSchool" className="w-28 h-28 object-contain drop-shadow-2xl" />
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-3 drop-shadow-lg animate-in slide-in-from-bottom-5 fade-in duration-700">
                        {t('login.welcome_back')}
                    </h1>
                    <p className="text-blue-100/80 text-lg font-light animate-in slide-in-from-bottom-5 fade-in duration-700 delay-100">
                        {t('login.sign_in_to')} <span className="font-semibold text-host-cyan">SwimSchool</span> dashboard
                    </p>
                </div>

                {/* --- GLASS CARD --- */}
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 transition-all duration-500 hover:shadow-cyan-500/20 hover:border-white/30 animate-in slide-in-from-bottom-10 fade-in duration-1000 delay-200">
                    <form onSubmit={handleLogin} className="space-y-6">

                        {/* PREMIUM ROLE SWITCHER */}
                        <div className="relative p-1 bg-black/20 rounded-xl flex items-center justify-between backdrop-blur-md border border-white/5">
                            {(['student', 'coach', 'admin'] as UserRole[]).map((r) => (
                                <button
                                    key={r}
                                    type="button"
                                    onClick={() => setRole(r)}
                                    className={clsx(
                                        "relative flex-1 py-2.5 text-sm font-bold capitalize transition-all duration-300 rounded-lg z-10 focus:outline-none focus:ring-2 focus:ring-host-cyan/50",
                                        role === r ? "text-white shadow-lg" : "text-blue-200/70 hover:text-white"
                                    )}
                                >
                                    {t(`roles.${r}`)}
                                    {role === r && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-host-cyan to-blue-600 rounded-lg -z-10 animate-in zoom-in-90 duration-300 shadow-lg"></div>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* INPUT FIELDS */}
                        <div className="space-y-4">
                            <div className="relative group">
                                <div className="absolute left-4 top-3.5 text-blue-300 group-hover:text-host-cyan transition-colors duration-300">
                                    <Mail size={20} />
                                </div>
                                <input
                                    type="email"
                                    placeholder={t('login.email_placeholder')}
                                    defaultValue={role === 'admin' ? 'admin@school.com' : role === 'coach' ? 'coach@school.com' : 'student@school.com'}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-blue-300/40 outline-none focus:border-host-cyan focus:ring-1 focus:ring-host-cyan/50 transition-all duration-300 group-hover:bg-black/30"
                                    required
                                />
                            </div>

                            <div className="relative group">
                                <div className="absolute left-4 top-3.5 text-blue-300 group-hover:text-host-cyan transition-colors duration-300">
                                    <Lock size={20} />
                                </div>
                                <input
                                    type="password"
                                    placeholder={t('login.password_placeholder')}
                                    defaultValue="password"
                                    className="w-full bg-black/20 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-blue-300/40 outline-none focus:border-host-cyan focus:ring-1 focus:ring-host-cyan/50 transition-all duration-300 group-hover:bg-black/30"
                                    required
                                />
                            </div>
                        </div>

                        {/* SUBMIT BUTTON */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={clsx(
                                "w-full py-4 text-lg font-bold uppercase tracking-wider text-white rounded-xl shadow-xl transition-all duration-300 transform relative overflow-hidden group",
                                "bg-gradient-to-r from-host-cyan to-blue-600 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98]",
                                isLoading && "opacity-80 cursor-wait"
                            )}
                        >
                            <span className={clsx("relative z-10 flex items-center justify-center space-x-2", isLoading && "animate-pulse")}>
                                {isLoading ? (
                                    <>
                                        <Waves className="animate-spin mr-2" /> {t('login.signing_in')}
                                    </>
                                ) : (
                                    <span>{t('login.sign_in_button')}</span>
                                )}
                            </span>
                            {/* Hover shimmer effect */}
                            <div className="absolute top-0 -left-full w-full h-full bg-linear-to-r from-transparent via-white/20 to-transparent group-hover:left-full transition-all duration-700 ease-in-out"></div>
                        </button>
                    </form>

                    {/* FOOTER LINKS */}
                    <div className="mt-6 text-center space-y-2">
                        <a href="#" className="text-sm text-blue-200/60 hover:text-host-cyan transition-colors">{t('login.forgot_password')}</a>
                        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-4"></div>
                        <p className="text-xs text-blue-200/40 uppercase tracking-widest font-medium">
                            {t('login.secure_note')}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
