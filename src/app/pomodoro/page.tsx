import { getHabitData } from '@/app/actions';
import PomodoroTimer from '@/components/PomodoroTimer';
import { Clock, Calendar, TrendingUp } from 'lucide-react';

export default async function PomodoroPage() {
    const data = await getHabitData();
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    // Calculate today's pomodoro time
    const todayMinutes = data.pomodoro?.[today] || 0;
    const hours = Math.floor(todayMinutes / 60);
    const minutes = todayMinutes % 60;

    // Helper to get total minutes for last N days
    const getLastNDaysMinutes = (n: number) => {
        let total = 0;
        for (let i = 0; i < n; i++) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            total += data.pomodoro?.[dateStr] || 0;
        }
        return total;
    };

    const last7Days = getLastNDaysMinutes(7);
    const last15Days = getLastNDaysMinutes(15);
    const last30Days = getLastNDaysMinutes(30);

    const formatDuration = (totalMinutes: number) => {
        const h = Math.floor(totalMinutes / 60);
        const m = totalMinutes % 60;
        if (h > 0) return `${h}h ${m}m`;
        return `${m}m`;
    };

    return (
        <main className="min-h-screen p-4 sm:p-8 max-w-[1400px] mx-auto relative overflow-hidden">
            {/* Header */}
            <div className="mb-8 space-y-1 relative">
                <h1 className="text-3xl font-bold tracking-tight">Pomodoro Timer</h1>
                <p className="text-sm text-muted">Stay focused with the Pomodoro Technique</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">

                {/* Main Timer - Takes 2 columns */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-black border border-border/20 rounded-3xl shadow-2xl overflow-hidden min-h-[500px]">
                        <PomodoroTimer />
                    </div>

                    {/* How it works - Horizontal Cards */}
                    <div className="bg-transparent border border-border/50 rounded-2xl p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                <span className="text-blue-400 font-bold">i</span>
                            </div>
                            <h3 className="text-lg font-bold text-foreground">How it works</h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Step 1 */}
                            <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/10 hover:bg-red-500/10 transition-colors">
                                <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center mb-3">
                                    <span className="text-red-500 font-bold">1</span>
                                </div>
                                <h4 className="font-bold text-red-100 mb-1">Focus (25 min)</h4>
                                <p className="text-xs text-red-200/60">Work on a single task with full attention</p>
                            </div>

                            {/* Step 2 */}
                            <div className="p-4 rounded-2xl bg-green-500/5 border border-green-500/10 hover:bg-green-500/10 transition-colors">
                                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center mb-3">
                                    <span className="text-green-500 font-bold">2</span>
                                </div>
                                <h4 className="font-bold text-green-100 mb-1">Short Break (5 min)</h4>
                                <p className="text-xs text-green-200/60">Take a quick break to rest and recharge</p>
                            </div>

                            {/* Step 3 */}
                            <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10 hover:bg-blue-500/10 transition-colors">
                                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center mb-3">
                                    <span className="text-blue-500 font-bold">3</span>
                                </div>
                                <h4 className="font-bold text-blue-100 mb-1">Repeat 4 times</h4>
                                <p className="text-xs text-blue-200/60">Complete 4 pomodoro cycles in a row</p>
                            </div>

                            {/* Step 4 */}
                            <div className="p-4 rounded-2xl bg-purple-500/5 border border-purple-500/10 hover:bg-purple-500/10 transition-colors">
                                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center mb-3">
                                    <span className="text-purple-500 font-bold">4</span>
                                </div>
                                <h4 className="font-bold text-purple-100 mb-1">Long Break (15 min)</h4>
                                <p className="text-xs text-purple-200/60">Take a longer restorative break</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Sidebar - Takes 1 column */}
                <div className="lg:col-span-1 space-y-6">

                    {/* Today's Focus Time */}
                    <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                                <Clock className="w-5 h-5 text-purple-400" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-purple-300">Today's Focus</h3>
                                <p className="text-xs text-purple-400/60">Total time spent focusing</p>
                            </div>
                        </div>
                        <div className="text-center py-4">
                            <div className="text-4xl font-bold text-purple-100 mb-1">
                                {hours > 0 && <span>{hours}h </span>}
                                <span>{minutes}m</span>
                            </div>
                            <p className="text-xs text-purple-300/50">Keep up the momentum!</p>
                        </div>
                    </div>

                    {/* Focus History */}
                    <div className="bg-surface/50 backdrop-blur-xl border border-border/50 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-foreground">Focus History</h3>
                                <p className="text-xs text-muted">Your consistency over time</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {/* 7 Days */}
                            <div className="flex items-center justify-between p-3 rounded-xl bg-surface hover:bg-surface-hover transition-colors border border-border/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-bold text-xs">
                                        7D
                                    </div>
                                    <span className="text-sm font-medium">Last 7 Days</span>
                                </div>
                                <span className="font-mono font-bold text-emerald-400">{formatDuration(last7Days)}</span>
                            </div>

                            {/* 15 Days */}
                            <div className="flex items-center justify-between p-3 rounded-xl bg-surface hover:bg-surface-hover transition-colors border border-border/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 font-bold text-xs">
                                        15D
                                    </div>
                                    <span className="text-sm font-medium">Last 15 Days</span>
                                </div>
                                <span className="font-mono font-bold text-amber-400">{formatDuration(last15Days)}</span>
                            </div>

                            {/* 30 Days */}
                            <div className="flex items-center justify-between p-3 rounded-xl bg-surface hover:bg-surface-hover transition-colors border border-border/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500 font-bold text-xs">
                                        30D
                                    </div>
                                    <span className="text-sm font-medium">Last 30 Days</span>
                                </div>
                                <span className="font-mono font-bold text-rose-400">{formatDuration(last30Days)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Tips */}
                    <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 backdrop-blur-xl border border-amber-500/20 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                                <span className="text-lg">💡</span>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-amber-200">Pro Tips</h3>
                                <p className="text-xs text-amber-500/60">Maximize your sessions</p>
                            </div>
                        </div>
                        <ul className="space-y-3 text-xs text-amber-100/80">
                            <li className="flex items-start gap-2">
                                <span className="text-amber-400 mt-0.5">•</span>
                                <span>Eliminate all distractions before starting</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-amber-400 mt-0.5">•</span>
                                <span>Use breaks to stretch and move around</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-amber-400 mt-0.5">•</span>
                                <span>Commit to one single task per pomodoro</span>
                            </li>
                        </ul>
                    </div>

                </div>
            </div>
        </main>
    );
}
