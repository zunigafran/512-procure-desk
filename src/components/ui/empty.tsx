import * as React from 'react';
import { View, type ViewProps } from 'react-native';
import { Text, TextClassContext } from '@/components/ui/text';
import { cn } from '@/lib/utils';

function Empty({ className, ...props }: ViewProps) {
  return (
    <View
      className={cn(
        'flex-1 items-center justify-center gap-6 rounded-lg p-8 native:p-12',
        className
      )}
      {...props}
    />
  );
}

function EmptyHeader({ className, ...props }: ViewProps) {
  return (
    <View
      className={cn('max-w-sm items-center gap-2 text-center', className)}
      {...props}
    />
  );
}

function EmptyMedia({
  className,
  variant = 'default',
  ...props
}: ViewProps & { variant?: 'default' | 'icon' }) {
  return (
    <View
      className={cn(
        'mb-2 items-center justify-center',
        variant === 'icon' && 'h-12 w-12 rounded-lg bg-muted',
        className
      )}
      {...props}
    />
  );
}

function EmptyTitle({
  className,
  ...props
}: React.ComponentProps<typeof Text>) {
  return (
    <Text
      className={cn('text-lg font-medium text-center', className)}
      {...props}
    />
  );
}

function EmptyDescription({
  className,
  ...props
}: React.ComponentProps<typeof Text>) {
  return (
    <Text
      className={cn('text-sm text-muted-foreground text-center', className)}
      {...props}
    />
  );
}

function EmptyContent({ className, ...props }: ViewProps) {
  return (
    <TextClassContext.Provider value="text-sm">
      <View
        className={cn('w-full max-w-sm items-center gap-4', className)}
        {...props}
      />
    </TextClassContext.Provider>
  );
}

export {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
};
