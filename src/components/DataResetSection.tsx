'use client';

import { useState, useEffect } from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';
import { resetDataAction } from '@/app/actions';

export default function DataResetSection() {
    const [showModal, setShowModal] = useState(false);
    const [countdown, setCountdown] = useState(120);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (showModal && countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [showModal, countdown]);

    const handleReset = async () => {
        setIsDeleting(true);
        await resetDataAction();
        setIsDeleting(false);
        setShowModal(false);
        setCountdown(120);
        // Optional: Force reload to clear any client state
        window.location.reload();
    };

    const openModal = () => {
        setShowModal(true);
        setCountdown(120);
    };

    return (
        <>
            <div className="bg-red-500/5 backdrop-blur-xl border border-red-500/20 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                        <Trash2 className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-red-500">Danger Zone</h2>
                        <p className="text-xs text-muted">Irreversible actions</p>
                    </div>
                </div>

                <button
                    onClick={openModal}
                    className="w-full py-3 px-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                    <Trash2 size={18} />
                    Reset All Data
                </button>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-surface border border-red-500/30 rounded-2xl max-w-md w-full p-6 relative animate-in fade-in zoom-in duration-200">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-4 right-4 text-muted hover:text-foreground"
                        >
                            <X size={20} />
                        </button>

                        <div className="flex flex-col items-center text-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-2">
                                <AlertTriangle className="w-8 h-8 text-red-500" />
                            </div>

                            <h3 className="text-2xl font-bold text-foreground">Are you sure?</h3>

                            <p className="text-muted-foreground">
                                This action will <span className="text-red-500 font-bold">permanently delete</span> all your habits, logs, and notes. This cannot be undone.
                            </p>

                            <div className="w-full bg-surface-hover rounded-lg p-4 border border-border">
                                <p className="text-sm font-mono text-muted">
                                    Please wait <span className="text-foreground font-bold">{countdown}s</span> to confirm.
                                </p>
                            </div>

                            <div className="flex gap-3 w-full mt-2">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 py-3 px-4 bg-surface-hover hover:bg-surface-active rounded-xl font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleReset}
                                    disabled={countdown > 0 || isDeleting}
                                    className="flex-1 py-3 px-4 bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                                >
                                    {isDeleting ? 'Resetting...' : 'Confirm Reset'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
