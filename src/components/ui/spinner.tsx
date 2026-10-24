import * as React from 'react';
import { ActivityIndicator, type ActivityIndicatorProps } from 'react-native';
import { cn } from '@/lib/utils';

function Spinner({ className, ...props }: ActivityIndicatorProps) {
  return (
    <ActivityIndicator
      role="progressbar"
      className={cn('text-foreground', className)}
      {...props}
    />
  );
}

export { Spinner };
