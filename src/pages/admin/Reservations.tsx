import React, { useState, useEffect } from 'react';
import { Card } from '../../components/Card';
import { PageHeader } from '../../components/PageHeader';
import { Table, TableRow } from '../../components/TableRow';
import type { Booking } from '../../types';
import { reservationService } from '../../services/api';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

export const Reservations: React.FC = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadBookings();
    }, []);

    const loadBookings = async () => {
        setIsLoading(true);
        try {
            const data = await reservationService.getAll();
            setBookings(data);
        } catch (error) {
            console.error('Failed to load bookings', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed': return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-bold uppercase flex items-center w-fit"><CheckCircle className="w-3 h-3 mr-1" /> Completed</span>;
            case 'cancelled': return <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-bold uppercase flex items-center w-fit"><XCircle className="w-3 h-3 mr-1" /> Cancelled</span>;
            default: return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-bold uppercase flex items-center w-fit"><Clock className="w-3 h-3 mr-1" /> Upcoming</span>;
        }
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen pb-20">
            <PageHeader
                title={<>ALL <span className="text-host-cyan">RESERVATIONS</span></>}
                subtitle="Monitor and manage all training sessions."
            />

            <div className="container mx-auto px-6 -mt-10 relative z-20">
                <Card className="p-0 overflow-hidden shadow-xl border-t-4 border-t-host-cyan">
                    {isLoading ? (
                        <div className="p-12 text-center text-gray-500">Loading reservations...</div>
                    ) : (
                        <Table headers={['Date & Time', 'Course', 'Student (ID)', 'Coach (ID)', 'Status', 'Actions']}>
                            {bookings.map((booking) => (
                                <TableRow key={booking.id}>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-gray-800 dark:text-gray-200">{booking.date}</span>
                                            <span className="text-sm text-host-cyan">{booking.time}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-700 dark:text-gray-300">{booking.courseId}</td>
                                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{booking.studentId}</td>
                                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{booking.coachId}</td>
                                    <td className="px-6 py-4">
                                        {getStatusBadge(booking.status)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button className="text-red-500 hover:text-red-700 text-sm font-bold transition-colors">Cancel</button>
                                    </td>
                                </TableRow>
                            ))}
                        </Table>
                    )}
                </Card>
            </div>
        </div>
    );
};
