import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { View, type ViewProps } from 'react-native';
import { Text, TextClassContext } from '@/components/ui/text';
import { cn } from '@/lib/utils';

const bubbleVariants = cva('max-w-[80%] rounded-2xl px-4 py-2.5', {
  variants: {
    variant: {
      sent: 'self-end rounded-br-sm bg-primary',
      received: 'self-start rounded-bl-sm bg-muted',
    },
  },
  defaultVariants: {
    variant: 'received',
  },
});

const bubbleTextVariants = cva('text-base leading-snug', {
  variants: {
    variant: {
      sent: 'text-primary-foreground',
      received: 'text-foreground',
    },
  },
  defaultVariants: {
    variant: 'received',
  },
});

type BubbleProps = ViewProps & VariantProps<typeof bubbleVariants>;

function Bubble({ className, variant, children, ...props }: BubbleProps) {
  return (
    <TextClassContext.Provider value={bubbleTextVariants({ variant })}>
      <View className={cn(bubbleVariants({ variant }), className)} {...props}>
        {typeof children === 'string' ? <Text>{children}</Text> : children}
      </View>
    </TextClassContext.Provider>
  );
}

function BubbleGroup({ className, ...props }: ViewProps) {
  return <View className={cn('gap-1.5', className)} {...props} />;
}

function BubbleTimestamp({
  className,
  variant,
  ...props
}: Omit<React.ComponentProps<typeof Text>, 'variant'> &
  VariantProps<typeof bubbleVariants>) {
  return (
    <Text
      className={cn(
        'mt-1 text-xs',
        variant === 'sent' ? 'text-primary-foreground/70' : 'text-muted-foreground',
        className
      )}
      {...props}
    />
  );
}

export { Bubble, BubbleGroup, BubbleTimestamp, bubbleVariants };
