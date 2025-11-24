'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import Script from 'next/script';

const CLIENT_ID = '143278814984-jmt5nbg1vl09vc0od9tntmtuvdn4bhhl.apps.googleusercontent.com';
const SCOPES = 'https://www.googleapis.com/auth/drive.file openid profile email';

// LocalStorage keys
const STORAGE_KEYS = {
    TOKEN: 'monk_mode_token',
    USER: 'monk_mode_user',
    EXPIRES_AT: 'monk_mode_expires_at',
};

// Refresh token 5 minutes before expiration
const REFRESH_BUFFER_MS = 5 * 60 * 1000;

interface GoogleDriveContextType {
    user: any | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: () => void;
    logout: () => void;
    gapiInitialized: boolean;
}

const GoogleDriveContext = createContext<GoogleDriveContextType>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    login: () => { },
    logout: () => { },
    gapiInitialized: false,
});

export const useGoogleDrive = () => useContext(GoogleDriveContext);

export function GoogleDriveProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<any | null>(null);
    const [tokenClient, setTokenClient] = useState<any>(null);
    const [gapiInitialized, setGapiInitialized] = useState(false);
    const [gisInitialized, setGisInitialized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Save session to localStorage
    const saveSession = useCallback((tokenResponse: any, userInfo: any) => {
        try {
            const expiresAt = Date.now() + (tokenResponse.expires_in * 1000);
            localStorage.setItem(STORAGE_KEYS.TOKEN, JSON.stringify(tokenResponse));
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userInfo));
            localStorage.setItem(STORAGE_KEYS.EXPIRES_AT, expiresAt.toString());
            console.log('✅ Session saved to localStorage');
        } catch (error) {
            console.error('Failed to save session:', error);
        }
    }, []);

    // Clear session from localStorage
    const clearSession = useCallback(() => {
        try {
            localStorage.removeItem(STORAGE_KEYS.TOKEN);
            localStorage.removeItem(STORAGE_KEYS.USER);
            localStorage.removeItem(STORAGE_KEYS.EXPIRES_AT);
            console.log('🗑️ Session cleared from localStorage');
        } catch (error) {
            console.error('Failed to clear session:', error);
        }
    }, []);

    // Restore session from localStorage
    const restoreSession = useCallback(() => {
        try {
            const tokenStr = localStorage.getItem(STORAGE_KEYS.TOKEN);
            const userStr = localStorage.getItem(STORAGE_KEYS.USER);
            const expiresAtStr = localStorage.getItem(STORAGE_KEYS.EXPIRES_AT);

            if (!tokenStr || !userStr || !expiresAtStr) {
                console.log('ℹ️ No saved session found');
                return false;
            }

            const expiresAt = parseInt(expiresAtStr, 10);
            const now = Date.now();

            // Check if token is expired
            if (now >= expiresAt) {
                console.log('⏰ Saved session expired');
                clearSession();
                return false;
            }

            const token = JSON.parse(tokenStr);
            const userInfo = JSON.parse(userStr);

            // Restore token to gapi client
            if (window.gapi?.client) {
                window.gapi.client.setToken(token);
                setUser(userInfo);
                console.log('✅ Session restored from localStorage');
                return true;
            }

            return false;
        } catch (error) {
            console.error('Failed to restore session:', error);
            clearSession();
            return false;
        }
    }, [clearSession]);

    // Schedule token refresh
    const scheduleTokenRefresh = useCallback((expiresAt: number) => {
        // Clear existing timer
        if (refreshTimerRef.current) {
            clearTimeout(refreshTimerRef.current);
        }

        const now = Date.now();
        const timeUntilRefresh = expiresAt - now - REFRESH_BUFFER_MS;

        if (timeUntilRefresh > 0) {
            console.log(`⏱️ Token refresh scheduled in ${Math.round(timeUntilRefresh / 1000 / 60)} minutes`);
            refreshTimerRef.current = setTimeout(() => {
                console.log('🔄 Refreshing token...');
                if (tokenClient) {
                    tokenClient.requestAccessToken({ prompt: '' }); // Silent refresh
                }
            }, timeUntilRefresh);
        } else {
            // Token will expire soon, refresh immediately
            console.log('⚠️ Token expiring soon, refreshing now...');
            if (tokenClient) {
                tokenClient.requestAccessToken({ prompt: '' });
            }
        }
    }, [tokenClient]);

    // Initialize GAPI (for Drive API calls)
    const initializeGapiClient = useCallback(async () => {
        await new Promise<void>((resolve) => {
            window.gapi.load('client', resolve);
        });

        await window.gapi.client.init({
            discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
        });
        setGapiInitialized(true);
        console.log('✅ GAPI initialized');
    }, []);

    // Initialize GIS (for Auth)
    const initializeGisClient = useCallback(() => {
        const client = window.google.accounts.oauth2.initTokenClient({
            client_id: CLIENT_ID,
            scope: SCOPES,
            callback: async (response: any) => {
                if (response.error !== undefined) {
                    console.error('Auth error:', response);
                    throw response;
                }

                try {
                    // Fetch user info
                    const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                        headers: { Authorization: `Bearer ${response.access_token}` },
                    }).then(res => res.json());

                    // Store token in gapi client
                    if (window.gapi?.client) {
                        window.gapi.client.setToken(response);
                    }

                    // Save session to localStorage
                    saveSession(response, userInfo);

                    // Set user state
                    setUser(userInfo);

                    // Schedule token refresh
                    const expiresAt = Date.now() + (response.expires_in * 1000);
                    scheduleTokenRefresh(expiresAt);

                    console.log('✅ User authenticated:', userInfo.email);
                } catch (error) {
                    console.error('Failed to complete authentication:', error);
                }
            },
        });
        setTokenClient(client);
        setGisInitialized(true);
        console.log('✅ GIS initialized');
    }, [saveSession, scheduleTokenRefresh]);

    // Restore session on mount
    useEffect(() => {
        if (gapiInitialized && gisInitialized) {
            const restored = restoreSession();
            
            if (restored) {
                // Schedule refresh for restored session
                const expiresAtStr = localStorage.getItem(STORAGE_KEYS.EXPIRES_AT);
                if (expiresAtStr) {
                    const expiresAt = parseInt(expiresAtStr, 10);
                    scheduleTokenRefresh(expiresAt);
                }
            }
            
            setIsLoading(false);
        }
    }, [gapiInitialized, gisInitialized, restoreSession, scheduleTokenRefresh]);

    // Cleanup timer on unmount
    useEffect(() => {
        return () => {
            if (refreshTimerRef.current) {
                clearTimeout(refreshTimerRef.current);
            }
        };
    }, []);

    const login = () => {
        if (tokenClient) {
            tokenClient.requestAccessToken({ prompt: 'consent' });
        }
    };

    const logout = () => {
        const token = window.gapi?.client?.getToken();
        if (token !== null) {
            window.google.accounts.oauth2.revoke(token.access_token, () => {
                console.log('✅ Token revoked');
            });
            window.gapi.client.setToken(null);
        }

        // Clear timer
        if (refreshTimerRef.current) {
            clearTimeout(refreshTimerRef.current);
            refreshTimerRef.current = null;
        }

        // Clear session
        clearSession();
        setUser(null);
        console.log('✅ User logged out');
    };

    return (
        <GoogleDriveContext.Provider value={{
            user,
            isAuthenticated: !!user,
            isLoading,
            login,
            logout,
            gapiInitialized
        }}>
            <Script
                src="https://apis.google.com/js/api.js"
                onLoad={initializeGapiClient}
                strategy="afterInteractive"
            />
            <Script
                src="https://accounts.google.com/gsi/client"
                onLoad={initializeGisClient}
                strategy="afterInteractive"
            />
            {children}
        </GoogleDriveContext.Provider>
    );
}

// Add types to window
declare global {
    interface Window {
        gapi: any;
        google: any;
    }
}
