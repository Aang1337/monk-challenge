import { getHabitData } from '@/app/actions';
import PomodoroTimer from '@/components/PomodoroTimer';

export default async function PomodoroPage() {
    const data = await getHabitData();
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    // Calculate today's pomodoro time
    const todayMinutes = data.pomodoro?.[today] || 0;
    const hours = Math.floor(todayMinutes / 60);
    const minutes = todayMinutes % 60;

    return (
        <main className="min-h-screen p-4 sm:p-8 max-w-[1400px] mx-auto relative overflow-hidden">
            {/* Header */}
            <div className="mb-6 space-y-1 relative">
                <h1 className="text-3xl font-bold tracking-tight">Pomodoro Timer</h1>
                <p className="text-sm text-muted">Stay focused with the Pomodoro Technique</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">

                {/* Main Timer - Takes 2 columns */}
                <div className="lg:col-span-2">
                    <div className="bg-surface/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl overflow-hidden">
                        <PomodoroTimer />
                    </div>
                </div>

                {/* Stats Sidebar - Takes 1 column */}
                <div className="lg:col-span-1 space-y-6">

                    {/* Today's Focus Time */}
                    <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 backdrop-blur-xl border border-purple-500/30 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                                <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xs font-semibold text-purple-300">Today's Focus Time</h3>
                        </div>
                        <div className="text-center space-y-1">
                            <div className="text-3xl font-bold text-purple-100">
                                {hours > 0 && <span>{hours}h </span>}
                                <span>{minutes}m</span>
                            </div>
                            <p className="text-[10px] text-purple-300/70">Total focused time</p>
                        </div>
                    </div>

                    {/* Pomodoro Info */}
                    <div className="bg-transparent backdrop-blur-xl border border-border/50 rounded-xl p-4 space-y-3">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-sm font-semibold text-foreground">How it works</h3>
                        </div>

                        <div className="space-y-2 text-xs">
                            <div className="flex gap-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                                <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                                    <span className="text-red-400 font-bold text-sm">1</span>
                                </div>
                                <div>
                                    <p className="font-medium text-foreground">Focus (25 min)</p>
                                    <p className="text-xs text-muted">Work on a single task</p>
                                </div>
                            </div>

                            <div className="flex gap-3 p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                                    <span className="text-green-400 font-bold text-sm">2</span>
                                </div>
                                <div>
                                    <p className="font-medium text-foreground">Short Break (5 min)</p>
                                    <p className="text-xs text-muted">Rest and recharge</p>
                                </div>
                            </div>

                            <div className="flex gap-3 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                                    <span className="text-blue-400 font-bold text-sm">3</span>
                                </div>
                                <div>
                                    <p className="font-medium text-foreground">Repeat 4 times</p>
                                    <p className="text-xs text-muted">Complete 4 pomodoros</p>
                                </div>
                            </div>

                            <div className="flex gap-3 p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                                    <span className="text-purple-400 font-bold text-sm">4</span>
                                </div>
                                <div>
                                    <p className="font-medium text-foreground">Long Break (15 min)</p>
                                    <p className="text-xs text-muted">Take a longer rest</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tips */}
                    <div className="bg-gradient-to-br from-amber-500/20 to-amber-600/10 backdrop-blur-xl border border-amber-500/30 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                                <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                            </div>
                            <h3 className="text-xs font-semibold text-amber-300">💡 Pro Tips</h3>
                        </div>
                        <ul className="space-y-1.5 text-xs text-amber-100/90">
                            <li className="flex items-start gap-2">
                                <span className="text-amber-400 mt-0.5">•</span>
                                <span>Eliminate all distractions</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-amber-400 mt-0.5">•</span>
                                <span>Use breaks to stretch</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-amber-400 mt-0.5">•</span>
                                <span>Stay hydrated</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-amber-400 mt-0.5">•</span>
                                <span>One task per pomodoro</span>
                            </li>
                        </ul>
                    </div>

                </div>
            </div>
        </main>
    );
}
