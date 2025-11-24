import { getHabitData } from '@/app/actions';
import Tools from '@/components/Tools';
import HabitManager from '@/components/HabitManager';

import DataResetSection from '@/components/DataResetSection';

export default async function SettingsPage() {
    const data = await getHabitData();

    return (
        <main className="min-h-screen p-4 sm:p-8 max-w-[1400px] mx-auto space-y-8 relative overflow-hidden">
            {/* Header */}
            <div className="space-y-1 relative">
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-sm text-muted">Manage your habits, data, and preferences</p>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">

                {/* Left Column - Habit Management (2/3 width) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-transparent backdrop-blur-xl border border-border/50 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-foreground/10 flex items-center justify-center">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">Habit Management</h2>
                                <p className="text-sm text-muted">Create and manage your daily habits</p>
                            </div>
                        </div>
                        <HabitManager habits={data.habits} />
                    </div>
                </div>

                {/* Right Column - Quick Actions (1/3 width) */}
                <div className="lg:col-span-1 space-y-6">

                    {/* Data Management Card */}
                    <div className="bg-transparent backdrop-blur-xl border border-border/50 rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-foreground/10 flex items-center justify-center">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">Data Tools</h2>
                                <p className="text-xs text-muted">Backup & restore</p>
                            </div>
                        </div>
                        <Tools data={data} />
                    </div>

                    {/* Reset Data Section */}
                    <DataResetSection />

                    {/* Stats Card */}
                    <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-6">
                        <h3 className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-4">Quick Stats</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted">Total Habits</span>
                                <span className="text-lg font-bold">{data.habits.length}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted">Days Tracked</span>
                                <span className="text-lg font-bold">{Object.keys(data.logs).length}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted">Notes Written</span>
                                <span className="text-lg font-bold">{Object.keys(data.notes).length}</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
}
