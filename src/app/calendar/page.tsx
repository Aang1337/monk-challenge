import { getHabitData } from '@/app/actions';
import DailyTracker from '@/components/DailyTracker';
import ActiveCalendar from '@/components/ActiveCalendar';
import MonthlySummary from '@/components/MonthlySummary';

export default async function CalendarPage() {
  const data = await getHabitData();
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  return (
    <main className="min-h-screen p-4 sm:p-8 max-w-[1600px] mx-auto space-y-8 relative overflow-hidden">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
        <p className="text-sm text-muted">Track your daily habits and progress</p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column - Daily Focus (2/3 width) */}
        <div className="lg:col-span-2">
          <div className="bg-transparent backdrop-blur-xl border border-border/50 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold">Daily Focus</h2>
                <p className="text-sm text-muted">{new Date(today).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>
            <DailyTracker
              habits={data.habits}
              logs={data.logs}
              today={today}
            />
          </div>
        </div>

        {/* Right Column - Calendar & Stats (1/3 width) */}
        <div className="lg:col-span-1 space-y-6">
          {/* Active Calendar */}
          <div className="bg-transparent backdrop-blur-xl border border-border/50 rounded-2xl overflow-hidden">
            <ActiveCalendar data={data} habits={data.habits} />
          </div>

          {/* Monthly Summary */}
          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-purple-600 dark:text-purple-400 mb-4">This Month</h3>
            <MonthlySummary data={data} habits={data.habits} />
          </div>
        </div>
      </div>
    </main>
  );
}
