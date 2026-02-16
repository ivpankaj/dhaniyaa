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

            // Optimistically set user from localStorage to avoid flicker/blank screen
            if (storedUser) {
                try {
                    setUser(JSON.parse(storedUser));
                } catch (e) {
                    console.error('Failed to parse stored user');
                }
            }

            if (token) {
                try {
                    // Revalidate with server
                    const res = await api.get('/api/auth/me');
                    const freshUser = res.data.data;
                    setUser(freshUser);
                    localStorage.setItem('user', JSON.stringify(freshUser));
                } catch (err: any) {
                    if (err.response?.status === 401) {
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        setUser(null);
                        router.push('/login');
                    } else if (!storedUser) {
                        // Only clear if we don't even have a stale user
                        localStorage.removeItem('token');
                        setUser(null);
                    }
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        };

        checkAuth();
    }, [router]);

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
