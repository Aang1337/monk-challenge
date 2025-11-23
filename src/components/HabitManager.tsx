'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, X, Check, Trash2, GripVertical } from 'lucide-react';
import { addHabitAction, updateHabitAction, deleteHabitAction, reorderHabitsAction } from '@/app/actions';
import { Habit } from '@/lib/storage';
import clsx from 'clsx';

export default function HabitManager({ habits }: { habits: Habit[] }) {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({ label: '', description: '' });
    const [showForm, setShowForm] = useState(false);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    const resetForm = () => {
        setFormData({ label: '', description: '' });
        setEditingId(null);
        setShowForm(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.label) return;

        if (editingId) {
            await updateHabitAction({ id: editingId, ...formData });
        } else {
            await addHabitAction({
                id: formData.label.toLowerCase().replace(/\s+/g, '-'),
                ...formData
            });
        }
        resetForm();
    };

    const startEdit = (habit: Habit) => {
        setFormData({ label: habit.label, description: habit.description });
        setEditingId(habit.id);
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Delete this habit? This action cannot be undone.')) {
            await deleteHabitAction(id);
        }
    };

    const handleDragStart = (index: number) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;

        const newHabits = [...habits];
        const draggedHabit = newHabits[draggedIndex];
        newHabits.splice(draggedIndex, 1);
        newHabits.splice(index, 0, draggedHabit);

        setDraggedIndex(index);
        reorderHabitsAction(newHabits);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
    };

    return (
        <div className="space-y-4">
            {/* Add New Habit Button */}
            {!showForm && (
                <button
                    onClick={() => setShowForm(true)}
                    className="w-full flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-border hover:border-foreground/50 hover:bg-surface-hover transition-all text-muted hover:text-foreground group"
                >
                    <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                    <span className="font-medium">Add New Habit</span>
                </button>
            )}

            {/* Form */}
            <AnimatePresence>
                {showForm && (
                    <motion.form
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        onSubmit={handleSubmit}
                        className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-xl p-6 space-y-4"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-blue-600 dark:text-blue-400">
                                {editingId ? 'Edit Habit' : 'New Habit'}
                            </h3>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="p-1 hover:bg-surface-hover rounded-lg transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium mb-2">Habit Name *</label>
                                <input
                                    type="text"
                                    value={formData.label}
                                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                                    placeholder="e.g., Morning Exercise"
                                    className="w-full bg-background border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                    required
                                    autoFocus
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Description (optional)</label>
                                <input
                                    type="text"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="e.g., 30 minutes cardio"
                                    className="w-full bg-background border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                />
                            </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                            <button
                                type="submit"
                                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors"
                            >
                                <Check size={18} />
                                {editingId ? 'Update' : 'Create'}
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-4 py-2.5 bg-surface hover:bg-surface-hover border border-border rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </motion.form>
                )}
            </AnimatePresence>

            {/* Habits List */}
            <div className="space-y-3">
                <AnimatePresence>
                    {habits.map((habit, index) => (
                        <motion.div
                            key={habit.id}
                            layout
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            draggable
                            onDragStart={() => handleDragStart(index)}
                            onDragOver={(e) => handleDragOver(e, index)}
                            onDragEnd={handleDragEnd}
                            className={clsx(
                                "group bg-surface hover:bg-surface-hover border border-border rounded-xl p-4 transition-all cursor-move",
                                draggedIndex === index && "opacity-50"
                            )}
                        >
                            <div className="flex items-start gap-3">
                                {/* Drag Handle */}
                                <div className="flex-shrink-0 pt-1 text-muted opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
                                    <GripVertical size={18} />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-foreground truncate">{habit.label}</h4>
                                    {habit.description && (
                                        <p className="text-sm text-muted mt-1 truncate">{habit.description}</p>
                                    )}
                                </div>

                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => startEdit(habit)}
                                        className="p-2 hover:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg transition-colors"
                                        title="Edit habit"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(habit.id)}
                                        className="p-2 hover:bg-red-500/10 text-red-600 dark:text-red-400 rounded-lg transition-colors"
                                        title="Delete habit"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {habits.length === 0 && !showForm && (
                    <div className="text-center py-12 text-muted">
                        <p className="text-sm">No habits yet. Create your first habit to get started!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
