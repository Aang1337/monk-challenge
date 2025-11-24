'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import Script from 'next/script';

const CLIENT_ID = '143278814984-jmt5nbg1vl09vc0od9tntmtuvdn4bhhl.apps.googleusercontent.com';
const SCOPES = 'https://www.googleapis.com/auth/drive.file openid profile email';

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

    // Initialize GAPI (for Drive API calls)
    const initializeGapiClient = useCallback(async () => {
        await new Promise<void>((resolve) => {
            window.gapi.load('client', resolve);
        });

        await window.gapi.client.init({
            // apiKey: API_KEY, // Optional if using access token
            discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
        });
        setGapiInitialized(true);
    }, []);

    // Initialize GIS (for Auth)
    const initializeGisClient = useCallback(() => {
        const client = window.google.accounts.oauth2.initTokenClient({
            client_id: CLIENT_ID,
            scope: SCOPES,
            callback: async (response: any) => {
                if (response.error !== undefined) {
                    throw response;
                }

                // Fetch user info
                const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: { Authorization: `Bearer ${response.access_token}` },
                }).then(res => res.json());

                setUser(userInfo);

                // Store token in gapi client
                // @ts-ignore
                if (window.gapi && window.gapi.client) {
                    // @ts-ignore
                    window.gapi.client.setToken(response);
                }
            },
        });
        setTokenClient(client);
        setGisInitialized(true);
        setIsLoading(false);
    }, []);

    const login = () => {
        if (tokenClient) {
            tokenClient.requestAccessToken({ prompt: 'consent' });
        }
    };

    const logout = () => {
        const token = window.gapi?.client?.getToken();
        if (token !== null) {
            window.google.accounts.oauth2.revoke(token.access_token, () => { });
            window.gapi.client.setToken(null);
            setUser(null);
        }
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
