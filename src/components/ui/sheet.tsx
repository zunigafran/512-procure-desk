import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react-native';
import * as React from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Modal,
  Pressable,
  View,
  type ViewProps,
} from 'react-native';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

type SheetContextValue = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const SheetContext = React.createContext<SheetContextValue | null>(null);

function useSheet() {
  const context = React.useContext(SheetContext);
  if (!context) {
    throw new Error('Sheet compound components must be used within <Sheet />');
  }
  return context;
}

type SheetProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
};

function Sheet({ open: openProp, defaultOpen = false, onOpenChange, children }: SheetProps) {
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
    <SheetContext.Provider value={{ open, onOpenChange: handleOpenChange }}>
      {children}
    </SheetContext.Provider>
  );
}

function SheetTrigger({
  onPress,
  ...props
}: React.ComponentProps<typeof Pressable>) {
  const { onOpenChange } = useSheet();
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

function SheetClose({
  onPress,
  ...props
}: React.ComponentProps<typeof Pressable>) {
  const { onOpenChange } = useSheet();
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

const sheetContentVariants = cva('absolute bg-background p-6 shadow-lg', {
  variants: {
    side: {
      top: 'left-0 right-0 top-0 rounded-b-xl border-b border-border',
      bottom: 'left-0 right-0 bottom-0 rounded-t-xl border-t border-border',
      left: 'top-0 bottom-0 left-0 w-3/4 max-w-sm border-r border-border',
      right: 'top-0 bottom-0 right-0 w-3/4 max-w-sm border-l border-border',
    },
  },
  defaultVariants: {
    side: 'right',
  },
});

type SheetContentProps = ViewProps &
  VariantProps<typeof sheetContentVariants> & {
    showCloseButton?: boolean;
  };

function SheetContent({
  className,
  side = 'right',
  showCloseButton = true,
  children,
  ...props
}: SheetContentProps) {
  const { open, onOpenChange } = useSheet();

  const dimension =
    side === 'left' || side === 'right'
      ? Dimensions.get('window').width
      : Dimensions.get('window').height;
  const hiddenOffset =
    side === 'right' || side === 'bottom' ? dimension : -dimension;

  const [translate] = React.useState(() => new Animated.Value(hiddenOffset));
  // Stays true while the close animation plays so the Modal isn't unmounted mid-slide.
  const [visible, setVisible] = React.useState(open);
  if (open && !visible) setVisible(true);

  React.useEffect(() => {
    if (open) {
      translate.setValue(hiddenOffset);
      Animated.timing(translate, {
        toValue: 0,
        duration: 250,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    } else if (visible) {
      Animated.timing(translate, {
        toValue: hiddenOffset,
        duration: 200,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) setVisible(false);
      });
    }
  }, [open, hiddenOffset, translate, visible]);

  if (!visible) return null;

  const translateStyle =
    side === 'left' || side === 'right'
      ? { transform: [{ translateX: translate }] }
      : { transform: [{ translateY: translate }] };

  return (
    <Modal transparent visible={visible} onRequestClose={() => onOpenChange(false)}>
      <Pressable
        className="flex-1 bg-black/50"
        onPress={() => onOpenChange(false)}
      />
      <Animated.View
        style={translateStyle}
        className={cn(sheetContentVariants({ side }), className)}
        {...props}
      >
        {children}
        {showCloseButton ? (
          <Pressable
            accessibilityLabel="Close"
            onPress={() => onOpenChange(false)}
            className="absolute right-4 top-4 h-8 w-8 items-center justify-center rounded-sm opacity-70 active:opacity-100 web:hover:opacity-100"
          >
            <X size={18} className="text-foreground" />
          </Pressable>
        ) : null}
      </Animated.View>
    </Modal>
  );
}

function SheetHeader({ className, ...props }: ViewProps) {
  return <View className={cn('gap-1.5', className)} {...props} />;
}

function SheetFooter({ className, ...props }: ViewProps) {
  return (
    <View className={cn('mt-auto flex-col-reverse gap-2 pt-4', className)} {...props} />
  );
}

function SheetTitle({ className, ...props }: React.ComponentProps<typeof Text>) {
  return (
    <Text
      role="heading"
      aria-level={2}
      className={cn('text-lg font-semibold text-foreground', className)}
      {...props}
    />
  );
}

function SheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof Text>) {
  return (
    <Text className={cn('text-sm text-muted-foreground', className)} {...props} />
  );
}

export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  useSheet,
};
