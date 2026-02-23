import React, { useMemo, useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { mockBookings, mockStudents, mockCourses } from '../data/mockData';
import { Calendar, CheckCircle, Clock, XCircle, RotateCcw, Trophy, MessageCircle, Send, Users, User } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import type { AttendanceRecord, SwimmingResult, Message, SwimStyle, SwimDistance } from '../types';
import { attendanceService, resultsService, messageService, scheduleService } from '../services/api';
import type { CoachScheduleSlot } from '../types';

export const CoachDashboard: React.FC = () => {
    const { user } = useAuth();
    const { t } = useTranslation();

    const coachId = user?.id === 'c1' ? 'c1' : 'c1';

    const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
    const [allResults, setAllResults] = useState<SwimmingResult[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [scheduleSlots, setScheduleSlots] = useState<CoachScheduleSlot[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [selectedParent, setSelectedParent] = useState('user-1');
    const [activeTab, setActiveTab] = useState<'schedule' | 'attendance' | 'results' | 'messages' | 'recovery' | 'individual' | 'count'>('schedule');

    // Results form state
    const [resultForm, setResultForm] = useState({
        studentId: 's1',
        style: 'freestyle' as SwimStyle,
        distance: '25m' as SwimDistance,
        time: '',
    });

    useEffect(() => {
        attendanceService.getAll().then(setAttendance);
        resultsService.getAll().then(setAllResults);
        messageService.getByUser(coachId).then(setMessages);
        scheduleService.getByCoach(coachId).then(setScheduleSlots);
    }, [coachId]);

    const schedule = useMemo(() => {
        return mockBookings
            .filter(b => b.coachId === coachId)
            .map(b => {
                const student = mockStudents.find(s => s.id === b.studentId) || { name: 'Unknown Student', level: 'N/A' };
                const course = mockCourses.find(c => c.id === b.courseId);
                return { ...b, student, course };
            })
            .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime());
    }, [coachId]);

    const today = new Date().toISOString().split('T')[0];
    const todaysSessions = schedule.filter(s => s.date === today);
    const recoverySessions = attendance.filter(a => a.status === 'recovery');
    const individualSessions = schedule.filter(s => {
        const sameDateSessions = schedule.filter(ss => ss.date === s.date && ss.time === s.time);
        return sameDateSessions.length === 1;
    });

    const handleMarkAttendance = async (studentId: string, bookingId: string, date: string, status: 'present' | 'absent' | 'recovery') => {
        const record = await attendanceService.mark({
            bookingId,
            studentId,
            date,
            status,
            markedBy: coachId,
        });
        setAttendance(prev => [...prev, record]);
    };

    const handleAddResult = async () => {
        if (!resultForm.time) return;
        const newResult = await resultsService.create({
            studentId: resultForm.studentId,
            coachId,
            style: resultForm.style,
            distance: resultForm.distance,
            time: resultForm.time,
            date: new Date().toISOString().split('T')[0],
        });
        setAllResults(prev => [...prev, newResult]);
        setResultForm(prev => ({ ...prev, time: '' }));
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !user) return;
        const student = mockStudents.find(s => s.id === selectedParent);
        const sent = await messageService.send({
            senderId: user.id,
            senderName: user.name,
            receiverId: selectedParent,
            receiverName: student ? `Părinte ${student.name}` : 'Părinte',
            content: newMessage,
        });
        setMessages(prev => [...prev, sent]);
        setNewMessage('');
    };

    // Count students per time slot
    const studentCountPerSlot = useMemo(() => {
        const countMap: Record<string, number> = {};
        schedule.forEach(s => {
            const key = `${s.date} ${s.time}`;
            countMap[key] = (countMap[key] || 0) + 1;
        });
        return Object.entries(countMap).map(([slot, count]) => ({ slot, count }));
    }, [schedule]);

    const tabs = [
        { key: 'schedule' as const, label: t('coach_dashboard.tabs.schedule') },
        { key: 'attendance' as const, label: t('coach_dashboard.tabs.attendance') },
        { key: 'results' as const, label: t('coach_dashboard.tabs.results') },
        { key: 'messages' as const, label: t('coach_dashboard.tabs.messages') },
        { key: 'recovery' as const, label: t('coach_dashboard.tabs.recovery') },
        { key: 'individual' as const, label: t('coach_dashboard.tabs.individual') },
        { key: 'count' as const, label: t('coach_dashboard.tabs.count') },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
            <PageHeader
                title={t('coach_dashboard.welcome', { name: user?.name })}
                subtitle={t('coach_dashboard.subtitle')}
            />

            <div className="container mx-auto px-6 -mt-10 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
                        <p className="text-sm text-gray-500">{t('coach_dashboard.stats.todays_sessions')}</p>
                        <p className="text-3xl font-extrabold text-host-blue dark:text-white mt-2">{schedule.length}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
                        <p className="text-sm text-gray-500">{t('coach_dashboard.stats.upcoming_classes')}</p>
                        <p className="text-3xl font-extrabold text-host-cyan mt-2">{todaysSessions.length}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
                        <p className="text-sm text-gray-500">{t('coach_dashboard.stats.recovery')}</p>
                        <p className="text-3xl font-extrabold text-yellow-500 mt-2">{recoverySessions.length}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
                        <p className="text-sm text-gray-500">{t('coach_dashboard.stats.total_results')}</p>
                        <p className="text-3xl font-extrabold text-purple-500 mt-2">{allResults.filter(r => r.coachId === coachId).length}</p>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="border-b border-gray-200 dark:border-gray-700 flex space-x-4 overflow-x-auto mb-8">
                    {tabs.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={clsx(
                                "pb-3 text-sm font-bold uppercase tracking-wide border-b-2 transition-colors whitespace-nowrap",
                                activeTab === tab.key
                                    ? "border-host-cyan text-host-cyan"
                                    : "border-transparent text-gray-400 hover:text-gray-600"
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Schedule Tab */}
                {activeTab === 'schedule' && (
                    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="p-8 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{t('coach_dashboard.training_schedule')}</h2>
                            <div className="flex space-x-2">
                                <span className="px-3 py-1 bg-host-cyan/10 text-host-cyan rounded-full text-xs font-bold uppercase tracking-wide">Upcoming</span>
                                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 rounded-full text-xs font-bold uppercase tracking-wide">Past</span>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider">
                                    <tr>
                                        <th className="p-6 font-semibold">{t('coach_dashboard.table.time')}</th>
                                        <th className="p-6 font-semibold">{t('coach_dashboard.table.student')}</th>
                                        <th className="p-6 font-semibold">{t('coach_dashboard.table.course')}</th>
                                        <th className="p-6 font-semibold">{t('coach_dashboard.table.status')}</th>
                                        <th className="p-6 font-semibold text-right">{t('coach_dashboard.table.action')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {schedule.map((session) => (
                                        <tr key={session.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors group">
                                            <td className="p-6">
                                                <div className="font-bold text-gray-800 dark:text-white flex items-center">
                                                    <Calendar size={16} className="mr-2 text-host-cyan" /> {session.date}
                                                </div>
                                                <div className="text-sm text-gray-500 mt-1 flex items-center">
                                                    <Clock size={14} className="mr-2" /> {session.time}
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <div className="font-medium text-gray-800 dark:text-gray-200">{session.student.name}</div>
                                                <div className="text-xs text-gray-500">{session.student.level}</div>
                                            </td>
                                            <td className="p-6">
                                                <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                                                    {session.course ? t(`courses.${session.course.id}.title`) : session.courseId}
                                                </span>
                                            </td>
                                            <td className="p-6">
                                                <span className={clsx(
                                                    "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide",
                                                    session.status === 'upcoming' ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                                                )}>
                                                    {session.status}
                                                </span>
                                            </td>
                                            <td className="p-6 text-right">
                                                <button className="text-gray-400 hover:text-host-cyan transition-colors">
                                                    <CheckCircle size={20} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Attendance Tab */}
                {activeTab === 'attendance' && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white">{t('coach_dashboard.attendance.title')}</h2>
                        </div>
                        <div className="divide-y divide-gray-100 dark:divide-gray-700">
                            {schedule.filter(s => s.status === 'upcoming').map(session => {
                                const existing = attendance.find(a => a.bookingId === session.id && a.studentId === session.studentId);
                                return (
                                    <div key={session.id} className="p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <div className="flex items-center space-x-4">
                                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                                                <User size={18} className="text-host-blue" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-800 dark:text-gray-200">{session.student.name}</div>
                                                <div className="text-xs text-gray-500">{session.date} • {session.time} • {session.course ? t(`courses.${session.course.id}.title`) : session.courseId}</div>
                                            </div>
                                        </div>
                                        {existing ? (
                                            <span className={clsx(
                                                "px-3 py-1 rounded-full text-xs font-bold uppercase",
                                                existing.status === 'present' ? "bg-green-100 text-green-700" :
                                                    existing.status === 'absent' ? "bg-red-100 text-red-700" :
                                                        "bg-yellow-100 text-yellow-700"
                                            )}>
                                                {existing.status === 'present' ? t('coach_dashboard.attendance.present') : existing.status === 'absent' ? t('coach_dashboard.attendance.absent') : t('coach_dashboard.attendance.recovery')}
                                            </span>
                                        ) : (
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleMarkAttendance(session.studentId, session.id, session.date, 'present')}
                                                    className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
                                                >
                                                    <CheckCircle size={14} className="inline mr-1" />{t('coach_dashboard.attendance.action.mark_present')}
                                                </button>
                                                <button
                                                    onClick={() => handleMarkAttendance(session.studentId, session.id, session.date, 'absent')}
                                                    className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                                                >
                                                    <XCircle size={14} className="inline mr-1" />{t('coach_dashboard.attendance.action.mark_absent')}
                                                </button>
                                                <button
                                                    onClick={() => handleMarkAttendance(session.studentId, session.id, session.date, 'recovery')}
                                                    className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition-colors"
                                                >
                                                    <RotateCcw size={14} className="inline mr-1" />{t('coach_dashboard.attendance.action.mark_recovery')}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Results Tab */}
                {activeTab === 'results' && (
                    <div className="space-y-8">
                        {/* Add Result Form */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6">
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                                <Trophy className="mr-2 text-host-cyan" size={20} />
                                {t('coach_dashboard.results.add_title')}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                <select
                                    value={resultForm.studentId}
                                    onChange={e => setResultForm(prev => ({ ...prev, studentId: e.target.value }))}
                                    className="rounded border-gray-300 p-2 text-sm focus:border-host-cyan outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                >
                                    {mockStudents.map(s => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                                <select
                                    value={resultForm.style}
                                    onChange={e => setResultForm(prev => ({ ...prev, style: e.target.value as SwimStyle }))}
                                    className="rounded border-gray-300 p-2 text-sm focus:border-host-cyan outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                >
                                    <option value="freestyle">Freestyle</option>
                                    <option value="backstroke">Backstroke</option>
                                    <option value="butterfly">Butterfly</option>
                                    <option value="breaststroke">Breaststroke</option>
                                </select>
                                <select
                                    value={resultForm.distance}
                                    onChange={e => setResultForm(prev => ({ ...prev, distance: e.target.value as SwimDistance }))}
                                    className="rounded border-gray-300 p-2 text-sm focus:border-host-cyan outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                >
                                    <option value="25m">25m</option>
                                    <option value="50m">50m</option>
                                    <option value="100m">100m</option>
                                    <option value="200m">200m</option>
                                </select>
                                <input
                                    type="text"
                                    value={resultForm.time}
                                    onChange={e => setResultForm(prev => ({ ...prev, time: e.target.value }))}
                                    placeholder="00:35.20"
                                    className="rounded border-gray-300 p-2 text-sm focus:border-host-cyan outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                />
                                <button
                                    onClick={handleAddResult}
                                    className="bg-host-cyan text-white rounded-lg px-4 py-2 text-sm font-bold hover:bg-host-blue transition-colors"
                                >
                                    {t('coach_dashboard.results.save')}
                                </button>
                            </div>
                        </div>

                        {/* Results Table */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                                <h2 className="text-xl font-bold text-gray-800 dark:text-white">{t('coach_dashboard.results.all_results')}</h2>
                            </div>
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
                                        {allResults.filter(r => r.coachId === coachId).map(r => {
                                            const student = mockStudents.find(s => s.id === r.studentId);
                                            return (
                                                <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                                    <td className="p-4 font-medium text-gray-800 dark:text-gray-200">{student?.name || r.studentId}</td>
                                                    <td className="p-4">
                                                        <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 capitalize">
                                                            {r.style}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 font-bold text-gray-800 dark:text-white">{r.distance}</td>
                                                    <td className="p-4 font-bold text-host-cyan">{r.time}</td>
                                                    <td className="p-4 text-gray-500">{r.date}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Messages / Parent Communication Tab */}
                {activeTab === 'messages' && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center space-x-3">
                            <MessageCircle className="text-host-cyan" size={24} />
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white">{t('coach_dashboard.messages.title')}</h2>
                        </div>
                        <div className="max-h-96 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700">
                            {messages.length > 0 ? messages.map(m => (
                                <div key={m.id} className={clsx(
                                    "p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors",
                                    m.senderId === coachId ? "bg-blue-50/50 dark:bg-blue-900/10" : ""
                                )}>
                                    <div className="flex justify-between items-start">
                                        <span className="text-sm font-bold text-host-blue dark:text-host-cyan">{m.senderName}</span>
                                        <span className="text-xs text-gray-400">{new Date(m.timestamp).toLocaleString()}</span>
                                    </div>
                                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{m.content}</p>
                                </div>
                            )) : (
                                <div className="p-12 text-center text-gray-500">{t('coach_dashboard.messages.no_messages')}</div>
                            )}
                        </div>
                        <div className="p-4 border-t border-gray-100 dark:border-gray-700">
                            <div className="flex items-center space-x-3">
                                <select
                                    value={selectedParent}
                                    onChange={e => setSelectedParent(e.target.value)}
                                    className="rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm p-2 outline-none focus:ring-1 focus:ring-host-cyan dark:text-white"
                                >
                                    {mockStudents.map(s => (
                                        <option key={s.id} value={s.id}>Părinte {s.name}</option>
                                    ))}
                                </select>
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={e => setNewMessage(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                                    placeholder={t('coach_dashboard.messages.placeholder')}
                                    className="flex-1 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm p-2 outline-none focus:ring-1 focus:ring-host-cyan dark:text-white"
                                />
                                <button
                                    onClick={handleSendMessage}
                                    className="p-2 bg-host-cyan text-white rounded-lg hover:bg-host-blue transition-colors"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Recovery Tab */}
                {activeTab === 'recovery' && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center space-x-3">
                            <RotateCcw className="text-yellow-500" size={24} />
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white">{t('coach_dashboard.recovery.title')}</h2>
                        </div>
                        {recoverySessions.length > 0 ? (
                            <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                {recoverySessions.map(r => {
                                    const student = mockStudents.find(s => s.id === r.studentId);
                                    return (
                                        <div key={r.id} className="p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                            <div className="flex items-center space-x-4">
                                                <div className="p-2 bg-yellow-100 rounded-full text-yellow-600">
                                                    <RotateCcw size={20} />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-800 dark:text-gray-200">{student?.name || r.studentId}</div>
                                                    <div className="text-xs text-gray-500">{r.date}</div>
                                                </div>
                                            </div>
                                            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-yellow-100 text-yellow-700">
                                                {t('coach_dashboard.attendance.recovery')}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="p-12 text-center text-gray-500">{t('coach_dashboard.recovery.no_students')}</div>
                        )}
                    </div>
                )}

                {/* Individual Sessions Tab */}
                {activeTab === 'individual' && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center space-x-3">
                            <User className="text-host-blue" size={24} />
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white">{t('coach_dashboard.individual.title')}</h2>
                        </div>
                        {individualSessions.length > 0 ? (
                            <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                {individualSessions.map(s => (
                                    <div key={s.id} className="p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <div className="flex items-center space-x-4">
                                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                                                <User size={18} className="text-host-blue" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-800 dark:text-gray-200">{s.student.name}</div>
                                                <div className="text-xs text-gray-500">{s.course ? t(`courses.${s.course.id}.title`) : s.courseId}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-gray-700 dark:text-gray-300 flex items-center justify-end">
                                                <Calendar size={16} className="mr-2 text-host-cyan" /> {s.date}
                                            </div>
                                            <div className="text-sm text-gray-500 flex items-center justify-end mt-1">
                                                <Clock size={14} className="mr-1" /> {s.time}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-12 text-center text-gray-500">{t('coach_dashboard.individual.no_sessions')}</div>
                        )}
                    </div>
                )}

                {/* Student Count per Slot Tab */}
                {activeTab === 'count' && (
                    <div className="space-y-8">
                        {/* From schedule data */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center space-x-3">
                                <Users className="text-host-cyan" size={24} />
                                <h2 className="text-xl font-bold text-gray-800 dark:text-white">{t('coach_dashboard.count.title')}</h2>
                            </div>
                            <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                {studentCountPerSlot.map((entry, idx) => (
                                    <div key={idx} className="p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <div className="flex items-center space-x-4">
                                            <div className="p-2 bg-host-cyan/10 rounded-full">
                                                <Clock size={18} className="text-host-cyan" />
                                            </div>
                                            <div className="font-bold text-gray-800 dark:text-gray-200">{entry.slot}</div>
                                        </div>
                                        <span className="bg-blue-100 text-blue-800 text-sm font-bold px-3 py-1 rounded-full">
                                            {entry.count} {entry.count === 1 ? 'copil' : 'copii'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* From coach schedule slots */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                                <h2 className="text-xl font-bold text-gray-800 dark:text-white">{t('coach_dashboard.count.week_schedule')}</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider">
                                        <tr>
                                            <th className="p-4 font-semibold">{t('coach_dashboard.count.headers.day')}</th>
                                            <th className="p-4 font-semibold">{t('coach_dashboard.count.headers.interval')}</th>
                                            <th className="p-4 font-semibold">{t('coach_dashboard.count.headers.students_max')}</th>
                                            <th className="p-4 font-semibold">{t('coach_dashboard.count.headers.occupancy')}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                        {scheduleSlots.map(slot => {
                                            const pct = Math.round((slot.currentStudents / slot.maxStudents) * 100);
                                            return (
                                                <tr key={slot.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                                    <td className="p-4 font-bold text-gray-800 dark:text-white">{slot.dayOfWeek}</td>
                                                    <td className="p-4 text-gray-600 dark:text-gray-300">{slot.startTime} - {slot.endTime}</td>
                                                    <td className="p-4 font-bold text-host-cyan">{slot.currentStudents} / {slot.maxStudents}</td>
                                                    <td className="p-4">
                                                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                                            <div
                                                                className={clsx(
                                                                    "h-2 rounded-full",
                                                                    pct >= 90 ? "bg-red-500" : pct >= 70 ? "bg-yellow-500" : "bg-green-500"
                                                                )}
                                                                style={{ width: `${pct}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-xs text-gray-500 mt-1">{pct}%</span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
