'use client';

import Image from 'next/image';
import { getIconPath } from '@/lib/game/icons';

interface ResourceIconProps {
  iconName: string;
  alt: string;
  size?: number;
  className?: string;
}

export default function ResourceIcon({ iconName, alt, size = 32, className = '' }: ResourceIconProps) {
  return (
    <Image
      src={getIconPath(iconName)}
      alt={alt}
      width={size}
      height={size}
      className={className}
      unoptimized // For now, optimize later if needed
    />
  );
}

