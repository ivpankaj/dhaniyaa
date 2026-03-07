import axios from 'axios';

export const DHANIYAA_API_BASE_PATH = '/api/apps/dhaniyaa';
const LEGACY_API_BASE_PATH = '/api';

const trimTrailingSlashes = (value: string) => value.replace(/\/+$/, '');

export const resolveApiOrigin = (rawBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? '') => {
    const normalizedBaseUrl = trimTrailingSlashes(rawBaseUrl.trim());

    if (!normalizedBaseUrl) {
        return '';
    }

    if (normalizedBaseUrl.endsWith(DHANIYAA_API_BASE_PATH)) {
        return normalizedBaseUrl.slice(0, -DHANIYAA_API_BASE_PATH.length);
    }

    if (normalizedBaseUrl.endsWith(LEGACY_API_BASE_PATH)) {
        return normalizedBaseUrl.slice(0, -LEGACY_API_BASE_PATH.length);
    }

    return normalizedBaseUrl;
};

export const resolveApiBaseUrl = (rawBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? '') => {
    const apiOrigin = resolveApiOrigin(rawBaseUrl);

    return apiOrigin ? `${apiOrigin}${DHANIYAA_API_BASE_PATH}` : DHANIYAA_API_BASE_PATH;
};

export const normalizeApiPath = (url?: string) => {
    if (!url) {
        return url;
    }

    if (/^https?:\/\//i.test(url) || url.startsWith('//')) {
        return url;
    }

    let normalizedPath = url;

    if (normalizedPath.startsWith(DHANIYAA_API_BASE_PATH)) {
        normalizedPath = normalizedPath.slice(DHANIYAA_API_BASE_PATH.length);
    } else if (normalizedPath.startsWith(LEGACY_API_BASE_PATH)) {
        normalizedPath = normalizedPath.slice(LEGACY_API_BASE_PATH.length);
    }

    if (!normalizedPath) {
        return '/';
    }

    return normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`;
};

export const apiOrigin = resolveApiOrigin();

const api = axios.create({
    baseURL: resolveApiBaseUrl(),
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        config.url = normalizeApiPath(config.url);

        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
