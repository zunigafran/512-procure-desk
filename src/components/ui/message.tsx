import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { Image, View, type ImageProps, type ViewProps } from 'react-native';
import { Text, TextClassContext } from '@/components/ui/text';
import { cn } from '@/lib/utils';

const messageVariants = cva('w-full flex-row items-end gap-2 py-2', {
  variants: {
    from: {
      user: 'justify-end',
      assistant: 'justify-start flex-row-reverse',
    },
  },
  defaultVariants: {
    from: 'user',
  },
});

type MessageProps = ViewProps & VariantProps<typeof messageVariants>;

function Message({ className, from, ...props }: MessageProps) {
  return (
    <MessageContext.Provider value={{ from: from ?? 'user' }}>
      <View className={cn(messageVariants({ from }), className)} {...props} />
    </MessageContext.Provider>
  );
}

const MessageContext = React.createContext<{ from: 'user' | 'assistant' }>({
  from: 'user',
});

function MessageContent({ className, children, ...props }: ViewProps) {
  const { from } = React.useContext(MessageContext);
  const isUser = from === 'user';
  return (
    <TextClassContext.Provider
      value={cn('text-base leading-snug', isUser ? 'text-primary-foreground' : 'text-foreground')}
    >
      <View
        className={cn(
          'max-w-[80%] rounded-lg px-4 py-3',
          isUser ? 'bg-primary' : 'bg-muted',
          className
        )}
        {...props}
      >
        {typeof children === 'string' ? <Text>{children}</Text> : children}
      </View>
    </TextClassContext.Provider>
  );
}

function MessageAvatar({
  className,
  fallback,
  ...props
}: ImageProps & { fallback?: string }) {
  const [errored, setErrored] = React.useState(false);

  if (errored || !props.source) {
    return (
      <View
        className={cn(
          'h-8 w-8 items-center justify-center rounded-full border border-border bg-muted',
          className
        )}
      >
        <Text className="text-xs font-medium text-muted-foreground">
          {fallback ?? '?'}
        </Text>
      </View>
    );
  }

  return (
    <Image
      onError={() => setErrored(true)}
      className={cn('h-8 w-8 rounded-full border border-border', className)}
      {...props}
    />
  );
}

export { Message, MessageAvatar, MessageContent, messageVariants };
