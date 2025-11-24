'use server';

import {
    getData,
    toggleHabit,
    addHabit,
    updateHabit,
    deleteHabit,
    reorderHabits,
    saveNote,
    importData,
    updatePomodoroTime,
    addDailyTask,
    deleteDailyTask,
    toggleDailyTask,
    Data,
    Habit
} from '@/lib/storage';
import { revalidatePath } from 'next/cache';

export async function getHabitData(): Promise<Data> {
    return await getData();
}

export async function toggleHabitAction(date: string, habitId: string) {
    await toggleHabit(date, habitId);
    revalidatePath('/', 'layout');
}

export async function addHabitAction(habit: Habit) {
    await addHabit(habit);
    revalidatePath('/', 'layout');
}

export async function updateHabitAction(habit: Habit) {
    await updateHabit(habit);
    revalidatePath('/', 'layout');
}

export async function deleteHabitAction(habitId: string) {
    await deleteHabit(habitId);
    revalidatePath('/', 'layout');
}

export async function reorderHabitsAction(habits: Habit[]) {
    await reorderHabits(habits);
    revalidatePath('/', 'layout');
}

export async function saveNoteAction(date: string, note: string) {
    await saveNote(date, note);
    revalidatePath('/', 'layout');
}

export async function importDataAction(jsonString: string) {
    try {
        const data = JSON.parse(jsonString);
        await importData(data);
        revalidatePath('/', 'layout');
        return { success: true };
    } catch (error) {
        console.error("Import failed:", error);
        return { success: false, error: "Invalid JSON data" };
    }
}

export async function updatePomodoroTimeAction(minutes: number) {
    await updatePomodoroTime(minutes);
    revalidatePath('/', 'layout');
    return { success: true };
}

// Daily Task Actions
export async function addDailyTaskAction(date: string, label: string) {
    await addDailyTask(date, label);
    revalidatePath('/', 'layout');
}

export async function deleteDailyTaskAction(date: string, taskId: string) {
    await deleteDailyTask(date, taskId);
    revalidatePath('/', 'layout');
}

export async function toggleDailyTaskAction(date: string, taskId: string) {
    await toggleDailyTask(date, taskId);
    revalidatePath('/', 'layout');
}

export async function resetDataAction() {
    const emptyData: Data = {
        habits: [],
        dailyTasks: {},
        logs: {},
        notes: {},
        pomodoro: {}
    };
    await importData(emptyData);
    revalidatePath('/', 'layout');
    return { success: true };
}
