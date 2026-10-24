import * as React from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Modal,
  PanResponder,
  Pressable,
  View,
  type ViewProps,
} from 'react-native';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

type DrawerContextValue = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const DrawerContext = React.createContext<DrawerContextValue | null>(null);

function useDrawer() {
  const context = React.useContext(DrawerContext);
  if (!context) {
    throw new Error('Drawer compound components must be used within <Drawer />');
  }
  return context;
}

type DrawerProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
};

function Drawer({ open: openProp, defaultOpen = false, onOpenChange, children }: DrawerProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const open = openProp ?? internalOpen;

  const handleOpenChange = React.useCallback(
    (next: boolean) => {
      if (openProp === undefined) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [openProp, onOpenChange]
  );

  return (
    <DrawerContext.Provider value={{ open, onOpenChange: handleOpenChange }}>
      {children}
    </DrawerContext.Provider>
  );
}

function DrawerTrigger({
  onPress,
  ...props
}: React.ComponentProps<typeof Pressable>) {
  const { onOpenChange } = useDrawer();
  return (
    <Pressable
      onPress={(event) => {
        onOpenChange(true);
        onPress?.(event);
      }}
      {...props}
    />
  );
}

function DrawerClose({
  onPress,
  ...props
}: React.ComponentProps<typeof Pressable>) {
  const { onOpenChange } = useDrawer();
  return (
    <Pressable
      onPress={(event) => {
        onOpenChange(false);
        onPress?.(event);
      }}
      {...props}
    />
  );
}

const SCREEN_HEIGHT = Dimensions.get('window').height;
const DISMISS_THRESHOLD = 100;

function DrawerContent({ className, children, ...props }: ViewProps) {
  const { open, onOpenChange } = useDrawer();
  const [translateY] = React.useState(() => new Animated.Value(SCREEN_HEIGHT));
  // Stays true while the close animation plays so the Modal isn't unmounted mid-slide.
  const [visible, setVisible] = React.useState(open);
  if (open && !visible) setVisible(true);

  React.useEffect(() => {
    if (open) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    } else if (visible) {
      Animated.timing(translateY, {
        toValue: SCREEN_HEIGHT,
        duration: 250,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) setVisible(false);
      });
    }
  }, [open, translateY, visible]);

  const panResponder = React.useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gesture) =>
          Math.abs(gesture.dy) > 8 && gesture.dy > 0,
        onPanResponderMove: (_, gesture) => {
          if (gesture.dy > 0) translateY.setValue(gesture.dy);
        },
        onPanResponderRelease: (_, gesture) => {
          if (gesture.dy > DISMISS_THRESHOLD || gesture.vy > 1) {
            onOpenChange(false);
          } else {
            Animated.spring(translateY, {
              toValue: 0,
              useNativeDriver: true,
            }).start();
          }
        },
      }),
    [onOpenChange, translateY]
  );

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} onRequestClose={() => onOpenChange(false)}>
      <Pressable className="flex-1 bg-black/60" onPress={() => onOpenChange(false)} />
      <Animated.View
        style={{ transform: [{ translateY }] }}
        className={cn(
          'absolute inset-x-0 bottom-0 max-h-[90%] rounded-t-2xl border-t border-border bg-background pb-8',
          className
        )}
        {...props}
      >
        <View {...panResponder.panHandlers} className="w-full items-center py-3">
          <View className="h-1.5 w-12 rounded-full bg-muted" />
        </View>
        {children}
      </Animated.View>
    </Modal>
  );
}

function DrawerHeader({ className, ...props }: ViewProps) {
  return <View className={cn('gap-1.5 p-4', className)} {...props} />;
}

function DrawerFooter({ className, ...props }: ViewProps) {
  return <View className={cn('mt-auto gap-2 p-4', className)} {...props} />;
}

function DrawerTitle({ className, ...props }: React.ComponentProps<typeof Text>) {
  return (
    <Text
      role="heading"
      aria-level={2}
      className={cn('text-lg font-semibold text-foreground', className)}
      {...props}
    />
  );
}

function DrawerDescription({
  className,
  ...props
}: React.ComponentProps<typeof Text>) {
  return (
    <Text className={cn('text-sm text-muted-foreground', className)} {...props} />
  );
}

export {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  useDrawer,
};
