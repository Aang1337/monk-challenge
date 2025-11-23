'use client';

import { useMemo, useState, useEffect } from 'react';
import {
    Zap, Star, Crown, Award, Flame, Trophy, Shield, Gem, Rocket, Heart, Sun, Target
} from 'lucide-react';
import { Data, Habit } from '@/lib/storage';
import clsx from 'clsx';
import CelebrationPopup from './CelebrationPopup';
import { getCelebration } from '@/lib/celebrationData';

interface MilestonesProps {
    data: Data;
    habits: Habit[];
}

export default function Milestones({ data, habits }: MilestonesProps) {
    const { totalDays, milestones } = useMemo(() => {
        // Calculate total active days
        const isActive = (dateStr: string) => {
            const dayLogs = data.logs[dateStr] || {};
            const completedCount = Object.values(dayLogs).filter(Boolean).length;
            return habits.length > 0 && completedCount === habits.length;
        };
        const total = Object.keys(data.logs).filter(isActive).length;

        // Define unique milestone achievements
        const achievementMilestones = [
            { days: 1, label: 'First Step', icon: Zap, color: 'from-yellow-500/20 to-yellow-600/10 border-yellow-500/30' },
            { days: 3, label: 'Hat Trick', icon: Star, color: 'from-blue-500/20 to-blue-600/10 border-blue-500/30' },
            { days: 7, label: 'Week Warrior', icon: Flame, color: 'from-orange-500/20 to-orange-600/10 border-orange-500/30' },
            { days: 14, label: 'Fortnight Fighter', icon: Shield, color: 'from-purple-500/20 to-purple-600/10 border-purple-500/30' },
            { days: 21, label: 'Habit Formed', icon: Heart, color: 'from-pink-500/20 to-pink-600/10 border-pink-500/30' },
            { days: 30, label: 'Monthly Master', icon: Award, color: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30' },
            { days: 60, label: 'Two Month Titan', icon: Target, color: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/30' },
            { days: 90, label: 'Quarterly Champion', icon: Trophy, color: 'from-amber-500/20 to-amber-600/10 border-amber-500/30' },
            { days: 100, label: 'Century Club', icon: Gem, color: 'from-indigo-500/20 to-indigo-600/10 border-indigo-500/30' },
            { days: 150, label: 'Dedicated Soul', icon: Sun, color: 'from-yellow-500/20 to-yellow-600/10 border-yellow-500/30' },
            { days: 200, label: 'Unstoppable Force', icon: Rocket, color: 'from-red-500/20 to-red-600/10 border-red-500/30' },
            { days: 365, label: 'Year of Focus', icon: Crown, color: 'from-purple-500/20 to-purple-600/10 border-purple-500/30' },
        ];

        return {
            totalDays: total,
            milestones: achievementMilestones.map(m => ({
                ...m,
                unlocked: total >= m.days
            }))
        };
    }, [data, habits]);

    const [showCelebration, setShowCelebration] = useState(false);
    const [celebration, setCelebration] = useState({ gif: '', quote: '' });
    const [celebrationTitle, setCelebrationTitle] = useState('');

    const unlockedCount = milestones.filter(m => m.unlocked).length;

    // Detect new milestone unlocks
    useEffect(() => {
        const lastUnlockedKey = 'last-milestone-count';
        const lastUnlocked = parseInt(localStorage.getItem(lastUnlockedKey) || '0', 10);

        if (unlockedCount > lastUnlocked && lastUnlocked > 0) {
            const newlyUnlocked = milestones.filter(m => m.unlocked)[unlockedCount - 1];
            const newCelebration = getCelebration();
            setCelebration(newCelebration);
            setCelebrationTitle(`🏆 Milestone Unlocked: ${newlyUnlocked?.label || 'Achievement'} 🏆`);
            setShowCelebration(true);
        }

        if (unlockedCount > 0) {
            localStorage.setItem(lastUnlockedKey, unlockedCount.toString());
        }
    }, [unlockedCount, milestones]);

    return (
        <div className="bg-transparent border border-border rounded-2xl p-6 sm:p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h3 className="font-bold text-2xl mb-1">Milestones</h3>
                    <p className="text-sm text-muted">Your journey of {totalDays} days</p>
                </div>
                <div className="text-right">
                    <div className="text-3xl font-bold">{totalDays}</div>
                    <div className="text-xs text-muted">Total Days</div>
                </div>
            </div>

            {/* Milestones Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                {milestones.map((m) => (
                    <div
                        key={m.days}
                        className={clsx(
                            "flex flex-col items-center justify-center p-4 rounded-xl border text-center gap-3 transition-all",
                            m.unlocked
                                ? `bg-gradient-to-br ${m.color} shadow-md hover:scale-105`
                                : "bg-surface/30 border-border/50 opacity-40 grayscale"
                        )}
                    >
                        <div className={clsx(
                            "p-3 rounded-full",
                            m.unlocked ? "bg-foreground/10" : "bg-border/50"
                        )}>
                            <m.icon size={24} className={m.unlocked ? "text-foreground" : "text-muted"} />
                        </div>
                        <div>
                            <div className="font-bold text-sm mb-1">{m.label}</div>
                            <div className="text-xs text-muted">{m.days} days</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Celebration Popup */}
            <CelebrationPopup
                isOpen={showCelebration}
                onClose={() => setShowCelebration(false)}
                gifUrl={celebration.gif}
                quote={celebration.quote}
                title={celebrationTitle}
            />
        </div>
    );
}
