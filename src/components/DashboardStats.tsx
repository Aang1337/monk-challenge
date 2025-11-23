'use client';

import { useMemo } from 'react';
import { Trophy, Calendar, Zap, Hourglass, Clock } from 'lucide-react';
import { Data, Habit } from '@/lib/storage';

interface DashboardStatsProps {
    data: Data;
    habits: Habit[];
}

export default function DashboardStats({ data, habits }: DashboardStatsProps) {
    const stats = useMemo(() => {
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];

        // Helper to check if a date is active
        const isActive = (dateStr: string) => {
            const dayLogs = data.logs[dateStr] || {};
            const completedCount = Object.values(dayLogs).filter(Boolean).length;
            return habits.length > 0 && completedCount === habits.length;
        };

        // 1. Total Active Days
        const totalActive = Object.keys(data.logs).filter(isActive).length;

        // 2. Current Streak
        let streak = 0;
        let checkDate = new Date(today);

        // If today is active, start counting. If not, check yesterday.
        if (isActive(todayStr)) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
        } else {
            checkDate.setDate(checkDate.getDate() - 1);
        }

        while (true) {
            const dateStr = checkDate.toISOString().split('T')[0];
            if (isActive(dateStr)) {
                streak++;
                checkDate.setDate(checkDate.getDate() - 1);
            } else {
                break;
            }
        }

        // 3. Remaining Days until 2026
        const endOf2026 = new Date('2026-12-31');
        const diffTime = Math.abs(endOf2026.getTime() - today.getTime());
        const remainingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // 4. Total Focus Time
        const totalMinutes = Object.values(data.pomodoro || {}).reduce((acc, curr) => acc + curr, 0);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        const focusTime = `${hours}h ${minutes}m`;

        return { totalActive, streak, remainingDays, focusTime };
    }, [data, habits]);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-surface border border-border p-6 rounded-xl flex items-center gap-4">
                <div className="p-3 bg-orange-500/10 rounded-lg text-orange-500">
                    <Zap size={24} />
                </div>
                <div>
                    <div className="text-2xl font-bold">{stats.streak}</div>
                    <div className="text-xs text-muted uppercase tracking-wider">Day Streak</div>
                </div>
            </div>

            <div className="bg-surface border border-border p-6 rounded-xl flex items-center gap-4">
                <div className="p-3 bg-blue-500/10 rounded-lg text-blue-500">
                    <Trophy size={24} />
                </div>
                <div>
                    <div className="text-2xl font-bold">{stats.totalActive}</div>
                    <div className="text-xs text-muted uppercase tracking-wider">Total Active Days</div>
                </div>
            </div>

            <div className="bg-surface border border-border p-6 rounded-xl flex items-center gap-4">
                <div className="p-3 bg-purple-500/10 rounded-lg text-purple-500">
                    <Hourglass size={24} />
                </div>
                <div>
                    <div className="text-2xl font-bold">{stats.remainingDays}</div>
                    <div className="text-xs text-muted uppercase tracking-wider">Days Left (2026)</div>
                </div>
            </div>

            <div className="bg-surface border border-border p-6 rounded-xl flex items-center gap-4">
                <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-500">
                    <Clock size={24} />
                </div>
                <div>
                    <div className="text-2xl font-bold">{stats.focusTime}</div>
                    <div className="text-xs text-muted uppercase tracking-wider">Total Focus Time</div>
                </div>
            </div>
        </div>
    );
}
