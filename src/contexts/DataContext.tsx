'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useGoogleDrive } from './GoogleDriveContext';
import {
    Data,
    Habit,
    INITIAL_DATA,
    findFile,
    createFile,
    readFile,
    updateFile
} from '@/lib/drive';

interface DataContextType {
    data: Data;
    isLoading: boolean;
    error: string | null;
    refreshData: () => Promise<void>;

    // Actions
    addHabit: (habit: Habit) => Promise<void>;
    updateHabit: (habit: Habit) => Promise<void>;
    deleteHabit: (habitId: string) => Promise<void>;
    reorderHabits: (habits: Habit[]) => Promise<void>;
    toggleHabit: (date: string, habitId: string) => Promise<void>;
    saveNote: (date: string, note: string) => Promise<void>;
    updatePomodoroTime: (minutes: number) => Promise<void>;
    addDailyTask: (date: string, label: string) => Promise<void>;
    deleteDailyTask: (date: string, taskId: string) => Promise<void>;
    toggleDailyTask: (date: string, taskId: string) => Promise<void>;
    resetData: () => Promise<void>;
}

const DataContext = createContext<DataContextType>({
    data: INITIAL_DATA,
    isLoading: true,
    error: null,
    refreshData: async () => { },
    addHabit: async () => { },
    updateHabit: async () => { },
    deleteHabit: async () => { },
    reorderHabits: async () => { },
    toggleHabit: async () => { },
    saveNote: async () => { },
    updatePomodoroTime: async () => { },
    addDailyTask: async () => { },
    deleteDailyTask: async () => { },
    toggleDailyTask: async () => { },
    resetData: async () => { },
});

export const useData = () => useContext(DataContext);

export function DataProvider({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, gapiInitialized } = useGoogleDrive();
    const [data, setData] = useState<Data>(INITIAL_DATA);
    const [fileId, setFileId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Load data from Drive or localStorage
    const loadData = useCallback(async () => {
        // If not authenticated, use localStorage
        if (!isAuthenticated || !gapiInitialized) {
            try {
                const stored = localStorage.getItem('monk-mode-data');
                if (stored) {
                    setData(JSON.parse(stored));
                } else {
                    setData(INITIAL_DATA);
                }
            } catch (err) {
                console.error("Failed to load from localStorage:", err);
                setData(INITIAL_DATA);
            }
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            let id = await findFile();

            if (!id) {
                console.log("Data file not found, creating new one...");
                id = await createFile(INITIAL_DATA);
            }

            setFileId(id);
            const driveData = await readFile(id);
            setData(driveData);
        } catch (err) {
            console.error("Failed to load data:", err);
            setError("Failed to load data from Google Drive");
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated, gapiInitialized]);

    // Initial load
    useEffect(() => {
        if (isAuthenticated && gapiInitialized) {
            loadData();
        } else {
            // Load from localStorage when not authenticated
            loadData();
        }
    }, [isAuthenticated, gapiInitialized, loadData]);

    // Helper to update state and sync to Drive or localStorage
    const updateData = async (newData: Data) => {
        // Optimistic update
        setData(newData);

        // If not authenticated, save to localStorage
        if (!isAuthenticated || !fileId) {
            try {
                localStorage.setItem('monk-mode-data', JSON.stringify(newData));
            } catch (err) {
                console.error("Failed to save to localStorage:", err);
            }
            return;
        }

        // Otherwise save to Google Drive
        if (fileId) {
            try {
                await updateFile(fileId, newData);
            } catch (err) {
                console.error("Failed to sync to Drive:", err);
                setError("Failed to save changes to Google Drive");
                // Revert? For now we just show error
            }
        }
    };

    // Actions implementation
    const addHabit = async (habit: Habit) => {
        const newData = { ...data, habits: [...data.habits, habit] };
        await updateData(newData);
    };

    const updateHabit = async (habit: Habit) => {
        const newHabits = data.habits.map(h => h.id === habit.id ? habit : h);
        const newData = { ...data, habits: newHabits };
        await updateData(newData);
    };

    const deleteHabit = async (habitId: string) => {
        const newHabits = data.habits.filter(h => h.id !== habitId);
        const newData = { ...data, habits: newHabits };
        await updateData(newData);
    };

    const reorderHabits = async (habits: Habit[]) => {
        const newData = { ...data, habits };
        await updateData(newData);
    };

    const toggleHabit = async (date: string, habitId: string) => {
        const newLogs = { ...data.logs };
        if (!newLogs[date]) newLogs[date] = {};

        newLogs[date] = {
            ...newLogs[date],
            [habitId]: !newLogs[date][habitId]
        };

        const newData = { ...data, logs: newLogs };
        await updateData(newData);
    };

    const saveNote = async (date: string, note: string) => {
        const newNotes = { ...data.notes, [date]: note };
        const newData = { ...data, notes: newNotes };
        await updateData(newData);
    };

    const updatePomodoroTime = async (minutes: number) => {
        const today = new Date().toISOString().split('T')[0];
        const newPomodoro = { ...data.pomodoro };
        const current = newPomodoro[today] || 0;
        newPomodoro[today] = current + minutes;

        const newData = { ...data, pomodoro: newPomodoro };
        await updateData(newData);
    };

    const addDailyTask = async (date: string, label: string) => {
        const newTasks = { ...data.dailyTasks };
        if (!newTasks[date]) newTasks[date] = [];

        const task = {
            id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            label,
            date
        };

        newTasks[date] = [...newTasks[date], task];
        const newData = { ...data, dailyTasks: newTasks };
        await updateData(newData);
    };

    const deleteDailyTask = async (date: string, taskId: string) => {
        const newTasks = { ...data.dailyTasks };
        if (newTasks[date]) {
            newTasks[date] = newTasks[date].filter(t => t.id !== taskId);
            if (newTasks[date].length === 0) delete newTasks[date];
        }

        // Also remove from logs
        const newLogs = { ...data.logs };
        if (newLogs[date] && newLogs[date][taskId] !== undefined) {
            const dayLogs = { ...newLogs[date] };
            delete dayLogs[taskId];
            newLogs[date] = dayLogs;
        }

        const newData = { ...data, dailyTasks: newTasks, logs: newLogs };
        await updateData(newData);
    };

    const toggleDailyTask = async (date: string, taskId: string) => {
        const newLogs = { ...data.logs };
        if (!newLogs[date]) newLogs[date] = {};

        newLogs[date] = {
            ...newLogs[date],
            [taskId]: !newLogs[date][taskId]
        };

        const newData = { ...data, logs: newLogs };
        await updateData(newData);
    };

    const resetData = async () => {
        await updateData(INITIAL_DATA);
    };

    return (
        <DataContext.Provider value={{
            data,
            isLoading,
            error,
            refreshData: loadData,
            addHabit,
            updateHabit,
            deleteHabit,
            reorderHabits,
            toggleHabit,
            saveNote,
            updatePomodoroTime,
            addDailyTask,
            deleteDailyTask,
            toggleDailyTask,
            resetData
        }}>
            {children}
        </DataContext.Provider>
    );
}
