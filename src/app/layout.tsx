import type { Metadata } from 'next';
import './globals.css';
import Script from 'next/script';
import Providers from './providers';

export const metadata: Metadata = {
    metadataBase: new URL('https://dhaniyaa.cookmytech.site'),
    title: {
        default: 'Dhaniyaa - Project Management',
        template: '%s | Dhaniyaa',
    },
    description: 'Modern & Powerful Project Management for teams. Free forever.',
    keywords: [
        'project management',
        'task management',
        'product management',
        'agile project management',
        'scrum software',
        'kanban board',
        'sprint planning',
        'issue tracking',
        'bug tracking',
        'workflow automation',
        'team collaboration tool',
        'free jira alternative',
        'free trello alternative',
        'free asana alternative',
        'software development tool',
        'dhaniyaa'
    ],
    authors: [{ name: 'Cookmytech' }],
    creator: 'Cookmytech',
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://dhaniyaa.cookmytech.site',
        siteName: 'Dhaniyaa',
        title: 'Dhaniyaa - Project Management',
        description: 'Modern & Powerful Project Management for teams. Free forever.',
        images: [
            {
                url: '/og-default.png',
                width: 1200,
                height: 630,
                alt: 'Dhaniyaa App',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Dhaniyaa',
        description: 'Modern & Powerful Project Management for teams.',
        images: ['/twitter-default.png'],
        creator: '@cookmytech', // Placeholder
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    verification: {
        google: '4G0C327upPlSMGFxrsmDaYGpYEF3UehJwpMzO8SYrVI',
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <Script
                    src="https://www.googletagmanager.com/gtag/js?id=G-MXEHR6PTE1"
                    strategy="afterInteractive"
                />
                <Script id="google-analytics" strategy="afterInteractive">
                    {`
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', 'G-MXEHR6PTE1');
                    `}
                </Script>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
