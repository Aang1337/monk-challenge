
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

export const INITIAL_DATA: Data = {
    habits: [],
    dailyTasks: {},
    logs: {},
    notes: {},
    pomodoro: {}
};

const FILE_NAME = 'monk-mode-data.json';

// Helper to get the GAPI client safely
const getDriveClient = () => {
    // @ts-ignore
    return window.gapi.client.drive;
};

export async function findFile(): Promise<string | null> {
    try {
        const response = await getDriveClient().files.list({
            q: `name = '${FILE_NAME}' and trashed = false`,
            fields: 'files(id, name)',
            spaces: 'drive'
        });

        const files = response.result.files;
        if (files && files.length > 0) {
            return files[0].id;
        }
        return null;
    } catch (error) {
        console.error("Error finding file:", error);
        return null;
    }
}

export async function createFile(initialData: Data = INITIAL_DATA): Promise<string> {
    try {
        const fileContent = JSON.stringify(initialData);
        const file = new Blob([fileContent], { type: 'application/json' });
        const metadata = {
            name: FILE_NAME,
            mimeType: 'application/json',
        };

        const accessToken = window.gapi.client.getToken().access_token;
        const form = new FormData();
        form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
        form.append('file', file);

        const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: form,
        });

        const result = await response.json();
        return result.id;
    } catch (error) {
        console.error("Error creating file:", error);
        throw error;
    }
}

export async function readFile(fileId: string): Promise<Data> {
    try {
        const response = await getDriveClient().files.get({
            fileId: fileId,
            alt: 'media',
        });

        return response.result as Data;
    } catch (error) {
        console.error("Error reading file:", error);
        throw error;
    }
}

export async function updateFile(fileId: string, data: Data): Promise<void> {
    try {
        const fileContent = JSON.stringify(data);
        const file = new Blob([fileContent], { type: 'application/json' });

        const accessToken = window.gapi.client.getToken().access_token;

        const response = await fetch(`https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: fileContent,
        });

        if (!response.ok) {
            throw new Error(`Error updating file: ${response.statusText}`);
        }
    } catch (error) {
        console.error("Error updating file:", error);
        throw error;
    }
}
