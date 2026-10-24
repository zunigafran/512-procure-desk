import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { Pressable, TextInput, View, type TextInputProps, type ViewProps } from 'react-native';
import { Text, TextClassContext } from '@/components/ui/text';
import { cn } from '@/lib/utils';

function InputGroup({ className, ...props }: ViewProps) {
  return (
    <View
      role="group"
      className={cn(
        'w-full flex-row items-center rounded-md border border-input bg-background',
        className
      )}
      {...props}
    />
  );
}

const inputGroupAddonVariants = cva('items-center justify-center', {
  variants: {
    align: {
      'inline-start': 'flex-row gap-2 pl-3',
      'inline-end': 'flex-row gap-2 pr-3',
    },
  },
  defaultVariants: {
    align: 'inline-start',
  },
});

function InputGroupAddon({
  className,
  align,
  ...props
}: ViewProps & VariantProps<typeof inputGroupAddonVariants>) {
  return (
    <TextClassContext.Provider value="text-sm text-muted-foreground">
      <View
        className={cn(inputGroupAddonVariants({ align }), className)}
        {...props}
      />
    </TextClassContext.Provider>
  );
}

function InputGroupInput({
  className,
  placeholderClassName,
  ...props
}: TextInputProps & { ref?: React.RefObject<TextInput> }) {
  return (
    <TextInput
      className={cn(
        'h-10 native:h-12 flex-1 bg-transparent px-3 text-base lg:text-sm native:text-lg text-foreground web:focus-visible:outline-none',
        props.editable === false && 'opacity-50',
        className
      )}
      placeholderClassName={cn('text-muted-foreground', placeholderClassName)}
      {...props}
    />
  );
}

function InputGroupText({
  className,
  ...props
}: React.ComponentProps<typeof Text>) {
  return (
    <Text
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  );
}

function InputGroupButton({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Pressable> & { className?: string }) {
  return (
    <Pressable
      className={cn(
        'h-8 flex-row items-center justify-center gap-1 rounded-sm px-2 active:bg-accent web:hover:bg-accent',
        className
      )}
      {...props}
    >
      {typeof children === 'string' ? (
        <Text className="text-sm font-medium">{children}</Text>
      ) : (
        children
      )}
    </Pressable>
  );
}

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
};
