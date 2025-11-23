'use client';

import { useState, useTransition, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Trophy } from 'lucide-react';
import clsx from 'clsx';
import { toggleHabitAction } from '@/app/actions';
import type { Habit } from '@/lib/storage';
import CelebrationPopup from './CelebrationPopup';
import { getCelebration } from '@/lib/celebrationData';

interface DailyTrackerProps {
    habits: Habit[];
    logs: Record<string, Record<string, boolean>>;
    today: string;
}

export default function DailyTracker({ habits, logs, today }: DailyTrackerProps) {
    const [isPending, startTransition] = useTransition();
    const [showCelebration, setShowCelebration] = useState(false);
    const [celebration, setCelebration] = useState({ gif: '', quote: '' });
    const previousCompletedRef = useRef(false);

    const completedCount = habits.filter(h => logs[today]?.[h.id]).length;
    const progress = habits.length > 0 ? (completedCount / habits.length) * 100 : 0;
    const allCompleted = habits.length > 0 && completedCount === habits.length;

    // Detect completion and show celebration popup
    useEffect(() => {
        const celebrationKey = `celebration-shown-${today}`;
        const hasShownToday = localStorage.getItem(celebrationKey);

        if (allCompleted && !hasShownToday && !previousCompletedRef.current) {
            const newCelebration = getCelebration();
            setCelebration(newCelebration);
            setShowCelebration(true);
            localStorage.setItem(celebrationKey, 'true');
        }

        previousCompletedRef.current = allCompleted;
    }, [allCompleted, today]);

    const handleToggleHabit = (habitId: string) => {
        const isCurrentlyCompleted = logs[today]?.[habitId] || false;
        if (isCurrentlyCompleted) return; // Prevent unchecking

        startTransition(async () => {
            await toggleHabitAction(today, habitId);
        });
    };

    return (
        <div className="w-full space-y-8">
            {/* Header / Progress */}
            <div className="relative p-6 rounded-2xl bg-surface border border-border overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-50" />

                <div className="relative z-10 flex justify-between items-end mb-4">
                    <div>
                        <div className="text-3xl font-bold">{completedCount}/{habits.length}</div>
                        <div className="text-sm text-muted">Habits Completed</div>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold">{Math.round(progress)}%</div>
                        <div className="text-xs text-muted">Progress</div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="relative h-3 bg-background/50 rounded-full overflow-hidden">
                    <motion.div
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                </div>
            </div>

            {/* Habits List */}
            <div className="space-y-3">
                {habits.map((habit) => {
                    const isCompleted = logs[today]?.[habit.id] || false;

                    return (
                        <motion.button
                            key={habit.id}
                            onClick={() => handleToggleHabit(habit.id)}
                            disabled={isCompleted}
                            className={clsx(
                                "w-full group relative p-5 rounded-xl border text-left transition-all duration-300",
                                isCompleted
                                    ? "bg-surface border-foreground/20 cursor-not-allowed"
                                    : "bg-surface/50 border-border hover:border-foreground/20 hover:bg-surface cursor-pointer"
                            )}
                            whileHover={!isCompleted ? { scale: 1.01 } : {}}
                            whileTap={!isCompleted ? { scale: 0.99 } : {}}
                            layout
                        >
                            <div className="flex items-center gap-4">
                                <div className={clsx(
                                    "flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-colors duration-300",
                                    isCompleted
                                        ? "bg-foreground border-foreground"
                                        : "border-muted group-hover:border-foreground/50"
                                )}>
                                    {isCompleted && <Check className="w-4 h-4 text-background" strokeWidth={3} />}
                                </div>

                                <div className="flex-grow">
                                    <h3 className={clsx(
                                        "font-semibold text-base transition-colors duration-300",
                                        isCompleted ? "text-muted line-through" : "text-foreground"
                                    )}>
                                        {habit.label}
                                    </h3>
                                    {habit.description && (
                                        <p className={clsx(
                                            "text-sm mt-1 transition-colors duration-300",
                                            isCompleted ? "text-muted/70" : "text-muted"
                                        )}>
                                            {habit.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </motion.button>
                    );
                })}
            </div>

            {/* Success Message */}
            <AnimatePresence>
                {allCompleted && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="p-6 rounded-2xl bg-foreground text-background text-center"
                    >
                        <Trophy className="w-8 h-8 mx-auto mb-2" />
                        <h3 className="font-bold text-lg">Monk Mode Mastered</h3>
                        <p className="text-sm opacity-80">You've completed all habits for today.</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Celebration Popup */}
            <CelebrationPopup
                isOpen={showCelebration}
                onClose={() => setShowCelebration(false)}
                gifUrl={celebration.gif}
                quote={celebration.quote}
                title="🎉 Daily Goals Crushed! 🎉"
            />
        </div>
    );
}
