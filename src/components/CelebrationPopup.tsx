'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';

interface CelebrationPopupProps {
    isOpen: boolean;
    onClose: () => void;
    gifUrl: string;
    quote: string;
    title?: string;
}

export default function CelebrationPopup({
    isOpen,
    onClose,
    gifUrl,
    quote,
    title = "🎉 Congratulations! 🎉"
}: CelebrationPopupProps) {

    // Close on Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            // Prevent body scroll when modal is open
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0, y: 50 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.5, opacity: 0, y: 50 }}
                            transition={{ type: "spring", duration: 0.5 }}
                            className="relative w-full max-w-lg pointer-events-auto"
                        >
                            {/* Glassmorphism Card */}
                            <div className="relative bg-surface/90 backdrop-blur-xl border border-border rounded-2xl shadow-2xl overflow-hidden">

                                {/* Gradient Background */}
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-50" />

                                {/* Close Button */}
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 z-20 p-2 rounded-full bg-surface-hover/80 hover:bg-surface-hover border border-border transition-colors"
                                    aria-label="Close"
                                >
                                    <X size={20} className="text-foreground" />
                                </button>

                                {/* Content */}
                                <div className="relative z-10 p-8 space-y-6">

                                    {/* Title with Sparkles */}
                                    <div className="flex items-center justify-center gap-2">
                                        <Sparkles className="text-yellow-400 animate-pulse" size={24} />
                                        <h2 className="text-2xl font-bold text-center text-foreground">
                                            {title}
                                        </h2>
                                        <Sparkles className="text-yellow-400 animate-pulse" size={24} />
                                    </div>

                                    {/* GIF Container */}
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 0.2, type: "spring" }}
                                        className="relative w-full aspect-video rounded-xl overflow-hidden border-2 border-foreground/20"
                                    >
                                        <img
                                            src={gifUrl}
                                            alt="Celebration"
                                            className="w-full h-full object-cover"
                                        />
                                    </motion.div>

                                    {/* Quote */}
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.4 }}
                                        className="text-center"
                                    >
                                        <p className="text-lg font-medium text-foreground leading-relaxed">
                                            "{quote}"
                                        </p>
                                    </motion.div>

                                    {/* Continue Button */}
                                    <motion.button
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.6 }}
                                        onClick={onClose}
                                        className="w-full py-3 px-6 bg-foreground text-background font-semibold rounded-xl hover:opacity-90 transition-opacity"
                                    >
                                        Continue Your Journey
                                    </motion.button>
                                </div>

                                {/* Decorative Elements */}
                                <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-3xl" />
                                <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-purple-500/20 to-transparent rounded-full blur-3xl" />
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
