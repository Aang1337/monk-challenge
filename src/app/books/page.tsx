'use client';

import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Book } from '@/lib/drive';
import BookList from '@/components/BookList';
import StatsCard from '@/components/StatsCard';
import ReadingProgressGrid from '@/components/ReadingProgressGrid';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X } from 'lucide-react';

export default function BooksPage() {
    const { data, addBook, updateBook, deleteBook, reorderBooks } = useData();
    const [isAdding, setIsAdding] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newAuthor, setNewAuthor] = useState('');
    const [newCover, setNewCover] = useState('');

    const books = data.books || [];

    const readingBooks = books.filter(b => b.status === 'reading');
    const toReadBooks = books.filter(b => b.status === 'to-read');
    const finishedBooks = books.filter(b => b.status === 'finished');

    // Sort finished books by finishedAt (descending) if available, or addedAt
    finishedBooks.sort((a, b) => {
        const dateA = a.finishedAt || a.addedAt;
        const dateB = b.finishedAt || b.addedAt;
        return new Date(dateB).getTime() - new Date(dateA).getTime();
    });

    const handleAddBook = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTitle.trim()) return;

        const newBook: Book = {
            id: crypto.randomUUID(),
            title: newTitle,
            author: newAuthor,
            coverUrl: newCover,
            status: 'to-read',
            order: toReadBooks.length,
            addedAt: new Date().toISOString()
        };

        await addBook(newBook);
        setNewTitle('');
        setNewAuthor('');
        setNewCover('');
        setIsAdding(false);
    };

    const handleMove = async (book: Book, newStatus: Book['status']) => {
        const updatedBook: Book = {
            ...book,
            status: newStatus,
            finishedAt: newStatus === 'finished' ? new Date().toISOString() : undefined,
            startedAt: newStatus === 'reading' && !book.startedAt
                ? new Date().toISOString()
                : newStatus === 'to-read'
                    ? undefined
                    : book.startedAt
        };
        await updateBook(updatedBook);
    };

    const handleReorderToRead = async (reorderedBooks: Book[]) => {
        const otherBooks = books.filter(b => b.status !== 'to-read');

        // Update order property
        const updatedToRead = reorderedBooks.map((b, index) => ({
            ...b,
            order: index
        }));

        const allBooks = [...otherBooks, ...updatedToRead];
        await reorderBooks(allBooks);
    };

    // Calculate stats
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);

    const booksReadThisWeek = finishedBooks.filter(b => {
        if (!b.finishedAt) return false;
        return new Date(b.finishedAt) >= oneWeekAgo;
    }).length;

    const booksReadThisMonth = finishedBooks.filter(b => {
        if (!b.finishedAt) return false;
        return new Date(b.finishedAt) >= oneMonthAgo;
    }).length;

    const booksReadThisYear = finishedBooks.filter(b => {
        if (!b.finishedAt) return false;
        return new Date(b.finishedAt) >= oneYearAgo;
    }).length;


    return (
        <div className="max-w-[1600px] mx-auto p-6 space-y-8 pb-24">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start justify-between gap-8">
                <div className="space-y-2">
                    <h1 className="text-4xl font-bold tracking-tight">Library</h1>
                    <p className="text-muted text-lg">Track your reading journey</p>
                </div>

                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="flex items-center justify-center gap-2 bg-foreground text-background px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity font-medium"
                >
                    {isAdding ? <X size={20} /> : <Plus size={20} />}
                    <span>{isAdding ? 'Cancel' : 'Add Book'}</span>
                </button>
            </div>

            {/* Add Book Form */}
            <AnimatePresence>
                {isAdding && (
                    <motion.form
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        onSubmit={handleAddBook}
                        className="overflow-hidden"
                    >
                        <div className="bg-surface border border-border rounded-xl p-6 space-y-4 mb-8">
                            <h3 className="font-semibold">Add New Book</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <input
                                    type="text"
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)}
                                    placeholder="Book Title *"
                                    className="bg-background border border-border rounded-lg px-4 py-2 focus:outline-none focus:border-foreground/50"
                                    required
                                />
                                <input
                                    type="text"
                                    value={newAuthor}
                                    onChange={(e) => setNewAuthor(e.target.value)}
                                    placeholder="Author"
                                    className="bg-background border border-border rounded-lg px-4 py-2 focus:outline-none focus:border-foreground/50"
                                />
                                <input
                                    type="text"
                                    value={newCover}
                                    onChange={(e) => setNewCover(e.target.value)}
                                    placeholder="Cover Image URL"
                                    className="bg-background border border-border rounded-lg px-4 py-2 focus:outline-none focus:border-foreground/50"
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="bg-foreground text-background px-6 py-2 rounded-lg hover:opacity-90 transition-opacity"
                                >
                                    Add to Library
                                </button>
                            </div>
                        </div>
                    </motion.form>
                )}
            </AnimatePresence>

            {/* Main Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Column (Wide) */}
                <div className="lg:col-span-8 space-y-12">
                    {/* Currently Reading */}
                    <section>
                        <BookList
                            title="Currently Reading"
                            books={readingBooks}
                            onUpdate={updateBook}
                            onDelete={deleteBook}
                            onMove={handleMove}
                            emptyMessage="Not reading anything right now"
                        />
                    </section>

                    {/* Want to Read */}
                    <section>
                        <BookList
                            title="Want to Read"
                            books={toReadBooks}
                            onUpdate={updateBook}
                            onDelete={deleteBook}
                            onMove={handleMove}
                            onReorder={handleReorderToRead}
                            emptyMessage="Your reading list is empty"
                        />
                    </section>
                </div>

                {/* Right Column (Narrow) */}
                <div className="lg:col-span-4 space-y-8 sticky top-6">
                    {/* Stats Card */}
                    <StatsCard
                        weekCount={booksReadThisWeek}
                        monthCount={booksReadThisMonth}
                        yearCount={booksReadThisYear}
                    />
                </div>
            </div>

            {/* Reading Progress Grid */}
            <section className="mt-16">
                <ReadingProgressGrid finishedBooks={finishedBooks} />
            </section>
        </div>
    );
}
