'use client';

import { useGoogleDrive } from '@/contexts/GoogleDriveContext';
import Sidebar from '@/components/Sidebar';
import LoginScreen from '@/components/LoginScreen';
import { useEffect, useState } from 'react';

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading } = useGoogleDrive();
    const [showContent, setShowContent] = useState(false);

    // Prevent hydration mismatch by waiting for mount
    useEffect(() => {
        setShowContent(true);
    }, []);

    if (!showContent) return null;

    // Show loading state while checking auth
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-full border-4 border-foreground/20 border-t-foreground animate-spin" />
                    <p className="text-muted text-sm">Loading Monk Mode...</p>
                </div>
            </div>
        );
    }

    // Not authenticated -> Show Login Screen
    if (!isAuthenticated) {
        return <LoginScreen />;
    }

    // Authenticated -> Show App
    return (
        <div className="relative z-10">
            <Sidebar />
            <div className="pl-16">
                {children}
            </div>
        </div>
    );
}
