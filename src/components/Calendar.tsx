import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { clsx } from 'clsx';

interface CalendarProps {
    selectedDate: Date | null;
    onDateSelect: (date: Date) => void;
    selectedTime: string | null;
    onTimeSelect: (time: string) => void;
}

export const Calendar: React.FC<CalendarProps> = ({ selectedDate, onDateSelect, selectedTime, onTimeSelect }) => {
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(today);

    // Mock time slots for demo
    const timeSlots = ['09:00', '10:30', '13:00', '15:30', '17:00'];

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month, 1).getDay(); // 0 = Sunday
    };

    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    // Adjust for Monday start (default is Sunday = 0)
    const startOffset = firstDay === 0 ? 6 : firstDay - 1;

    const handlePrevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    };

    const handleNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    };

    return (
        <div className="flex flex-col md:flex-row gap-8">
            {/* Calendar Grid */}
            <div className="flex-1">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="font-bold text-lg text-host-blue dark:text-white capitalize">
                        {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </h4>
                    <div className="flex space-x-2">
                        <button onClick={handlePrevMonth} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"><ChevronLeft /></button>
                        <button onClick={handleNextMonth} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"><ChevronRight /></button>
                    </div>
                </div>

                <div className="grid grid-cols-7 gap-2 text-center text-sm mb-2 font-medium text-gray-500">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => <div key={d}>{d}</div>)}
                </div>

                <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: startOffset }).map((_, i) => (
                        <div key={`empty-${i}`} />
                    ))}
                    {days.map(day => {
                        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                        const isSelected = selectedDate?.toDateString() === date.toDateString();
                        const isToday = today.toDateString() === date.toDateString();

                        return (
                            <button
                                key={day}
                                onClick={() => onDateSelect(date)}
                                className={clsx(
                                    "h-10 w-10 rounded-full flex items-center justify-center transition-all duration-200 text-sm",
                                    isSelected ? "bg-host-cyan text-white shadow-lg scale-110 font-bold" : "hover:bg-blue-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300",
                                    isToday && !isSelected && "border-2 border-host-blue text-host-blue font-bold"
                                )}
                            >
                                {day}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Time Slots */}
            <div className="w-full md:w-48 border-l border-gray-100 dark:border-gray-700 pl-0 md:pl-8 pt-6 md:pt-0">
                <h4 className="font-bold text-sm text-gray-500 uppercase tracking-wider mb-4 flex items-center">
                    <Clock size={16} className="mr-2" /> Available Times
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-1 gap-3">
                    {timeSlots.map(time => (
                        <button
                            key={time}
                            onClick={() => onTimeSelect(time)}
                            disabled={!selectedDate}
                            className={clsx(
                                "py-2 px-4 rounded-lg text-sm font-medium border transition-all",
                                selectedTime === time
                                    ? "bg-host-blue text-white border-host-blue shadow-md"
                                    : "border-gray-200 dark:border-gray-600 hover:border-host-cyan text-gray-600 dark:text-gray-300",
                                !selectedDate && "opacity-50 cursor-not-allowed"
                            )}
                        >
                            {time}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
