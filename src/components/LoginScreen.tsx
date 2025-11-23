'use client';

import { LogIn } from 'lucide-react';
import { useGoogleDrive } from '@/contexts/GoogleDriveContext';

export default function LoginScreen() {
    const { login } = useGoogleDrive();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 relative z-10">
            <div className="max-w-md w-full space-y-8 text-center">
                {/* Logo/Title */}
                <div className="space-y-2">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-gradient-to-b from-foreground to-foreground/50 bg-clip-text text-transparent">
                        MONK MODE
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Discipline is freedom.
                    </p>
                </div>

                {/* Quote */}
                <div className="py-8 relative">
                    <span className="text-6xl absolute top-0 left-0 text-foreground/5 font-serif">"</span>
                    <p className="text-xl text-muted font-light italic px-8">
                        The only way to do great work is to love what you do.
                    </p>
                    <span className="text-6xl absolute bottom-0 right-0 text-foreground/5 font-serif">"</span>
                </div>

                {/* Login Button */}
                <div className="flex justify-center">
                    <button
                        onClick={login}
                        className="group relative px-8 py-4 bg-foreground text-background rounded-full font-semibold text-lg flex items-center gap-3 hover:opacity-90 transition-all hover:scale-105 active:scale-95"
                    >
                        <LogIn size={24} />
                        <span>Login with Google</span>

                        {/* Glow Effect */}
                        <div className="absolute inset-0 rounded-full bg-white/20 blur-lg opacity-0 group-hover:opacity-50 transition-opacity" />
                    </button>
                </div>

                <p className="text-xs text-muted/50 pt-8">
                    Sign in to access your Calendar, Tasks, and Goals.
                    <br />
                    Data is stored securely in your Google Drive.
                </p>

                {/* Troubleshooting Tip */}
                <p className="text-[10px] text-red-400/50 pt-4">
                    Trouble logging in? Make sure you are using
                    <span className="font-mono bg-surface-hover px-1 rounded mx-1">http://localhost:3000</span>
                    not an IP address.
                </p>
            </div>
        </div>
    );
}
