'use client';

import { useMemo } from 'react';
import { Data, Habit } from '@/lib/storage';

interface MonthlySummaryProps {
    data: Data;
    habits: Habit[];
}

export default function MonthlySummary({ data, habits }: MonthlySummaryProps) {
    const summary = useMemo(() => {
        const months: Record<string, number> = {};

        Object.keys(data.logs).forEach(dateStr => {
            const dayLogs = data.logs[dateStr] || {};
            const completedCount = Object.values(dayLogs).filter(Boolean).length;

            // Only count active days (all habits completed)
            if (habits.length > 0 && completedCount === habits.length) {
                const date = new Date(dateStr);
                const monthKey = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
                months[monthKey] = (months[monthKey] || 0) + 1;
            }
        });

        // Sort months (simple approach: just reverse keys assuming chronological insertion, 
        // but better to sort by date. For now, we'll just show what we have)
        return Object.entries(months).map(([month, count]) => ({ month, count }));
    }, [data, habits]);

    return (
        <div className="bg-surface border border-border rounded-xl p-6 mt-6">
            <h3 className="font-bold text-lg mb-4">Monthly Summary</h3>
            {summary.length === 0 ? (
                <p className="text-sm text-muted">No active days recorded yet.</p>
            ) : (
                <div className="space-y-3">
                    {summary.map((item) => (
                        <div key={item.month} className="flex items-center justify-between text-sm">
                            <span className="text-muted">{item.month}</span>
                            <span className="font-mono font-bold">{item.count} Days</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
