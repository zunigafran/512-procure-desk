import { ChevronDown } from 'lucide-react-native';
import * as React from 'react';
import {
  FlatList,
  Pressable,
  View,
  type FlatListProps,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type ViewProps,
} from 'react-native';
import { cn } from '@/lib/utils';

type MessageScrollerContextValue = {
  isAtBottom: boolean;
  scrollToBottom: (animated?: boolean) => void;
};

const MessageScrollerContext = React.createContext<MessageScrollerContextValue>({
  isAtBottom: true,
  scrollToBottom: () => {},
});

function useMessageScroller() {
  return React.useContext(MessageScrollerContext);
}

const BOTTOM_THRESHOLD = 40;

type MessageScrollerProps<T> = FlatListProps<T> & {
  /** Automatically stick to the bottom when new messages arrive while already at the bottom. */
  autoScroll?: boolean;
};

/**
 * A chat message list that keeps itself pinned to the newest message.
 * Wrap it in MessageScrollerProvider-free usage: it provides its own context so
 * MessageScrollerScrollButton can be rendered as a sibling overlay.
 */
function MessageScroller<T>({
  autoScroll = true,
  onScroll,
  onContentSizeChange,
  contentContainerClassName,
  children,
  ...props
}: MessageScrollerProps<T> & { children?: React.ReactNode }) {
  const listRef = React.useRef<FlatList<T>>(null);
  const [isAtBottom, setIsAtBottom] = React.useState(true);
  const isAtBottomRef = React.useRef(true);

  const scrollToBottom = React.useCallback((animated = true) => {
    listRef.current?.scrollToEnd({ animated });
  }, []);

  const handleScroll = React.useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
      const distanceFromBottom =
        contentSize.height - layoutMeasurement.height - contentOffset.y;
      const atBottom = distanceFromBottom <= BOTTOM_THRESHOLD;
      isAtBottomRef.current = atBottom;
      setIsAtBottom(atBottom);
      onScroll?.(event);
    },
    [onScroll]
  );

  const handleContentSizeChange = React.useCallback(
    (width: number, height: number) => {
      if (autoScroll && isAtBottomRef.current) {
        listRef.current?.scrollToEnd({ animated: true });
      }
      onContentSizeChange?.(width, height);
    },
    [autoScroll, onContentSizeChange]
  );

  return (
    <MessageScrollerContext.Provider value={{ isAtBottom, scrollToBottom }}>
      <View className="relative flex-1">
        <FlatList
          ref={listRef}
          onScroll={handleScroll}
          scrollEventThrottle={64}
          onContentSizeChange={handleContentSizeChange}
          contentContainerClassName={cn('gap-2 p-4', contentContainerClassName)}
          {...props}
        />
        {children}
      </View>
    </MessageScrollerContext.Provider>
  );
}

function MessageScrollerScrollButton({ className, ...props }: ViewProps) {
  const { isAtBottom, scrollToBottom } = useMessageScroller();

  if (isAtBottom) return null;

  return (
    <View
      className={cn('absolute bottom-4 w-full items-center', className)}
      pointerEvents="box-none"
      {...props}
    >
      <Pressable
        accessibilityLabel="Scroll to bottom"
        onPress={() => scrollToBottom()}
        className="h-10 w-10 items-center justify-center rounded-full border border-border bg-background shadow-md shadow-foreground/10 active:bg-accent web:hover:bg-accent"
      >
        <ChevronDown size={18} className="text-foreground" />
      </Pressable>
    </View>
  );
}

export { MessageScroller, MessageScrollerScrollButton, useMessageScroller };
