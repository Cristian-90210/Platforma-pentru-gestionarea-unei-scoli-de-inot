import React, { useMemo, useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { mockBookings, mockCoaches, mockCourses } from '../data/mockData';
import { Calendar, Clock, User, ArrowRight, CheckCircle, XCircle, RotateCcw, Trophy, MessageCircle, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { clsx } from 'clsx';
import { PageHeader } from '../components/PageHeader';
import { useTranslation } from 'react-i18next';
import type { AttendanceRecord, SwimmingResult, Message } from '../types';
import { attendanceService, resultsService, messageService } from '../services/api';

export const StudentDashboard: React.FC = () => {
    const { user } = useAuth();
    const { t } = useTranslation();

    const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
    const [results, setResults] = useState<SwimmingResult[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [selectedReceiver, setSelectedReceiver] = useState('c1');
    const [activeTab, setActiveTab] = useState<'bookings' | 'attendance' | 'results' | 'recovery' | 'messages'>('bookings');

    useEffect(() => {
        if (user) {
            attendanceService.getByStudent(user.id).then(setAttendance);
            resultsService.getByStudent(user.id).then(setResults);
            messageService.getByUser(user.id).then(setMessages);
        }
    }, [user]);

    const myBookings = useMemo(() => {
        return mockBookings.filter(b => b.studentId === user?.id).map(b => {
            const course = mockCourses.find(c => c.id === b.courseId);
            const coach = mockCoaches.find(c => c.id === b.coachId);
            return { ...b, course, coach };
        });
    }, [user]);

    const upcoming = myBookings.filter(b => b.status === 'upcoming');
    const recoverySessions = attendance.filter(a => a.status === 'recovery');

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !user) return;
        const receiver = mockCoaches.find(c => c.id === selectedReceiver);
        const sent = await messageService.send({
            senderId: user.id,
            senderName: user.name,
            receiverId: selectedReceiver,
            receiverName: receiver?.name || 'Admin',
            content: newMessage,
        });
        setMessages(prev => [...prev, sent]);
        setNewMessage('');
    };

    const handleMarkAbsent = async (bookingId: string, date: string) => {
        if (!user) return;
        const record = await attendanceService.mark({
            bookingId,
            studentId: user.id,
            date,
            status: 'absent',
            markedBy: user.id,
        });
        setAttendance(prev => [...prev, record]);
    };

    const tabs = [
        { key: 'bookings' as const, label: t('student_dashboard.tabs.bookings') },
        { key: 'attendance' as const, label: t('student_dashboard.tabs.attendance') },
        { key: 'results' as const, label: t('student_dashboard.tabs.results') },
        { key: 'recovery' as const, label: t('student_dashboard.tabs.recovery') },
        { key: 'messages' as const, label: t('student_dashboard.tabs.messages') },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
            <PageHeader
                title={t('student_dashboard.welcome', { name: user?.name })}
                subtitle={t('student_dashboard.subtitle')}
            />

            <div className="container mx-auto px-6 -mt-10 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Stats Cards */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400">
                                <Calendar size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{t('student_dashboard.stats.upcoming_sessions')}</p>
                                <p className="text-2xl font-bold text-gray-800 dark:text-white">{upcoming.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-host-cyan/10 rounded-full text-host-cyan">
                                <User size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{t('student_dashboard.stats.student_level')}</p>
                                <p className="text-2xl font-bold text-gray-800 dark:text-white">{t('hero.levels.beginner')}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-host-blue to-blue-600 p-6 rounded-2xl shadow-xl text-white flex flex-col justify-between">
                        <div>
                            <p className="opacity-80 text-sm">{t('student_dashboard.stats.next_session')}</p>
                            <p className="text-xl font-bold mt-1">
                                {upcoming[0] ? `${upcoming[0].date} @ ${upcoming[0].time}` : t('student_dashboard.stats.no_upcoming')}
                            </p>
                        </div>
                        <Link to="/courses" className="self-end mt-4 text-xs uppercase font-bold tracking-wider hover:text-host-cyan transition-colors flex items-center">
                            {t('student_dashboard.stats.book_new')} <ArrowRight size={14} className="ml-1" />
                        </Link>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="mt-12 flex flex-wrap gap-3 overflow-x-auto pb-2">
                    {tabs.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={clsx(
                                "px-5 py-2.5 text-sm font-bold uppercase tracking-wider transition-all duration-200 whitespace-nowrap",
                                activeTab === tab.key
                                    ? "bg-host-cyan text-white shadow-lg shadow-cyan-500/25"
                                    : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200"
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="mt-8">
                    {/* Bookings Tab */}
                    {activeTab === 'bookings' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-8">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">{t('student_dashboard.my_bookings')}</h2>
                                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                                        {myBookings.length > 0 ? (
                                            <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                                {myBookings.map((binding) => (
                                                    <div key={binding.id} className="p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                                        <div className="flex items-center space-x-4">
                                                            <div className={clsx(
                                                                "w-2 h-12 rounded-full",
                                                                binding.status === 'upcoming' ? "bg-host-cyan" : "bg-gray-300"
                                                            )} />
                                                            <div>
                                                                <h4 className="font-bold text-gray-800 dark:text-gray-200">{binding.course ? t(`courses.${binding.course.id}.title`) : ''}</h4>
                                                                <div className="flex items-center text-sm text-gray-500 mt-1">
                                                                    <User size={14} className="mr-1" /> {binding.coach?.name}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center space-x-4">
                                                            <div className="text-right">
                                                                <div className="font-bold text-gray-700 dark:text-gray-300 flex items-center justify-end">
                                                                    <Calendar size={16} className="mr-2 text-host-cyan" /> {binding.date}
                                                                </div>
                                                                <div className="text-sm text-gray-500 flex items-center justify-end mt-1">
                                                                    <Clock size={14} className="mr-1" /> {binding.time}
                                                                </div>
                                                            </div>
                                                            {binding.status === 'upcoming' && (
                                                                <button
                                                                    onClick={() => handleMarkAbsent(binding.id, binding.date)}
                                                                    className="text-xs px-3 py-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors font-bold"
                                                                >
                                                                    {t('student_dashboard.actions.mark_absent')}
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="p-12 text-center">
                                                <p className="text-gray-500 mb-4">{t('student_dashboard.no_bookings')}</p>
                                                <Link to="/courses" className="text-host-cyan font-bold hover:underline">{t('student_dashboard.browse_courses')}</Link>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">{t('student_dashboard.quick_actions')}</h2>
                                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
                                    <ul className="space-y-4">
                                        <li>
                                            <Link to="/courses" className="block p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-host-cyan/10 transition-colors group">
                                                <span className="font-bold text-gray-700 dark:text-gray-200 group-hover:text-host-cyan">{t('student_dashboard.actions.browse_all')}</span>
                                                <p className="text-sm text-gray-500 mt-1">{t('student_dashboard.actions.browse_all_desc')}</p>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/coaches" className="block p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-host-cyan/10 transition-colors group">
                                                <span className="font-bold text-gray-700 dark:text-gray-200 group-hover:text-host-cyan">{t('student_dashboard.actions.meet_coaches')}</span>
                                                <p className="text-sm text-gray-500 mt-1">{t('student_dashboard.actions.meet_coaches_desc')}</p>
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Attendance Tab */}
                    {activeTab === 'attendance' && (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                                <h2 className="text-xl font-bold text-gray-800 dark:text-white">{t('student_dashboard.attendance.title')}</h2>
                            </div>
                            {attendance.length > 0 ? (
                                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {attendance.map(a => (
                                        <div key={a.id} className="p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                            <div className="flex items-center space-x-4">
                                                <div className={clsx(
                                                    "p-2 rounded-full",
                                                    a.status === 'present' ? "bg-green-100 text-green-600" :
                                                        a.status === 'absent' ? "bg-red-100 text-red-600" :
                                                            "bg-yellow-100 text-yellow-600"
                                                )}>
                                                    {a.status === 'present' ? <CheckCircle size={20} /> :
                                                        a.status === 'absent' ? <XCircle size={20} /> :
                                                            <RotateCcw size={20} />}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-800 dark:text-gray-200">{a.date}</div>
                                                    <div className="text-xs text-gray-500">{t('student_dashboard.attendance.booking')}: {a.bookingId}</div>
                                                </div>
                                            </div>
                                            <span className={clsx(
                                                "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide",
                                                a.status === 'present' ? "bg-green-100 text-green-700" :
                                                    a.status === 'absent' ? "bg-red-100 text-red-700" :
                                                        "bg-yellow-100 text-yellow-700"
                                            )}>
                                                {a.status === 'present' ? t('student_dashboard.attendance.present') :
                                                    a.status === 'absent' ? t('student_dashboard.attendance.absent') : t('student_dashboard.attendance.recovery')}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-12 text-center text-gray-500">{t('student_dashboard.attendance.no_records')}</div>
                            )}
                        </div>
                    )}

                    {/* Results Tab */}
                    {activeTab === 'results' && (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center space-x-3">
                                <Trophy className="text-host-cyan" size={24} />
                                <h2 className="text-xl font-bold text-gray-800 dark:text-white">{t('student_dashboard.results.title')}</h2>
                            </div>
                            {results.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider">
                                            <tr>
                                                <th className="p-4 font-semibold">{t('student_dashboard.results.headers.date')}</th>
                                                <th className="p-4 font-semibold">{t('student_dashboard.results.headers.style')}</th>
                                                <th className="p-4 font-semibold">{t('student_dashboard.results.headers.distance')}</th>
                                                <th className="p-4 font-semibold">{t('student_dashboard.results.headers.time')}</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                            {results.map(r => (
                                                <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                                    <td className="p-4 font-medium text-gray-700 dark:text-gray-300">{r.date}</td>
                                                    <td className="p-4">
                                                        <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 capitalize">
                                                            {r.style}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 font-bold text-gray-800 dark:text-white">{r.distance}</td>
                                                    <td className="p-4 font-bold text-host-cyan">{r.time}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="p-12 text-center text-gray-500">{t('student_dashboard.results.no_results')}</div>
                            )}
                        </div>
                    )}

                    {/* Recovery Tab */}
                    {activeTab === 'recovery' && (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center space-x-3">
                                <RotateCcw className="text-yellow-500" size={24} />
                                <h2 className="text-xl font-bold text-gray-800 dark:text-white">{t('student_dashboard.recovery.title')}</h2>
                            </div>
                            {recoverySessions.length > 0 ? (
                                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {recoverySessions.map(r => (
                                        <div key={r.id} className="p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                            <div className="flex items-center space-x-4">
                                                <div className="p-2 bg-yellow-100 rounded-full text-yellow-600">
                                                    <RotateCcw size={20} />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-800 dark:text-gray-200">{r.date}</div>
                                                    <div className="text-xs text-gray-500">{t('student_dashboard.recovery.session')}</div>
                                                </div>
                                            </div>
                                            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-yellow-100 text-yellow-700">
                                                {t('student_dashboard.recovery.title')}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-12 text-center text-gray-500">{t('student_dashboard.recovery.no_sessions')}</div>
                            )}
                        </div>
                    )}

                    {/* Messages Tab */}
                    {activeTab === 'messages' && (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center space-x-3">
                                <MessageCircle className="text-host-cyan" size={24} />
                                <h2 className="text-xl font-bold text-gray-800 dark:text-white">{t('student_dashboard.messages.title')}</h2>
                            </div>
                            <div className="max-h-96 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700">
                                {messages.length > 0 ? messages.map(m => (
                                    <div key={m.id} className={clsx(
                                        "p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors",
                                        m.senderId === user?.id ? "bg-blue-50/50 dark:bg-blue-900/10" : ""
                                    )}>
                                        <div className="flex justify-between items-start">
                                            <span className="text-sm font-bold text-host-blue dark:text-host-cyan">{m.senderName}</span>
                                            <span className="text-xs text-gray-400">{new Date(m.timestamp).toLocaleString()}</span>
                                        </div>
                                        <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{m.content}</p>
                                    </div>
                                )) : (
                                    <div className="p-12 text-center text-gray-500">{t('student_dashboard.messages.no_messages')}</div>
                                )}
                            </div>
                            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800/80">
                                <div className="flex items-center gap-3">
                                    <select
                                        value={selectedReceiver}
                                        onChange={e => setSelectedReceiver(e.target.value)}
                                        className="border-none bg-gray-200 dark:bg-gray-700/80 text-sm px-5 py-2.5 outline-none focus:ring-2 focus:ring-host-cyan/30 text-gray-700 dark:text-white font-semibold transition-all duration-200 cursor-pointer appearance-none"
                                        style={{ borderRadius: '9999px' }}
                                    >
                                        {mockCoaches.map((coach) => (
                                            <option key={coach.id} value={coach.id}>
                                                {coach.name} ({t(`coaches.${coach.id}.specialization`)})
                                            </option>
                                        ))}
                                        <option value="admin-1">{t('roles.admin')}</option>
                                    </select>
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={e => setNewMessage(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                                        placeholder={t('student_dashboard.messages.placeholder')}
                                        className="flex-1 border-none bg-gray-200 dark:bg-gray-700/80 text-sm px-5 py-2.5 outline-none focus:ring-2 focus:ring-host-cyan/30 text-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200"
                                        style={{ borderRadius: '9999px' }}
                                    />
                                    <button
                                        onClick={handleSendMessage}
                                        className="p-2.5 bg-host-cyan text-white hover:bg-host-blue transition-all duration-200 hover:scale-105 active:scale-95 flex-shrink-0"
                                    >
                                        <Send size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
