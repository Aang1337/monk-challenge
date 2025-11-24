'use client';

import { useGoogleDrive } from '@/contexts/GoogleDriveContext';
import Sidebar from '@/components/Sidebar';
import LoginScreen from '@/components/LoginScreen';
import { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';

// Set to true to bypass login for development
const DEV_BYPASS_LOGIN = true;

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading } = useGoogleDrive();
    const [showContent, setShowContent] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const previousAuthState = useRef(isAuthenticated);

    // Prevent hydration mismatch by waiting for mount
    useEffect(() => {
        setShowContent(true);
    }, []);

    // Redirect to home ONLY when authentication changes from false to true
    useEffect(() => {
        if (!previousAuthState.current && isAuthenticated && pathname !== '/' && showContent) {
            router.push('/');
        }
        previousAuthState.current = isAuthenticated;
    }, [isAuthenticated, pathname, router, showContent]);

    if (!showContent) return null;

    // DEVELOPMENT BYPASS: Skip authentication if flag is enabled
    if (DEV_BYPASS_LOGIN) {
        return (
            <div className="relative z-10">
                <Sidebar />
                <div className="pl-16">
                    {children}
                </div>
            </div>
        );
    }

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
