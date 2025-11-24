'use client';

import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

interface StatsCardProps {
    weekCount: number;
    monthCount: number;
    yearCount: number;
}

export default function StatsCard({ weekCount, monthCount, yearCount }: StatsCardProps) {
    const stats = [
        {
            label: 'Last 7 Days',
            count: weekCount,
            color: 'emerald',
            gradient: 'from-emerald-500 to-teal-500',
            bgColor: 'bg-emerald-500/10',
            textColor: 'text-emerald-500',
            borderColor: 'border-emerald-500/20'
        },
        {
            label: 'Last 30 Days',
            count: monthCount,
            color: 'amber',
            gradient: 'from-amber-500 to-orange-500',
            bgColor: 'bg-amber-500/10',
            textColor: 'text-amber-500',
            borderColor: 'border-amber-500/20'
        },
        {
            label: 'Last Year',
            count: yearCount,
            color: 'rose',
            gradient: 'from-rose-500 to-pink-500',
            bgColor: 'bg-rose-500/10',
            textColor: 'text-rose-500',
            borderColor: 'border-rose-500/20'
        }
    ];

    return (
        <div className="bg-gradient-to-br from-[#0a0a0a] to-[#111] border border-white/10 rounded-2xl p-5 w-full shadow-2xl shadow-black/50">
            <div className="flex items-center gap-3 mb-5 pb-3 border-b border-white/5">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl text-white shadow-lg shadow-blue-500/20">
                    <TrendingUp size={18} strokeWidth={2.5} />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-white leading-none">Reading History</h3>
                    <p className="text-xs text-zinc-400 mt-1">Consistency over time</p>
                </div>
            </div>

            <div className="space-y-3">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`relative overflow-hidden rounded-xl border ${stat.borderColor} bg-gradient-to-br from-[#0d0d0d] to-[#151515] p-3 group hover:border-opacity-50 transition-all duration-300 hover:shadow-lg hover:shadow-${stat.color}-500/10`}
                    >
                        {/* Background gradient on hover */}
                        <div className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                        <div className="relative flex items-center justify-between">
                            <div className="flex-1">
                                <p className="text-xs font-medium text-zinc-400 mb-1.5">{stat.label}</p>
                                <div className="flex items-baseline gap-2">
                                    <span className={`text-2xl font-bold ${stat.textColor}`}>
                                        {stat.count}
                                    </span>
                                    <span className="text-xs text-zinc-500 font-medium">books</span>
                                </div>
                            </div>

                            {/* Decorative circle */}
                            <div className={`w-12 h-12 rounded-full ${stat.bgColor} flex items-center justify-center opacity-50 group-hover:opacity-100 transition-opacity`}>
                                <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${stat.gradient} opacity-60`} />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
