'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface UserAvatarProps {
    name: string;
    avatar?: string;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ name, avatar, size = 'md', className = '' }) => {
    const [imageError, setImageError] = useState(false);

    const sizeClasses = {
        sm: 'w-8 h-8 text-xs',
        md: 'w-10 h-10 text-sm',
        lg: 'w-12 h-12 text-base'
    };

    const initial = (name || '?').charAt(0).toUpperCase();

    // Show initial if no avatar, or if image failed to load
    if (!avatar || imageError) {
        return (
            <div className={`${sizeClasses[size]} bg-indigo-100 rounded-full flex items-center justify-center text-primary font-bold flex-shrink-0 ${className}`}>
                {initial}
            </div>
        );
    }

    return (
        <div className={`${sizeClasses[size]} relative flex-shrink-0 ${className}`}>
            <Image
                src={avatar}
                alt={name}
                fill
                className="rounded-full object-cover"
                onError={() => setImageError(true)}
            />
        </div>
    );
};
