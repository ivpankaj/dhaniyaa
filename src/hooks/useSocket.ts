import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export const useSocket = (projectId: string) => {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        if (!projectId) return;

        const socketIo = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080');

        socketIo.on('connect', () => {
            console.log('Connected to socket', socketIo.id);
            socketIo.emit('join_project', projectId);
        });

        setSocket(socketIo);

        return () => {
            socketIo.disconnect();
        };
    }, [projectId]);

    return socket;
};
