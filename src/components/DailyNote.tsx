'use client';

import { useState, useEffect } from 'react';
import { saveNoteAction } from '@/app/actions';

export default function DailyNote({ date, initialNote }: { date: string, initialNote: string }) {
    const [note, setNote] = useState(initialNote);
    const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (note !== initialNote) {
                setStatus('saving');
                try {
                    await saveNoteAction(date, note);
                    setStatus('saved');
                    setTimeout(() => setStatus('idle'), 2000);
                } catch (error) {
                    console.error('Failed to save note:', error);
                    setStatus('error');
                }
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, [note, date, initialNote]);

    return (
        <div className="w-full mt-2">
            <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-muted">Daily Note</label>
                <div className="text-xs">
                    {status === 'saving' && <span className="text-muted animate-pulse">Saving...</span>}
                    {status === 'saved' && <span className="text-emerald-500">Saved</span>}
                    {status === 'error' && <span className="text-red-500">Error saving</span>}
                </div>
            </div>
            <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="How was your day? What did you learn?"
                className="w-full h-32 bg-surface border border-border rounded-xl p-4 text-sm resize-none focus:outline-none focus:border-foreground/30 transition-colors"
            />
        </div>
    );
}
