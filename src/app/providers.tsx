'use client';

import { AuthProvider } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Toaster } from 'sonner';

import { Provider } from 'react-redux';
import { store } from '@/store/store';

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <AuthProvider>
                <ProtectedRoute>
                    {children}
                </ProtectedRoute>
                <Toaster position="bottom-right" richColors />
            </AuthProvider>
        </Provider>
    );
}
