'use client';

import { useMemo } from 'react';

interface ProgressChartProps {
    data: { date: string; value: number }[];
    color?: string;
    height?: number;
}

export default function ProgressChart({ data, color = '#3b82f6', height = 200 }: ProgressChartProps) {
    const { points, maxValue } = useMemo(() => {
        if (data.length === 0) return { points: '', maxValue: 0 };

        const max = Math.max(...data.map(d => d.value), 1);
        const width = 100;
        const stepX = width / (data.length - 1 || 1);

        const pointsStr = data.map((d, i) => {
            const x = i * stepX;
            const y = height - (d.value / max) * (height - 20);
            return `${x},${y}`;
        }).join(' ');

        return { points: pointsStr, maxValue: max };
    }, [data, height]);

    if (data.length === 0) {
        return (
            <div className="w-full flex items-center justify-center text-muted text-sm" style={{ height }}>
                No data available
            </div>
        );
    }

    return (
        <svg
            viewBox={`0 0 100 ${height}`}
            className="w-full"
            preserveAspectRatio="none"
            style={{ height }}
        >
            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map((percent) => (
                <line
                    key={percent}
                    x1="0"
                    y1={height - (percent / 100) * (height - 20)}
                    x2="100"
                    y2={height - (percent / 100) * (height - 20)}
                    stroke="currentColor"
                    strokeOpacity="0.1"
                    strokeWidth="0.5"
                />
            ))}

            {/* Area fill */}
            <polygon
                points={`0,${height} ${points} 100,${height}`}
                fill={color}
                fillOpacity="0.1"
            />

            {/* Line */}
            <polyline
                points={points}
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Data points */}
            {data.map((d, i) => {
                const stepX = 100 / (data.length - 1 || 1);
                const x = i * stepX;
                const y = height - (d.value / maxValue) * (height - 20);
                return (
                    <circle
                        key={i}
                        cx={x}
                        cy={y}
                        r="2"
                        fill={color}
                    />
                );
            })}
        </svg>
    );
}
