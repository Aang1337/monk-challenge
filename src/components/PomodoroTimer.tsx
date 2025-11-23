'use client';

import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Clock } from 'lucide-react';
import { updatePomodoroTimeAction } from '@/app/actions';

export default function PomodoroTimer() {
    const [timerActive, setTimerActive] = useState(false);
    const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes default
    const [duration, setDuration] = useState(25); // For resetting

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (timerActive && timeLeft > 0) {
            interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
        } else if (timeLeft === 0) {
            setTimerActive(false);
            // Play notification sound
            try {
                new Audio('/notification.mp3').play().catch(() => { });
            } catch (e) {
                // Fallback if audio fails
            }
            // Track completed pomodoro
            updatePomodoroTimeAction(duration);
        }
        return () => clearInterval(interval);
    }, [timerActive, timeLeft, duration]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const toggleTimer = () => setTimerActive(!timerActive);
    const resetTimer = () => {
        setTimerActive(false);
        setTimeLeft(duration * 60);
    };

    return (
        <div className="p-6 sm:p-8 flex flex-col justify-between h-full min-h-[300px]">
            <div className="flex items-center gap-2 mb-4 text-muted">
                <Clock size={20} />
                <span className="font-medium">Focus Timer</span>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center py-4 sm:py-8">
                <div className="text-6xl sm:text-7xl md:text-8xl font-mono font-bold tracking-wider mb-8 sm:mb-12">
                    {formatTime(timeLeft)}
                </div>

                <div className="flex gap-3 w-full max-w-md">
                    <button
                        onClick={toggleTimer}
                        className="flex-1 bg-foreground text-background py-3 sm:py-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 font-medium transition-all text-sm sm:text-base"
                    >
                        {timerActive ? <Pause size={20} /> : <Play size={20} />}
                        {timerActive ? 'Pause' : 'Start'}
                    </button>
                    <button
                        onClick={resetTimer}
                        className="p-3 sm:p-4 bg-surface-hover rounded-xl hover:bg-border transition-colors"
                        aria-label="Reset Timer"
                    >
                        <RotateCcw size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}
