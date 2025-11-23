'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Data, Habit } from '@/lib/storage';
import clsx from 'clsx';

interface ActiveCalendarProps {
    data: Data;
    habits: Habit[];
}

export default function ActiveCalendar({ data, habits }: ActiveCalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date());

    const { days, monthLabel } = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        const daysInMonth = lastDay.getDate();
        const startDayOfWeek = firstDay.getDay(); // 0 = Sunday

        const days = [];

        // Padding for previous month
        for (let i = 0; i < startDayOfWeek; i++) {
            days.push(null);
        }

        // Days of current month
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(new Date(year, month, i));
        }

        return {
            days,
            monthLabel: firstDay.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        };
    }, [currentDate]);

    const isActiveDay = (date: Date) => {
        // Use local timezone instead of UTC
        const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        const dayLogs = data.logs[dateStr] || {};
        const dailyTasksForDate = data.dailyTasks[dateStr] || [];

        // Total items = habits + daily tasks for that date
        const totalItems = habits.length + dailyTasksForDate.length;

        // Count completed items (both habits and daily tasks)
        const habitIds = habits.map(h => h.id);
        const taskIds = dailyTasksForDate.map(t => t.id);
        const allIds = [...habitIds, ...taskIds];

        const completedCount = allIds.filter(id => dayLogs[id]).length;

        // Day is active if there are items AND all are completed
        return totalItems > 0 && completedCount === totalItems;
    };

    const changeMonth = (delta: number) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + delta);
        setCurrentDate(newDate);
    };

    return (
        <div className="bg-surface border border-border rounded-xl p-6 h-full">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg">Active Calendar</h3>
                <div className="flex items-center gap-2">
                    <button onClick={() => changeMonth(-1)} className="p-1 hover:bg-surface-hover rounded">
                        <ChevronLeft size={20} />
                    </button>
                    <span className="text-sm font-medium min-w-[120px] text-center">{monthLabel}</span>
                    <button onClick={() => changeMonth(1)} className="p-1 hover:bg-surface-hover rounded">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center mb-2">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                    <div key={`day-${i}`} className="text-xs text-muted font-medium">{d}</div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
                {days.map((date, i) => {
                    if (!date) return <div key={`empty-${i}`} />;

                    const active = isActiveDay(date);
                    const isToday = date.toDateString() === new Date().toDateString();

                    return (
                        <div
                            key={date.toISOString()}
                            className={clsx(
                                "aspect-square rounded-lg flex items-center justify-center text-sm relative transition-all duration-300",
                                active ? "bg-emerald-600 text-white font-bold shadow-sm" : "bg-surface-hover text-muted",
                                isToday && !active && "border border-foreground/50"
                            )}
                        >
                            {date.getDate()}
                            {active && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow-sm"
                                >
                                    <Check size={8} className="text-emerald-600" strokeWidth={4} />
                                </motion.div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs text-muted">
                <div className="w-3 h-3 rounded bg-emerald-600"></div>
                <span>Active Day (All habits completed)</span>
            </div>
        </div>
    );
}
