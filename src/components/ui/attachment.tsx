import { File, X } from 'lucide-react-native';
import * as React from 'react';
import { Image, Pressable, View, type ImageSourcePropType, type ViewProps } from 'react-native';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

function formatBytes(bytes: number) {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

type AttachmentProps = ViewProps & {
  onPress?: () => void;
};

function Attachment({ className, onPress, ...props }: AttachmentProps) {
  const Wrapper = onPress ? Pressable : View;
  return (
    <Wrapper
      onPress={onPress}
      className={cn(
        'flex-row items-center gap-3 rounded-lg border border-border bg-card p-3',
        onPress && 'active:bg-accent web:hover:bg-accent',
        className
      )}
      {...(props as ViewProps)}
    />
  );
}

function AttachmentPreview({
  className,
  source,
  children,
  ...props
}: ViewProps & { source?: ImageSourcePropType }) {
  return (
    <View
      className={cn(
        'h-10 w-10 items-center justify-center overflow-hidden rounded-md bg-muted',
        className
      )}
      {...props}
    >
      {source ? (
        <Image source={source} className="h-full w-full" resizeMode="cover" />
      ) : (
        children ?? <File size={18} className="text-muted-foreground" />
      )}
    </View>
  );
}

function AttachmentContent({ className, ...props }: ViewProps) {
  return <View className={cn('flex-1 gap-0.5', className)} {...props} />;
}

function AttachmentName({
  className,
  ...props
}: React.ComponentProps<typeof Text>) {
  return (
    <Text
      numberOfLines={1}
      className={cn('text-sm font-medium', className)}
      {...props}
    />
  );
}

function AttachmentInfo({
  className,
  size,
  children,
  ...props
}: React.ComponentProps<typeof Text> & { size?: number }) {
  return (
    <Text
      numberOfLines={1}
      className={cn('text-xs text-muted-foreground', className)}
      {...props}
    >
      {children ?? (typeof size === 'number' ? formatBytes(size) : null)}
    </Text>
  );
}

function AttachmentRemove({
  className,
  onPress,
  ...props
}: React.ComponentProps<typeof Pressable> & { className?: string }) {
  return (
    <Pressable
      accessibilityLabel="Remove attachment"
      hitSlop={8}
      onPress={onPress}
      className={cn(
        'h-6 w-6 items-center justify-center rounded-full active:bg-muted web:hover:bg-muted',
        className
      )}
      {...props}
    >
      <X size={14} className="text-muted-foreground" />
    </Pressable>
  );
}

export {
  Attachment,
  AttachmentContent,
  AttachmentInfo,
  AttachmentName,
  AttachmentPreview,
  AttachmentRemove,
};
