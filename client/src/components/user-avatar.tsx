import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface UserAvatarProps {
  user: {
    profilePicture?: string;
    firstName?: string;
    lastName?: string;
    username?: string;
  };
  className?: string;
  fallbackClassName?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  sm: 'w-6 h-6',
  md: 'w-10 h-10',
  lg: 'w-16 h-16',
  xl: 'w-24 h-24'
};

const fallbackTextSizes = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-lg',
  xl: 'text-2xl'
};

export function UserAvatar({ 
  user, 
  className, 
  fallbackClassName,
  size = 'md' 
}: UserAvatarProps) {
  const [imageError, setImageError] = useState(false);
  
  // Generate fallback text from user's name or username
  const getFallbackText = () => {
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user.firstName) {
      return user.firstName[0].toUpperCase();
    }
    if (user.username) {
      return user.username[0].toUpperCase();
    }
    return 'U';
  };

  // Check if we should show the image
  const shouldShowImage = user.profilePicture && !imageError;

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      {shouldShowImage && (
        <AvatarImage
          src={user.profilePicture}
          alt={user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.username}
          onError={() => setImageError(true)}
          onLoad={() => setImageError(false)}
        />
      )}
      <AvatarFallback 
        className={cn(
          'bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium',
          fallbackTextSizes[size],
          fallbackClassName
        )}
      >
        {getFallbackText()}
      </AvatarFallback>
    </Avatar>
  );
}