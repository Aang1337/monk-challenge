'use client';

import { useData } from '@/contexts/DataContext';
import Milestones from '@/components/Milestones';
import ProgressChart from '@/components/ProgressChart';

export default function GoalsPage() {
  const { data, isLoading } = useData();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-foreground/20 border-t-foreground animate-spin" />
          <p className="text-muted text-sm">Loading goals...</p>
        </div>
      </div>
    );
  }

  // Calculate stats with proper null safety
  const totalDays = data?.logs ? Object.keys(data.logs).length : 0;
  const last30Days = data?.logs
    ? Object.keys(data.logs).sort().slice(-30)
    : [];

  // Calculate completion rate for last 30 days
  const completionData = last30Days.map(date => {
    const dayLogs = data?.logs?.[date] || {};
    const completed = Object.values(dayLogs).filter(Boolean).length;
    const total = data?.habits?.length || 0;
    const rate = total > 0 ? (completed / total) * 100 : 0;
    return {
      date,
      value: Math.min(rate, 100) // Cap at 100%
    };
  });

  // Calculate streak - must be consecutive days
  let currentStreak = 0;
  let longestStreak = 0;

  // Only calculate streaks if we have habits
  if (data?.habits && data.habits.length > 0 && data?.logs) {
    const allDates = Object.keys(data.logs).sort();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check current streak (backwards from today)
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];

      const dayLogs = data.logs[dateStr] || {};
      const completed = Object.values(dayLogs).filter(Boolean).length;
      const isComplete = completed === data.habits.length;

      if (isComplete) {
        currentStreak++;
      } else {
        break;
      }
    }

    // Calculate longest streak
    let tempStreak = 0;
    for (let i = 0; i < allDates.length; i++) {
      const date = allDates[i];
      const dayLogs = data.logs[date] || {};
      const completed = Object.values(dayLogs).filter(Boolean).length;
      const isComplete = completed === data.habits.length;

      if (isComplete) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    }
  }

  // Calculate total completions
  const totalCompletions = data?.logs
    ? Object.values(data.logs).reduce((sum, dayLogs) => {
      return sum + Object.values(dayLogs || {}).filter(Boolean).length;
    }, 0)
    : 0;

  // Calculate average completion rate (capped at 100%)
  const avgCompletionRate = totalDays > 0 && data?.logs && data?.habits
    ? Math.min(100, (Object.values(data.logs).reduce((sum, dayLogs) => {
      const completed = Object.values(dayLogs || {}).filter(Boolean).length;
      return sum + (data.habits.length > 0 ? (completed / data.habits.length) * 100 : 0);
    }, 0) / totalDays))
    : 0;

  return (
    <main className="min-h-screen p-4 sm:p-8 max-w-[1600px] mx-auto space-y-8 relative overflow-hidden">
      {/* Header */}
      <div className="space-y-1 relative">
        <h1 className="text-3xl font-bold tracking-tight">Goals & Progress</h1>
        <p className="text-sm text-muted">Track your journey to excellence</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative">
        {/* Current Streak */}
        <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 backdrop-blur-xl border border-orange-500/20 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-orange-600 dark:text-orange-400">Current Streak</span>
          </div>
          <div className="text-4xl font-bold">{currentStreak}</div>
          <div className="text-xs text-muted mt-1">days in a row</div>
        </div>

        {/* Longest Streak */}
        <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-purple-600 dark:text-purple-400">Best Streak</span>
          </div>
          <div className="text-4xl font-bold">{longestStreak}</div>
          <div className="text-xs text-muted mt-1">personal record</div>
        </div>

        {/* Total Completions */}
        <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Total Wins</span>
          </div>
          <div className="text-4xl font-bold">{totalCompletions}</div>
          <div className="text-xs text-muted mt-1">habits completed</div>
        </div>

        {/* Average Rate */}
        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Avg. Rate</span>
          </div>
          <div className="text-4xl font-bold">{Math.round(avgCompletionRate)}%</div>
          <div className="text-xs text-muted mt-1">completion rate</div>
        </div>
      </div>

      {/* Progress Chart */}
      <div className="bg-transparent backdrop-blur-xl border border-border/50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">30-Day Progress</h2>
            <p className="text-sm text-muted mt-1">Daily completion rate over the last month</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {completionData.length > 0 ? Math.round(completionData[completionData.length - 1]?.value || 0) : 0}%
            </div>
            <div className="text-xs text-muted">today</div>
          </div>
        </div>
        <ProgressChart data={completionData} color="#3b82f6" height={200} />
        <div className="flex justify-between text-xs text-muted mt-4">
          <span>{last30Days[0] || 'N/A'}</span>
          <span>Last 30 Days</span>
          <span>{last30Days[last30Days.length - 1] || 'N/A'}</span>
        </div>
      </div>

      {/* Milestones */}
      <Milestones data={data} habits={data.habits} />
    </main>
  );
}
