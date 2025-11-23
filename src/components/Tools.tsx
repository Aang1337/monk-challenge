'use client';

import { useRef } from 'react';
import { Download, Upload, Bell, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { importDataAction } from '@/app/actions';
import { Data } from '@/lib/storage';

export default function Tools({ data }: { data: Data }) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { theme, setTheme } = useTheme();

    // Backup Logic
    const handleExport = () => {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `monk-mode-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const text = await file.text();
        const result = await importDataAction(text);
        if (result.success) {
            alert('Data imported successfully!');
        } else {
            alert('Failed to import data. Invalid format.');
        }
    };

    // Reminder Logic
    const requestNotification = () => {
        if (!('Notification' in window)) {
            alert('This browser does not support notifications.');
            return;
        }
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                new Notification('Monk Mode', { body: 'Reminder set! Stay focused.' });
            }
        });
    };

    return (
        <div className="w-full">
            <div className="grid grid-cols-1 gap-4">
                {/* Data Management */}
                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={handleExport}
                        className="bg-surface border border-border p-4 rounded-xl flex flex-col items-center gap-2 hover:bg-surface-hover transition-colors"
                    >
                        <Download size={20} />
                        <span className="text-xs font-medium">Backup Data</span>
                    </button>
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-surface border border-border p-4 rounded-xl flex flex-col items-center gap-2 hover:bg-surface-hover transition-colors"
                    >
                        <Upload size={20} />
                        <span className="text-xs font-medium">Restore Data</span>
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImport}
                        accept=".json"
                        className="hidden"
                    />
                </div>

                {/* Reminder & Theme */}
                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={requestNotification}
                        className="bg-surface border border-border p-4 rounded-xl flex flex-col items-center gap-2 hover:bg-surface-hover transition-colors"
                    >
                        <Bell size={20} />
                        <span className="text-xs font-medium">Reminders</span>
                    </button>
                    <button
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className="bg-surface border border-border p-4 rounded-xl flex flex-col items-center gap-2 hover:bg-surface-hover transition-colors"
                    >
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        <span className="text-xs font-medium">Theme</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
