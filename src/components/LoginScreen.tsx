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
                    <h1 className="text-3xl md:text-5xl font-bold tracking-tighter bg-gradient-to-b from-foreground to-foreground/50 bg-clip-text text-transparent">
                        MONK MODE
                    </h1>
                    <p className="text-muted-foreground text-base">
                        Discipline is freedom.
                    </p>
                </div>

                {/* Quote */}
                <div className="py-6 relative">
                    <span className="text-5xl absolute top-0 left-2 text-foreground/5 font-serif">"</span>
                    <p className="text-lg text-muted font-light italic px-8 leading-relaxed">
                        The only way to do great work is to love what you do.
                    </p>
                    <span className="text-5xl absolute bottom-0 right-2 text-foreground/5 font-serif">"</span>
                </div>

                {/* Login Button */}
                <div className="flex justify-center pt-4">
                    <button
                        onClick={login}
                        className="group relative px-8 py-3 bg-foreground text-background rounded-full font-medium text-base flex items-center gap-3 hover:opacity-90 transition-all hover:scale-105 active:scale-95"
                    >
                        <LogIn size={20} />
                        <span>Login with Google</span>

                        {/* Glow Effect */}
                        <div className="absolute inset-0 rounded-full bg-white/20 blur-md opacity-0 group-hover:opacity-50 transition-opacity" />
                    </button>
                </div>

                <p className="text-xs text-muted/40 pt-6">
                    Sign in to access your Calendar, Tasks, and Goals.
                    <br />
                    Data is stored securely in your Google Drive.
                </p>
            </div>
        </div>
    );
}
