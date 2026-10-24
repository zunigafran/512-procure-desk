import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react-native';
import * as React from 'react';
import { Animated, Easing, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

const toastVariants = cva(
  'w-full flex-row items-start gap-3 rounded-lg border p-4 shadow-lg shadow-foreground/10',
  {
    variants: {
      variant: {
        default: 'border-border bg-background',
        destructive: 'border-destructive bg-destructive',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

type ToastVariant = NonNullable<VariantProps<typeof toastVariants>['variant']>;

type ToastData = {
  id: number;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
  action?: {
    label: string;
    onPress: () => void;
  };
};

type ToastContextValue = {
  toast: (options: Omit<ToastData, 'id'>) => number;
  dismiss: (id: number) => void;
};

const ToastContext = React.createContext<ToastContextValue | null>(null);

function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within <ToastProvider />');
  }
  return context;
}

let toastId = 0;

function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastData[]>([]);

  const dismiss = React.useCallback((id: number) => {
    setToasts((current) => current.filter((item) => item.id !== id));
  }, []);

  const toast = React.useCallback(
    (options: Omit<ToastData, 'id'>) => {
      const id = ++toastId;
      setToasts((current) => [...current, { id, ...options }]);
      const duration = options.duration ?? 4000;
      if (duration > 0) {
        setTimeout(() => dismiss(id), duration);
      }
      return id;
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

function ToastViewport({
  toasts,
  onDismiss,
}: {
  toasts: ToastData[];
  onDismiss: (id: number) => void;
}) {
  const insets = useSafeAreaInsets();

  if (toasts.length === 0) return null;

  return (
    <View
      pointerEvents="box-none"
      className="absolute inset-x-0 z-50 gap-2 px-4"
      style={{ top: insets.top + 8 }}
    >
      {toasts.map((item) => (
        <Toast key={item.id} data={item} onDismiss={() => onDismiss(item.id)} />
      ))}
    </View>
  );
}

function Toast({ data, onDismiss }: { data: ToastData; onDismiss: () => void }) {
  const [opacity] = React.useState(() => new Animated.Value(0));
  const [translateY] = React.useState(() => new Animated.Value(-16));

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 200,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, translateY]);

  const isDestructive = data.variant === 'destructive';

  return (
    <Animated.View
      style={{ opacity, transform: [{ translateY }] }}
      className={cn(toastVariants({ variant: data.variant }))}
    >
      <View className="flex-1 gap-1">
        {data.title ? (
          <Text
            className={cn(
              'text-sm font-semibold',
              isDestructive && 'text-destructive-foreground'
            )}
          >
            {data.title}
          </Text>
        ) : null}
        {data.description ? (
          <Text
            className={cn(
              'text-sm',
              isDestructive ? 'text-destructive-foreground/90' : 'text-muted-foreground'
            )}
          >
            {data.description}
          </Text>
        ) : null}
      </View>
      {data.action ? (
        <Pressable
          onPress={() => {
            data.action?.onPress();
            onDismiss();
          }}
          className={cn(
            'h-8 items-center justify-center rounded-md border px-3',
            isDestructive ? 'border-destructive-foreground/40' : 'border-border'
          )}
        >
          <Text
            className={cn(
              'text-sm font-medium',
              isDestructive && 'text-destructive-foreground'
            )}
          >
            {data.action.label}
          </Text>
        </Pressable>
      ) : null}
      <Pressable
        accessibilityLabel="Dismiss notification"
        hitSlop={8}
        onPress={onDismiss}
        className="opacity-60 active:opacity-100 web:hover:opacity-100"
      >
        <X
          size={16}
          className={isDestructive ? 'text-destructive-foreground' : 'text-foreground'}
        />
      </Pressable>
    </Animated.View>
  );
}

export { ToastProvider, toastVariants, useToast };
export type { ToastData, ToastVariant };
