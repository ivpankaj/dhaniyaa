import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: 'dhaniyaa',
    description: 'Modern & Powerful Project Management',
};

import Providers from './providers';

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
