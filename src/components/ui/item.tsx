import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { Pressable, View, type ViewProps } from 'react-native';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

const itemVariants = cva(
  'flex-row items-center gap-4 rounded-md p-4 native:gap-3',
  {
    variants: {
      variant: {
        default: '',
        outline: 'border border-border',
        muted: 'bg-muted/50',
      },
      size: {
        default: 'p-4',
        sm: 'px-4 py-3 gap-2.5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

function ItemGroup({ className, ...props }: ViewProps) {
  return <View role="list" className={cn('gap-0', className)} {...props} />;
}

function ItemSeparator({ className, ...props }: ViewProps) {
  return <View className={cn('my-0 h-[1px] bg-border', className)} {...props} />;
}

type ItemProps = ViewProps &
  VariantProps<typeof itemVariants> & {
    onPress?: React.ComponentProps<typeof Pressable>['onPress'];
    disabled?: boolean;
  };

function Item({ className, variant, size, onPress, disabled, ...props }: ItemProps) {
  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        disabled={disabled}
        className={cn(
          itemVariants({ variant, size }),
          'active:bg-accent web:hover:bg-accent',
          disabled && 'opacity-50',
          className
        )}
        {...(props as React.ComponentProps<typeof Pressable>)}
      />
    );
  }
  return (
    <View className={cn(itemVariants({ variant, size }), className)} {...props} />
  );
}

const itemMediaVariants = cva('items-center justify-center', {
  variants: {
    variant: {
      default: '',
      icon: 'h-8 w-8 rounded-sm border border-border bg-muted',
      image: 'h-10 w-10 overflow-hidden rounded-sm',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

function ItemMedia({
  className,
  variant,
  ...props
}: ViewProps & VariantProps<typeof itemMediaVariants>) {
  return (
    <View className={cn(itemMediaVariants({ variant }), className)} {...props} />
  );
}

function ItemContent({ className, ...props }: ViewProps) {
  return <View className={cn('flex-1 gap-1', className)} {...props} />;
}

function ItemTitle({ className, ...props }: React.ComponentProps<typeof Text>) {
  return (
    <Text
      className={cn('text-sm font-medium leading-snug', className)}
      {...props}
    />
  );
}

function ItemDescription({
  className,
  ...props
}: React.ComponentProps<typeof Text>) {
  return (
    <Text
      className={cn('text-sm leading-normal text-muted-foreground', className)}
      {...props}
    />
  );
}

function ItemActions({ className, ...props }: ViewProps) {
  return (
    <View className={cn('flex-row items-center gap-2', className)} {...props} />
  );
}

function ItemHeader({ className, ...props }: ViewProps) {
  return (
    <View
      className={cn('w-full flex-row items-center justify-between gap-2', className)}
      {...props}
    />
  );
}

function ItemFooter({ className, ...props }: ViewProps) {
  return (
    <View
      className={cn('w-full flex-row items-center justify-between gap-2', className)}
      {...props}
    />
  );
}

export {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
  itemVariants,
};
