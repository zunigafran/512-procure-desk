import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { View, type ViewProps } from 'react-native';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

const markerVariants = cva(
  'items-center justify-center rounded-full border-2 border-background shadow-md shadow-foreground/20',
  {
    variants: {
      variant: {
        default: 'bg-primary',
        secondary: 'bg-secondary',
        destructive: 'bg-destructive',
        outline: 'bg-background border-border',
      },
      size: {
        default: 'h-8 w-8',
        sm: 'h-6 w-6',
        lg: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const markerTextVariants = cva('font-semibold', {
  variants: {
    variant: {
      default: 'text-primary-foreground',
      secondary: 'text-secondary-foreground',
      destructive: 'text-destructive-foreground',
      outline: 'text-foreground',
    },
    size: {
      default: 'text-xs',
      sm: 'text-[10px]',
      lg: 'text-sm',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

type MarkerProps = ViewProps &
  VariantProps<typeof markerVariants> & {
    label?: string;
  };

/**
 * A pin-style marker for maps and annotated images. Renders a circular badge
 * with an optional label or custom icon, and a tail pointing to the anchor.
 */
function Marker({ className, variant, size, label, children, ...props }: MarkerProps) {
  return (
    <View className={cn('items-center', className)} {...props}>
      <View className={markerVariants({ variant, size })}>
        {children ?? (
          <Text className={markerTextVariants({ variant, size })}>{label}</Text>
        )}
      </View>
      <View
        className={cn(
          'h-0 w-0 -mt-px border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent',
          variant === 'destructive'
            ? 'border-t-destructive'
            : variant === 'secondary'
              ? 'border-t-secondary'
              : variant === 'outline'
                ? 'border-t-border'
                : 'border-t-primary'
        )}
      />
    </View>
  );
}

export { Marker, markerVariants };
