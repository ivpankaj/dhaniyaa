import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Dhaniyaa Project Management',
        short_name: 'Dhaniyaa',
        description: 'Free Agile Project Management Tool',
        start_url: '/',
        display: 'standalone',
        background_color: '#0f172a',
        theme_color: '#10b981',
        icons: [
            {
                src: '/favicon.ico',
                sizes: 'any',
                type: 'image/x-icon',
            },
            {
                src: '/icon-192.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/icon-512.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    };
}
