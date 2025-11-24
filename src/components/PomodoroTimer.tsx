'use client';

import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Clock, Coffee, Brain } from 'lucide-react';
import { updatePomodoroTimeAction } from '@/app/actions';
import clsx from 'clsx';

type TimerMode = 'focus' | 'short' | 'long';

export default function PomodoroTimer() {
    const [timerActive, setTimerActive] = useState(false);
    const [mode, setMode] = useState<TimerMode>('focus');
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [cycle, setCycle] = useState(1);

    const modes = {
        focus: { label: 'Focus', minutes: 25, color: 'text-foreground' },
        short: { label: 'Short Break', minutes: 5, color: 'text-green-500' },
        long: { label: 'Long Break', minutes: 15, color: 'text-blue-500' },
    };

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (timerActive && timeLeft > 0) {
            interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
        } else if (timeLeft === 0) {
            setTimerActive(false);
            handleTimerComplete();
        }
        return () => clearInterval(interval);
    }, [timerActive, timeLeft]);

    const handleTimerComplete = () => {
        // Play notification sound
        try {
            new Audio('/notification.mp3').play().catch(() => { });
        } catch (e) { }

        if (mode === 'focus') {
            // Track time only for focus sessions
            updatePomodoroTimeAction(modes.focus.minutes);

            if (cycle < 4) {
                setMode('short');
                setTimeLeft(modes.short.minutes * 60);
                setCycle(c => c + 1);
            } else {
                setMode('long');
                setTimeLeft(modes.long.minutes * 60);
                setCycle(1); // Reset cycle after long break
            }
        } else {
            // Break is over, back to focus
            setMode('focus');
            setTimeLeft(modes.focus.minutes * 60);
        }
    };

    const switchMode = (newMode: TimerMode) => {
        setMode(newMode);
        setTimerActive(false);
        setTimeLeft(modes[newMode].minutes * 60);
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const toggleTimer = () => setTimerActive(!timerActive);
    const resetTimer = () => {
        setTimerActive(false);
        setTimeLeft(modes[mode].minutes * 60);
    };

    return (
        <div className="p-8 sm:p-12 flex flex-col items-center justify-center h-full min-h-[400px] relative">
            {/* Header / Cycle Indicator */}
            <div className="absolute top-8 left-8 right-8 flex items-center justify-between text-muted/60">
                <div className="flex items-center gap-2">
                    {mode === 'focus' ? <Brain size={18} /> : <Coffee size={18} />}
                    <span className="font-medium text-sm tracking-wide uppercase">{modes[mode].label}</span>
                </div>
                <div className="flex gap-1">
                    {[1, 2, 3, 4].map(i => (
                        <div
                            key={i}
                            className={clsx(
                                "w-2 h-2 rounded-full transition-colors",
                                i <= cycle ? "bg-foreground" : "bg-border"
                            )}
                        />
                    ))}
                </div>
            </div>

            {/* Mode Switcher */}
            <div className="flex gap-2 mb-8 bg-surface-hover/50 p-1 rounded-full border border-border/50">
                {(Object.keys(modes) as TimerMode[]).map((m) => (
                    <button
                        key={m}
                        onClick={() => switchMode(m)}
                        className={clsx(
                            "px-4 py-1.5 rounded-full text-xs font-medium transition-all",
                            mode === m
                                ? "bg-foreground text-background shadow-sm"
                                : "text-muted hover:text-foreground hover:bg-surface-active"
                        )}
                    >
                        {modes[m].label}
                    </button>
                ))}
            </div>

            <div className="flex flex-col items-center justify-center w-full max-w-2xl">
                <div className={clsx(
                    "text-[8rem] sm:text-[10rem] md:text-[12rem] leading-none font-bold tracking-tighter mb-12 font-variant-numeric tabular-nums transition-colors duration-500",
                    modes[mode].color
                )}>
                    {formatTime(timeLeft)}
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleTimer}
                        className="h-14 px-8 bg-white text-black hover:bg-white/90 rounded-full flex items-center justify-center gap-2 font-bold text-lg transition-all active:scale-95 shadow-lg shadow-white/10"
                    >
                        {timerActive ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" />}
                        {timerActive ? 'Pause' : 'Start'}
                    </button>

                    <button
                        onClick={resetTimer}
                        className="h-14 w-14 bg-surface-hover hover:bg-surface-active rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-all active:scale-95 border border-border/50"
                        aria-label="Reset Timer"
                    >
                        <RotateCcw size={22} />
                    </button>
                </div>
            </div>
        </div>
    );
}
