import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { View, type ViewProps } from 'react-native';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

const buttonGroupVariants = cva('flex-row items-stretch', {
  variants: {
    orientation: {
      horizontal:
        'flex-row [&>*:not(:first-child)]:rounded-l-none [&>*:not(:first-child)]:-ml-px [&>*:not(:last-child)]:rounded-r-none',
      vertical:
        'flex-col [&>*:not(:first-child)]:rounded-t-none [&>*:not(:first-child)]:-mt-px [&>*:not(:last-child)]:rounded-b-none',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
  },
});

function ButtonGroup({
  className,
  orientation,
  ...props
}: ViewProps & VariantProps<typeof buttonGroupVariants>) {
  return (
    <View
      role="group"
      className={cn(buttonGroupVariants({ orientation }), className)}
      {...props}
    />
  );
}

function ButtonGroupText({
  className,
  children,
  ...props
}: ViewProps) {
  return (
    <View
      className={cn(
        'flex-row items-center justify-center gap-2 rounded-md border border-input bg-muted px-4',
        className
      )}
      {...props}
    >
      {typeof children === 'string' ? (
        <Text className="text-sm font-medium">{children}</Text>
      ) : (
        children
      )}
    </View>
  );
}

function ButtonGroupSeparator({ className, ...props }: ViewProps) {
  return (
    <View className={cn('w-[1px] self-stretch bg-input', className)} {...props} />
  );
}

export { ButtonGroup, ButtonGroupSeparator, ButtonGroupText, buttonGroupVariants };
