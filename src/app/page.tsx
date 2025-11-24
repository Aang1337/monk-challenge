'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getRandomQuote } from '@/lib/monkQuotes';

export default function Home() {
  const [quote, setQuote] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize with random quote on mount
  useEffect(() => {
    setQuote(getRandomQuote());
    setIsLoaded(true);
  }, []);

  // Change quote every 8-10 seconds (random interval)
  useEffect(() => {
    const getRandomInterval = () => Math.floor(Math.random() * 3000) + 8000; // 8-11 seconds

    const changeQuote = () => {
      setQuote(getRandomQuote());
    };

    const intervalId = setInterval(changeQuote, getRandomInterval());

    return () => clearInterval(intervalId);
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="max-w-4xl w-full space-y-12 relative z-10">
        {/* Main Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-4"
        >
          <h1 className="text-5xl md:text-6xl font-bold tracking-tighter bg-gradient-to-r from-foreground via-foreground/80 to-foreground bg-clip-text">
            MONK MODE
          </h1>
          <p className="text-lg md:text-xl text-muted font-light">Discipline is freedom.</p>
        </motion.div>

        {/* Rotating Quote */}
        <div className="min-h-[120px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            {isLoaded && (
              <motion.div
                key={quote}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
                className="max-w-3xl"
              >
                <div className="relative">
                  {/* Quote Marks */}
                  <div className="absolute -top-4 -left-4 text-6xl text-muted/20 font-serif">"</div>
                  <p className="text-2xl md:text-3xl font-light text-foreground/90 leading-relaxed px-8">
                    {quote}
                  </p>
                  <div className="absolute -bottom-4 -right-4 text-6xl text-muted/20 font-serif">"</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="pt-8"
        >
          <p className="text-sm text-muted mb-6">
            Use the sidebar to navigate between different sections
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="p-4 bg-transparent backdrop-blur-xl border border-border/50 rounded-xl hover:border-foreground/20 transition-all cursor-pointer group"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">📅</div>
              <h3 className="font-semibold mb-1">Calendar</h3>
              <p className="text-xs text-muted">Track daily habits</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="p-4 bg-transparent backdrop-blur-xl border border-border/50 rounded-xl hover:border-foreground/20 transition-all cursor-pointer group"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">⏱️</div>
              <h3 className="font-semibold mb-1">Pomodoro</h3>
              <p className="text-xs text-muted">Focus sessions</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="p-4 bg-transparent backdrop-blur-xl border border-border/50 rounded-xl hover:border-foreground/20 transition-all cursor-pointer group"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">🎯</div>
              <h3 className="font-semibold mb-1">Goals</h3>
              <p className="text-xs text-muted">Track progress</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="p-4 bg-transparent backdrop-blur-xl border border-border/50 rounded-xl hover:border-foreground/20 transition-all cursor-pointer group"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">📚</div>
              <h3 className="font-semibold mb-1">Books</h3>
              <p className="text-xs text-muted">Track reading</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="p-4 bg-transparent backdrop-blur-xl border border-border/50 rounded-xl hover:border-foreground/20 transition-all cursor-pointer group"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">⚙️</div>
              <h3 className="font-semibold mb-1">Settings</h3>
              <p className="text-xs text-muted">Manage data</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Subtle Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="pt-4"
        >
          <p className="text-xs text-muted/60">Quote changes every 8-10 seconds</p>
        </motion.div>
      </div>
    </main>
  );
}
