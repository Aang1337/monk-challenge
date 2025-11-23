import fs from 'fs/promises';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'habits.json');

export interface Habit {
    id: string;
    label: string;
    description: string;
}

export interface DailyTask {
    id: string;
    label: string;
    date: string; // ISO date string (YYYY-MM-DD)
}

export interface Data {
    habits: Habit[]; // Permanent recurring habits
    dailyTasks: Record<string, DailyTask[]>; // date -> tasks for that specific day
    logs: Record<string, Record<string, boolean>>; // date -> { habitId/taskId -> completed }
    notes: Record<string, string>; // date -> note content
    pomodoro?: Record<string, number>; // date -> minutes
}

export async function getData(): Promise<Data> {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf-8');
        const parsed = JSON.parse(data);
        // Ensure structure matches new interface
        return {
            habits: parsed.habits || [],
            dailyTasks: parsed.dailyTasks || {},
            logs: parsed.logs || {},
            notes: parsed.notes || {},
            pomodoro: parsed.pomodoro || {}
        };
    } catch (error) {
        console.error("Error reading data file:", error);
        return { habits: [], dailyTasks: {}, logs: {}, notes: {}, pomodoro: {} };
    }
}

export async function saveData(data: Data): Promise<void> {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

export async function toggleHabit(date: string, habitId: string): Promise<Data> {
    const data = await getData();

    if (!data.logs[date]) {
        data.logs[date] = {};
    }

    const currentValue = data.logs[date][habitId] || false;
    data.logs[date][habitId] = !currentValue;

    await saveData(data);
    return data;
}

// Habit Management
export async function addHabit(habit: Habit): Promise<Data> {
    const data = await getData();
    data.habits.push(habit);
    await saveData(data);
    return data;
}

export async function updateHabit(habit: Habit): Promise<Data> {
    const data = await getData();
    const index = data.habits.findIndex(h => h.id === habit.id);
    if (index !== -1) {
        data.habits[index] = habit;
        await saveData(data);
    }
    return data;
}

export async function deleteHabit(habitId: string): Promise<Data> {
    const data = await getData();
    data.habits = data.habits.filter(h => h.id !== habitId);
    await saveData(data);
    return data;
}

export async function reorderHabits(habits: Habit[]): Promise<Data> {
    const data = await getData();
    data.habits = habits;
    await saveData(data);
    return data;
}

// Notes
export async function saveNote(date: string, note: string): Promise<Data> {
    const data = await getData();
    data.notes[date] = note;
    await saveData(data);
    return data;
}

// Pomodoro
export async function updatePomodoroTime(minutes: number): Promise<Data> {
    const data = await getData();
    const today = new Date().toISOString().split('T')[0];

    if (!data.pomodoro) data.pomodoro = {};
    const current = data.pomodoro[today] || 0;
    data.pomodoro[today] = current + minutes;

    await saveData(data);
    return data;
}

// Import/Export
export async function importData(newData: Data): Promise<void> {
    // Basic validation
    if (!Array.isArray(newData.habits) || typeof newData.logs !== 'object') {
        throw new Error("Invalid data format");
    }
    await saveData(newData);
}

// Daily Tasks
export async function addDailyTask(date: string, label: string): Promise<Data> {
    const data = await getData();

    if (!data.dailyTasks[date]) {
        data.dailyTasks[date] = [];
    }

    const newTask: DailyTask = {
        id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        label,
        date
    };

    data.dailyTasks[date].push(newTask);
    await saveData(data);
    return data;
}

export async function deleteDailyTask(date: string, taskId: string): Promise<Data> {
    const data = await getData();

    if (data.dailyTasks[date]) {
        data.dailyTasks[date] = data.dailyTasks[date].filter(t => t.id !== taskId);

        // Clean up empty arrays
        if (data.dailyTasks[date].length === 0) {
            delete data.dailyTasks[date];
        }
    }

    // Also remove from logs
    if (data.logs[date]?.[taskId]) {
        delete data.logs[date][taskId];
    }

    await saveData(data);
    return data;
}

export async function toggleDailyTask(date: string, taskId: string): Promise<Data> {
    const data = await getData();

    if (!data.logs[date]) {
        data.logs[date] = {};
    }

    const currentValue = data.logs[date][taskId] || false;
    data.logs[date][taskId] = !currentValue;

    await saveData(data);
    return data;
}
