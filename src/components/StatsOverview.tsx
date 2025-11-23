'use client';

import { useMemo } from 'react';
import { Flame, Calendar as CalendarIcon, TrendingUp, Activity } from 'lucide-react';
import { Data, Habit } from '@/lib/storage';
import clsx from 'clsx';

interface StatsOverviewProps {
    data: Data;
    habits: Habit[];
}

export default function StatsOverview({ data, habits }: StatsOverviewProps) {
    const stats = useMemo(() => {
        const today = new Date();
        // Get last 42 days (6 weeks) for a nice grid
        const lastDays = Array.from({ length: 42 }, (_, i) => {
            const d = new Date();
            d.setDate(today.getDate() - (41 - i));
            return d.toISOString().split('T')[0];
        });

        // Calculate streaks
        const streaks: Record<string, number> = {};
        habits.forEach(habit => {
            let streak = 0;
            const todayStr = today.toISOString().split('T')[0];
            let currentCheck = new Date(today);

            if (data.logs[todayStr]?.[habit.id]) {
                streak++;
                currentCheck.setDate(currentCheck.getDate() - 1);
            } else {
                currentCheck.setDate(currentCheck.getDate() - 1);
            }

            while (true) {
                const dateStr = currentCheck.toISOString().split('T')[0];
                if (data.logs[dateStr]?.[habit.id]) {
                    streak++;
                    currentCheck.setDate(currentCheck.getDate() - 1);
                } else {
                    break;
                }
            }
            streaks[habit.id] = streak;
        });

        // Heatmap data
        const heatmap = lastDays.map(date => {
            const dayLogs = data.logs[date] || {};
            const completedCount = Object.values(dayLogs).filter(Boolean).length;
            const totalHabits = habits.length;
            const intensity = totalHabits > 0 ? completedCount / totalHabits : 0;
            return { date, intensity };
        });

        return { streaks, heatmap };
    }, [data, habits]);

    return (
        <div className="bg-surface border border-border rounded-xl p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg flex items-center gap-2">
                    <Activity size={20} className="text-foreground" />
                    Habit Performance
                </h3>
            </div>

            {/* Heatmap Section */}
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-3 text-sm text-muted">
                    <CalendarIcon size={14} />
                    <span>Consistency (Last 6 Weeks)</span>
                </div>
                <div className="grid grid-cols-7 gap-1.5">
                    {stats.heatmap.map((day) => (
                        <div
                            key={day.date}
                            title={`${day.date}: ${Math.round(day.intensity * 100)}%`}
                            className={clsx(
                                "aspect-square rounded-sm transition-all duration-300",
                                day.intensity === 0 ? "bg-surface-hover/50" : "bg-foreground"
                            )}
                            style={{
                                opacity: day.intensity === 0 ? 1 : Math.max(0.2, day.intensity)
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Streaks Section */}
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-3 text-sm text-muted">
                    <TrendingUp size={14} />
                    <span>Current Streaks</span>
                </div>
                <div className="space-y-2">
                    {habits.map(habit => (
                        <div
                            key={habit.id}
                            className="flex items-center justify-between p-3 rounded-lg bg-surface-hover/30 hover:bg-surface-hover transition-colors group"
                        >
                            <span className="font-medium text-sm">{habit.label}</span>
                            <div className={clsx(
                                "flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-bold transition-colors",
                                stats.streaks[habit.id] > 0
                                    ? "bg-orange-500/10 text-orange-500 group-hover:bg-orange-500/20"
                                    : "bg-surface text-muted"
                            )}>
                                <Flame size={12} fill={stats.streaks[habit.id] > 0 ? "currentColor" : "none"} />
                                {stats.streaks[habit.id]}
                            </div>
                        </div>
                    ))}
                    {habits.length === 0 && (
                        <div className="text-center text-sm text-muted py-4">
                            No habits added yet.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
