'use client';

import { Book } from '@/lib/drive';
import BookCard from './BookCard';
import { AnimatePresence, motion } from 'framer-motion';

interface BookListProps {
    title: string;
    books: Book[];
    onUpdate: (book: Book) => void;
    onDelete: (bookId: string) => void;
    onMove: (book: Book, newStatus: Book['status']) => void;
    onReorder?: (books: Book[]) => void;
    emptyMessage?: string;
}

export default function BookList({
    title,
    books,
    onUpdate,
    onDelete,
    onMove,
    onReorder,
    emptyMessage = "No books in this list"
}: BookListProps) {

    const handleMoveUp = (index: number) => {
        if (!onReorder || index === 0) return;
        const newBooks = [...books];
        [newBooks[index - 1], newBooks[index]] = [newBooks[index], newBooks[index - 1]];
        onReorder(newBooks);
    };

    const handleMoveDown = (index: number) => {
        if (!onReorder || index === books.length - 1) return;
        const newBooks = [...books];
        [newBooks[index + 1], newBooks[index]] = [newBooks[index], newBooks[index + 1]];
        onReorder(newBooks);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">{title}</h2>
                <span className="text-sm text-muted bg-surface-hover px-2 py-1 rounded-md">
                    {books.length}
                </span>
            </div>

            <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                    {books.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="p-8 text-center border border-dashed border-border rounded-xl text-muted text-sm"
                        >
                            {emptyMessage}
                        </motion.div>
                    ) : (
                        books.map((book, index) => (
                            <BookCard
                                key={book.id}
                                book={book}
                                onUpdate={onUpdate}
                                onDelete={onDelete}
                                onMove={onMove}
                                showMoveUp={!!onReorder && index > 0}
                                showMoveDown={!!onReorder && index < books.length - 1}
                                onMoveUp={() => handleMoveUp(index)}
                                onMoveDown={() => handleMoveDown(index)}
                            />
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
