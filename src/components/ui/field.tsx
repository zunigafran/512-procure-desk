import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { View, type ViewProps } from 'react-native';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

function FieldSet({ className, ...props }: ViewProps) {
  return <View className={cn('gap-6', className)} {...props} />;
}

function FieldLegend({
  className,
  variant = 'legend',
  ...props
}: Omit<React.ComponentProps<typeof Text>, 'variant'> & {
  variant?: 'legend' | 'label';
}) {
  return (
    <Text
      className={cn(
        'mb-3 font-medium',
        variant === 'legend' ? 'text-base' : 'text-sm',
        className
      )}
      {...props}
    />
  );
}

function FieldGroup({ className, ...props }: ViewProps) {
  return <View className={cn('w-full gap-7', className)} {...props} />;
}

const fieldVariants = cva('w-full gap-3', {
  variants: {
    orientation: {
      vertical: 'flex-col',
      horizontal: 'flex-row items-center',
      responsive: 'flex-col md:flex-row md:items-center',
    },
  },
  defaultVariants: {
    orientation: 'vertical',
  },
});

function Field({
  className,
  orientation,
  ...props
}: ViewProps & VariantProps<typeof fieldVariants>) {
  return (
    <View
      role="group"
      className={cn(fieldVariants({ orientation }), className)}
      {...props}
    />
  );
}

function FieldContent({ className, ...props }: ViewProps) {
  return <View className={cn('flex-1 gap-1.5', className)} {...props} />;
}

function FieldLabel({
  className,
  ...props
}: React.ComponentProps<typeof Label>) {
  return <Label className={cn('font-medium', className)} {...props} />;
}

function FieldTitle({
  className,
  ...props
}: React.ComponentProps<typeof Text>) {
  return (
    <Text className={cn('text-sm font-medium', className)} {...props} />
  );
}

function FieldDescription({
  className,
  ...props
}: React.ComponentProps<typeof Text>) {
  return (
    <Text
      className={cn('text-sm font-normal text-muted-foreground', className)}
      {...props}
    />
  );
}

function FieldSeparator({
  children,
  className,
  ...props
}: ViewProps & { children?: React.ReactNode }) {
  if (children) {
    return (
      <View
        className={cn('relative my-2 h-5 items-center justify-center', className)}
        {...props}
      >
        <Separator className="absolute inset-x-0 top-1/2" />
        <View className="bg-background px-2">
          <Text className="text-sm text-muted-foreground">{children}</Text>
        </View>
      </View>
    );
  }
  return <Separator className={cn('my-2', className)} />;
}

function FieldError({
  className,
  children,
  errors,
  ...props
}: React.ComponentProps<typeof Text> & {
  errors?: ({ message?: string } | undefined)[];
}) {
  const content = React.useMemo(() => {
    if (children) return children;
    if (!errors || errors.length === 0) return null;
    const unique = [
      ...new Set(errors.map((error) => error?.message).filter(Boolean)),
    ];
    if (unique.length === 1) return unique[0];
    return unique.join('\n');
  }, [children, errors]);

  if (!content) return null;

  return (
    <Text
      role="alert"
      className={cn('text-sm font-normal text-destructive', className)}
      {...props}
    >
      {content}
    </Text>
  );
}

export {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
};
