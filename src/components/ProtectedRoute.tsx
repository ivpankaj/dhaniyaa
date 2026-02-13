'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

const protectedRoutes = ['/dashboard', '/organization', '/project', '/tickets'];

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading && !user && protectedRoutes.some(route => pathname.startsWith(route))) {
            router.push('/login');
        }
    }, [user, loading, router, pathname]);

    if (loading) {
        return <div className="flex justify-center items-center h-screen text-white">Loading...</div>;
    }

    // If user is not authenticated and on a protected route, we return null (effect handles redirect)
    if (!user && protectedRoutes.some(route => pathname.startsWith(route))) {
        return null;
    }

    return <>{children}</>;
}
