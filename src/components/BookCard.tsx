'use client';

import { Book } from '@/lib/drive';
import { motion } from 'framer-motion';
import { Trash2, Edit2, ArrowRight, ArrowLeft, GripVertical } from 'lucide-react';
import { useState } from 'react';

interface BookCardProps {
    book: Book;
    onUpdate: (book: Book) => void;
    onDelete: (bookId: string) => void;
    onMove: (book: Book, newStatus: Book['status']) => void;
    showMoveUp?: boolean;
    showMoveDown?: boolean;
    onMoveUp?: () => void;
    onMoveDown?: () => void;
}

export default function BookCard({
    book,
    onUpdate,
    onDelete,
    onMove,
    showMoveUp,
    showMoveDown,
    onMoveUp,
    onMoveDown
}: BookCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(book.title);
    const [editAuthor, setEditAuthor] = useState(book.author || '');
    const [editCover, setEditCover] = useState(book.coverUrl || '');

    const handleSave = () => {
        onUpdate({
            ...book,
            title: editTitle,
            author: editAuthor,
            coverUrl: editCover
        });
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-surface border border-border rounded-xl p-4 space-y-3"
            >
                <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="Book Title"
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-foreground/50"
                    autoFocus
                />
                <input
                    type="text"
                    value={editAuthor}
                    onChange={(e) => setEditAuthor(e.target.value)}
                    placeholder="Author (optional)"
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-foreground/50"
                />
                <input
                    type="text"
                    value={editCover}
                    onChange={(e) => setEditCover(e.target.value)}
                    placeholder="Cover Image URL (optional)"
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-foreground/50"
                />
                <div className="flex justify-end gap-2">
                    <button
                        onClick={() => setIsEditing(false)}
                        className="px-3 py-1 text-xs text-muted hover:text-foreground transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-3 py-1 text-xs bg-foreground text-background rounded-lg hover:opacity-90 transition-opacity"
                    >
                        Save
                    </button>
                </div>
            </motion.div>
        );
    }

    const getDuration = () => {
        if (book.status === 'reading' && book.startedAt) {
            const start = new Date(book.startedAt);
            return `Started ${start.toLocaleDateString()}`;
        }
        if (book.status === 'finished' && book.startedAt && book.finishedAt) {
            const start = new Date(book.startedAt);
            const end = new Date(book.finishedAt);
            const diffTime = Math.abs(end.getTime() - start.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return `Read in ${diffDays} ${diffDays === 1 ? 'day' : 'days'}`;
        }
        return null;
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="group relative bg-surface border border-border rounded-lg overflow-hidden hover:border-foreground/20 transition-all"
        >
            <div className="flex gap-3 p-3">
                {/* Cover Image */}
                <div className="w-12 h-16 flex-shrink-0 bg-background rounded overflow-hidden border border-border/50">
                    {book.coverUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-lg">
                            📚
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div>
                        <h3 className="font-medium text-sm text-foreground truncate" title={book.title}>
                            {book.title}
                        </h3>
                        {book.author && (
                            <p className="text-xs text-muted truncate">{book.author}</p>
                        )}
                        {getDuration() && (
                            <p className="text-[10px] text-muted mt-0.5 flex items-center gap-1">
                                <span>⏱️</span>
                                {getDuration()}
                            </p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={() => setIsEditing(true)}
                            className="p-1 text-muted hover:text-foreground hover:bg-surface-hover rounded transition-colors"
                            title="Edit"
                        >
                            <Edit2 size={12} />
                        </button>
                        <button
                            onClick={() => onDelete(book.id)}
                            className="p-1 text-muted hover:text-red-500 hover:bg-surface-hover rounded transition-colors"
                            title="Delete"
                        >
                            <Trash2 size={12} />
                        </button>
                    </div>
                </div>

                {/* Status Movers */}
                <div className="flex flex-col justify-center items-end pl-2 border-l border-border/50">
                    {book.status === 'reading' && (
                        <button
                            onClick={() => onMove(book, 'finished')}
                            className="p-1 text-muted hover:text-green-500 hover:bg-surface-hover rounded transition-colors"
                            title="Mark as Finished"
                        >
                            <ArrowRight size={14} />
                        </button>
                    )}
                    {book.status === 'to-read' && (
                        <button
                            onClick={() => onMove(book, 'reading')}
                            className="p-1 text-muted hover:text-blue-500 hover:bg-surface-hover rounded transition-colors"
                            title="Start Reading"
                        >
                            <ArrowRight size={14} />
                        </button>
                    )}
                    {book.status === 'finished' && (
                        <button
                            onClick={() => onMove(book, 'reading')}
                            className="p-1 text-muted hover:text-blue-500 hover:bg-surface-hover rounded transition-colors"
                            title="Read Again"
                        >
                            <ArrowLeft size={14} />
                        </button>
                    )}

                    {/* Reordering Controls for To-Read */}
                    {book.status === 'to-read' && (
                        <div className="flex flex-col gap-0.5 mt-auto">
                            {showMoveUp && (
                                <button
                                    onClick={onMoveUp}
                                    className="p-0.5 text-[10px] text-muted hover:text-foreground hover:bg-surface-hover rounded transition-colors"
                                    title="Move Up"
                                >
                                    ▲
                                </button>
                            )}
                            {showMoveDown && (
                                <button
                                    onClick={onMoveDown}
                                    className="p-0.5 text-[10px] text-muted hover:text-foreground hover:bg-surface-hover rounded transition-colors"
                                    title="Move Down"
                                >
                                    ▼
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
