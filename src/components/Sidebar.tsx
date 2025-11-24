'use client';

import { Home, Calendar, Target, Settings, Sun, Moon, Timer, LogIn, LogOut } from 'lucide-react';
import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import clsx from 'clsx';
import { useState, useEffect } from 'react';
import { useGoogleDrive } from '@/contexts/GoogleDriveContext';

export default function Sidebar() {
    const { theme, setTheme } = useTheme();
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);
    const { login, logout, user, isAuthenticated } = useGoogleDrive();

    useEffect(() => {
        setMounted(true);
    }, []);

    const navItems = [
        { icon: Home, label: 'Home', href: '/' },
        { icon: Calendar, label: 'Calendar', href: '/calendar' },
        { icon: Timer, label: 'Pomodoro', href: '/pomodoro' },
        { icon: Target, label: 'Goals', href: '/goals' },
        { icon: Settings, label: 'Settings', href: '/settings' },
    ];

    return (
        <aside className="fixed left-0 top-0 h-screen w-16 bg-surface border-r border-border flex flex-col items-center py-6 gap-6 z-50">
            {/* Logo */}
            <Link
                href="/"
                className="w-10 h-10 rounded-lg bg-foreground text-background flex items-center justify-center font-bold text-xl hover:opacity-90 transition-opacity"
            >
                M
            </Link>

            {/* Navigation */}
            <nav className="flex-1 flex flex-col gap-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={clsx(
                                'w-10 h-10 rounded-lg flex items-center justify-center transition-all relative group',
                                isActive
                                    ? 'bg-foreground text-background'
                                    : 'text-muted hover:text-foreground hover:bg-surface-hover'
                            )}
                            aria-label={item.label}
                        >
                            <Icon size={20} />
                            <span className="absolute left-full ml-2 px-2 py-1 bg-foreground text-background text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Actions */}
            <div className="flex flex-col gap-4 mt-auto">
                {/* Login/Logout Button */}
                {/* Login/Logout Button */}
                {isAuthenticated ? (
                    <button
                        onClick={logout}
                        className="w-10 h-10 rounded-lg overflow-hidden relative group flex items-center justify-center bg-surface-hover"
                        aria-label="Logout"
                    >
                        {user?.picture ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={user.picture} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                            <span className="font-bold text-foreground text-sm">
                                {user?.name?.charAt(0) || 'U'}
                            </span>
                        )}

                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <LogOut size={16} className="text-white" />
                        </div>
                        <span className="absolute left-full ml-2 px-2 py-1 bg-foreground text-background text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                            Logout ({user?.name || 'User'})
                        </span>
                    </button>
                ) : (
                    <button
                        onClick={login}
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-muted hover:text-foreground hover:bg-surface-hover transition-all group relative"
                        aria-label="Login with Google"
                    >
                        <LogIn size={20} />
                        <span className="absolute left-full ml-2 px-2 py-1 bg-foreground text-background text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            Login with Google
                        </span>
                    </button>
                )}

                {/* Theme Toggle */}
                <button
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-muted hover:text-foreground hover:bg-surface-hover transition-all"
                    aria-label="Toggle theme"
                >
                    {!mounted ? (
                        <Sun size={20} />
                    ) : theme === 'dark' ? (
                        <Sun size={20} />
                    ) : (
                        <Moon size={20} />
                    )}
                </button>
            </div>
        </aside>
    );
}
