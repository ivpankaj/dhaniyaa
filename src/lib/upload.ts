import api from './api';
import axios from 'axios';

export const uploadToCloudinary = async (file: File) => {
    try {
        // 1. Get signature from backend
        const sigRes = await api.get('/api/upload/signature');
        const { signature, timestamp, cloudName, apiKey, folder } = sigRes.data.data;

        // 2. Upload directly to Cloudinary
        const formData = new FormData();
        formData.append('file', file);
        formData.append('api_key', apiKey);
        formData.append('timestamp', timestamp);
        formData.append('signature', signature);
        formData.append('folder', folder);

        const uploadRes = await axios.post(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            formData
        );

        return uploadRes.data.secure_url;
    } catch (err) {
        console.error('Cloudinary upload failed', err);
        throw new Error('Image upload failed');
    }
};
