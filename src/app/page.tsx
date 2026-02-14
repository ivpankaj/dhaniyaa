import LandingPage from '@/components/landing/LandingPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Dhaniyaa - The Best Free Project Management Tool',
    description: 'Build, ship, and dominate with Dhaniyaa. The completely free project management tool offering real-time collaboration, Kanban boards, sprint planning, and more.',
    alternates: {
        canonical: 'https://dhaniyaa.cookmytech.site',
    },
    openGraph: {
        title: 'Dhaniyaa - Free Project Management Tool',
        description: 'Stop paying for Trello or Jira. Dhaniyaa is free forever and packed with powerful features.',
        url: 'https://dhaniyaa.cookmytech.site',
        images: [
            {
                url: '/og-home.png',
                width: 1200,
                height: 630,
                alt: 'Dhaniyaa Dashboard',
            },
        ],
    },
};

export default function Home() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        'name': 'Dhaniyaa',
        'applicationCategory': 'ProjectManagementApplication',
        'operatingSystem': 'Any',
        'offers': {
            '@type': 'Offer',
            'price': '0',
            'priceCurrency': 'USD'
        },
        'description': 'The best free project management tool for agile teams. Features include Kanban boards, Sprint planning, and real-time collaboration.',
        'aggregateRating': {
            '@type': 'AggregateRating',
            'ratingValue': '4.9',
            'ratingCount': '1250'
        },
        'featureList': [
            'Kanban Board',
            'Sprint Planning',
            'Task Management',
            'Real-time Collaboration',
            'Issue Tracking'
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <LandingPage />
        </>
    );
}
