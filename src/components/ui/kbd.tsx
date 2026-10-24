import * as React from 'react';
import { View, type ViewProps } from 'react-native';
import { Text, TextClassContext } from '@/components/ui/text';
import { cn } from '@/lib/utils';

function Kbd({ className, children, ...props }: ViewProps) {
  return (
    <TextClassContext.Provider value="text-xs font-medium text-muted-foreground">
      <View
        className={cn(
          'h-6 min-w-6 flex-row items-center justify-center gap-1 rounded-sm border border-border bg-muted px-1.5',
          className
        )}
        {...props}
      >
        {typeof children === 'string' ? <Text>{children}</Text> : children}
      </View>
    </TextClassContext.Provider>
  );
}

function KbdGroup({ className, ...props }: ViewProps) {
  return <View className={cn('flex-row items-center gap-1', className)} {...props} />;
}

export { Kbd, KbdGroup };
