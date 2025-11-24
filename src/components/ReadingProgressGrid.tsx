'use client';

import { Book } from '@/lib/drive';
import { motion } from 'framer-motion';

interface ReadingProgressGridProps {
    finishedBooks: Book[];
}

export default function ReadingProgressGrid({ finishedBooks }: ReadingProgressGridProps) {
    // Sort finished books by finishedAt date (oldest first)
    const sortedBooks = [...finishedBooks].sort((a, b) => {
        const dateA = a.finishedAt || a.addedAt;
        const dateB = b.finishedAt || b.addedAt;
        return new Date(dateA).getTime() - new Date(dateB).getTime();
    });

    // Take only the first 100 books
    const displayBooks = sortedBooks.slice(0, 100);

    // Create array of 100 slots
    const slots = Array.from({ length: 100 }, (_, index) => {
        return displayBooks[index] || null;
    });

    return (
        <div className="w-full">
            <div className="mb-8">
                <h2 className="text-3xl font-bold tracking-tight mb-3">Reading Journey</h2>
                <div className="flex items-center gap-4">
                    <p className="text-muted text-base">
                        {displayBooks.length} / 100 books completed
                    </p>
                    <div className="flex-1 h-2 bg-surface rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                            style={{ width: `${(displayBooks.length / 100) * 100}%` }}
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-8 md:grid-cols-12 lg:grid-cols-16 xl:grid-cols-20 gap-3 md:gap-4">
                {slots.map((book, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.005, duration: 0.3 }}
                        className="aspect-square relative group cursor-pointer"
                    >
                        {book ? (
                            <div className="w-full h-full rounded-lg overflow-hidden border-2 border-border/50 bg-background relative transition-all duration-300 group-hover:border-blue-500/50 group-hover:shadow-lg group-hover:shadow-blue-500/20">
                                {book.coverUrl ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={book.coverUrl}
                                        alt={book.title}
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-xl bg-surface transition-transform duration-300 group-hover:scale-110">
                                        📚
                                    </div>
                                )}
                                {/* Enhanced tooltip on hover */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end p-2">
                                    <p className="text-white text-[10px] md:text-xs font-semibold text-center leading-tight line-clamp-2">
                                        {book.title}
                                    </p>
                                    {book.author && (
                                        <p className="text-white/70 text-[8px] md:text-[10px] text-center mt-0.5">
                                            {book.author}
                                        </p>
                                    )}
                                </div>
                                {/* Book number badge */}
                                <div className="absolute top-1 right-1 bg-black/70 text-white text-[8px] md:text-[10px] px-1.5 py-0.5 rounded-full font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                    #{index + 1}
                                </div>
                            </div>
                        ) : (
                            <div className="w-full h-full rounded-lg border-2 border-dashed border-border/30 bg-surface/20 hover:bg-surface/40 hover:border-border/50 transition-all duration-300 flex items-center justify-center">
                                <span className="text-muted/30 text-xs md:text-sm font-bold">{index + 1}</span>
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
