'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../lib/api';

interface AuthContextType {
    user: any;
    loading: boolean;
    login: (token: string, userData: any) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    login: () => { },
    logout: () => { },
    isAuthenticated: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            if (token) {
                try {
                    // Try to fetch fresh user data
                    const res = await api.get('/api/auth/me');
                    const freshUser = res.data.data;
                    setUser(freshUser);
                    localStorage.setItem('user', JSON.stringify(freshUser));
                } catch (err: any) {
                    // If unauthorized, clear everything and redirect to login
                    if (err.response?.status === 401) {
                        console.log('Session expired or invalid, redirecting to login...');
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        setUser(null);
                        router.push('/login');
                    } else {
                        console.error('Failed to fetch user', err);
                        // For other errors (network, server), we might want to keep the local user state
                        // or handle it differently.
                        if (storedUser) {
                            setUser(JSON.parse(storedUser));
                        } else {
                            localStorage.removeItem('token');
                        }
                    }
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    const login = (token: string, userData: any) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        if (userData.isNewUser) {
            router.push('/set-password');
        } else {
            router.push('/dashboard');
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
