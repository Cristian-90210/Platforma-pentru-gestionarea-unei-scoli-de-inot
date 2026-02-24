import React, { useState } from 'react';
import { Card } from '../../components/Card';
import { CTAButton } from '../../components/CTAButton';
import { PageHeader } from '../../components/PageHeader';
import { announcementService } from '../../services/api';
import { Send, Globe, Users } from 'lucide-react';

export const Announcements: React.FC = () => {
    const [title, setTitle] = useState({ en: '', ro: '', ru: '' });
    const [message, setMessage] = useState({ en: '', ro: '', ru: '' });
    const [target, setTarget] = useState<'all' | 'students' | 'coaches'>('all');
    const [activeTab, setActiveTab] = useState<'en' | 'ro' | 'ru'>('en');

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await announcementService.send({ title, message, target });
            alert('Announcement sent successfully!');
            setTitle({ en: '', ro: '', ru: '' });
            setMessage({ en: '', ro: '', ru: '' });
        } catch (error) {
            alert('Failed to send announcement');
        }
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen pb-20">
            <PageHeader
                title={<>SYSTEM <span className="text-host-cyan">ANNOUNCEMENTS</span></>}
                subtitle="Broadcast messages to all users in multiple languages."
            />

            <div className="container mx-auto px-6 -mt-10 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Form Section */}
                    <div className="lg:col-span-2">
                        <Card className="border-t-4 border-t-host-cyan">
                            <form onSubmit={handleSend} className="space-y-6">
                                {/* Target Audience */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                                        <Users className="w-4 h-4 mr-2" /> Target Audience
                                    </label>
                                    <div className="flex space-x-4">
                                        {['all', 'students', 'coaches'].map((t) => (
                                            <label key={t} className="flex items-center space-x-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="target"
                                                    value={t}
                                                    checked={target === t}
                                                    onChange={() => setTarget(t as any)}
                                                    className="text-host-cyan focus:ring-host-cyan"
                                                />
                                                <span className="capitalize text-gray-600 dark:text-gray-400">{t}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Language Tabs */}
                                <div className="border-b border-gray-200 dark:border-gray-700 flex space-x-6">
                                    {['en', 'ro', 'ru'].map((lang) => (
                                        <button
                                            key={lang}
                                            type="button"
                                            onClick={() => setActiveTab(lang as any)}
                                            className={`pb-2 text-sm font-bold uppercase tracking-wide border-b-2 transition-colors ${activeTab === lang
                                                ? 'border-host-cyan text-host-cyan'
                                                : 'border-transparent text-gray-400 hover:text-gray-600'
                                                }`}
                                        >
                                            {lang === 'en' ? 'English' : lang === 'ro' ? 'Română' : 'Русский'}
                                        </button>
                                    ))}
                                </div>

                                {/* Dynamic Content Inputs */}
                                <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300" key={activeTab}>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                                            Title ({activeTab.toUpperCase()})
                                        </label>
                                        <input
                                            type="text"
                                            value={title[activeTab]}
                                            onChange={(e) => setTitle({ ...title, [activeTab]: e.target.value })}
                                            className="w-full rounded border-gray-300 p-3 shadow-sm focus:border-host-cyan focus:ring-1 focus:ring-host-cyan dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            placeholder="Announcement Title..."
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                                            Message ({activeTab.toUpperCase()})
                                        </label>
                                        <textarea
                                            rows={5}
                                            value={message[activeTab]}
                                            onChange={(e) => setMessage({ ...message, [activeTab]: e.target.value })}
                                            className="w-full rounded border-gray-300 p-3 shadow-sm focus:border-host-cyan focus:ring-1 focus:ring-host-cyan dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            placeholder="Type your message here..."
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 flex justify-end">
                                    <CTAButton type="submit" fullWidth={false}>
                                        <Send className="w-4 h-4 mr-2" /> Broadcast Now
                                    </CTAButton>
                                </div>
                            </form>
                        </Card>
                    </div>

                    {/* Preview Section */}
                    <div className="lg:col-span-1">
                        <div className="bg-host-blue text-white rounded-2xl shadow-xl p-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                            <h3 className="text-lg font-bold mb-4 flex items-center">
                                <Globe className="w-5 h-5 mr-2" /> Live Preview
                            </h3>
                            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                                <span className="inline-block px-2 py-1 bg-host-cyan text-xs font-bold rounded mb-2 uppercase">
                                    {target}
                                </span>
                                <h4 className="font-bold text-xl mb-2">{title[activeTab] || 'Title will appear here...'}</h4>
                                <p className="text-white/80 text-sm leading-relaxed">
                                    {message[activeTab] || 'Message content will appear here as you type...'}
                                </p>
                                <div className="mt-4 text-xs text-white/50 border-t border-white/10 pt-2">
                                    Sent by Admin • Just now
                                </div>
                            </div>
                            <div className="mt-6 text-center text-sm text-white/60">
                                This notification will be delivered immediately to {target === 'all' ? 'all users' : `${target}`} active on the platform.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
