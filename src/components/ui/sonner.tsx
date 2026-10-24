import { CircleAlert, CircleCheck, Info, TriangleAlert, X } from 'lucide-react-native';
import * as React from 'react';
import { Animated, Easing, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

type SonnerType = 'default' | 'success' | 'error' | 'warning' | 'info' | 'loading';

type SonnerToast = {
  id: number;
  type: SonnerType;
  title: string;
  description?: string;
  duration?: number;
};

type Listener = (toasts: SonnerToast[]) => void;

/**
 * Module-level store so `toast()` can be called from anywhere,
 * matching the sonner API. Render one <Toaster /> at the app root.
 */
const store = {
  toasts: [] as SonnerToast[],
  listeners: new Set<Listener>(),
  counter: 0,
  emit() {
    for (const listener of this.listeners) listener([...this.toasts]);
  },
  add(toast: Omit<SonnerToast, 'id'>) {
    const id = ++this.counter;
    this.toasts = [...this.toasts, { id, ...toast }];
    this.emit();
    const duration = toast.duration ?? (toast.type === 'loading' ? 0 : 4000);
    if (duration > 0) {
      setTimeout(() => this.remove(id), duration);
    }
    return id;
  },
  remove(id: number) {
    this.toasts = this.toasts.filter((item) => item.id !== id);
    this.emit();
  },
  update(id: number, patch: Partial<Omit<SonnerToast, 'id'>>) {
    this.toasts = this.toasts.map((item) =>
      item.id === id ? { ...item, ...patch } : item
    );
    this.emit();
  },
};

type ToastOptions = {
  description?: string;
  duration?: number;
};

function baseToast(title: string, options?: ToastOptions) {
  return store.add({ type: 'default', title, ...options });
}

const toast = Object.assign(baseToast, {
  success: (title: string, options?: ToastOptions) =>
    store.add({ type: 'success', title, ...options }),
  error: (title: string, options?: ToastOptions) =>
    store.add({ type: 'error', title, ...options }),
  warning: (title: string, options?: ToastOptions) =>
    store.add({ type: 'warning', title, ...options }),
  info: (title: string, options?: ToastOptions) =>
    store.add({ type: 'info', title, ...options }),
  loading: (title: string, options?: ToastOptions) =>
    store.add({ type: 'loading', title, ...options }),
  dismiss: (id: number) => store.remove(id),
  promise: async <T,>(
    promise: Promise<T>,
    messages: { loading: string; success: string; error: string }
  ) => {
    const id = store.add({ type: 'loading', title: messages.loading });
    try {
      const result = await promise;
      store.update(id, { type: 'success', title: messages.success });
      setTimeout(() => store.remove(id), 4000);
      return result;
    } catch (error) {
      store.update(id, { type: 'error', title: messages.error });
      setTimeout(() => store.remove(id), 4000);
      throw error;
    }
  },
});

const ICONS: Record<SonnerType, React.ReactNode> = {
  default: null,
  success: <CircleCheck size={18} className="text-green-600" />,
  error: <CircleAlert size={18} className="text-destructive" />,
  warning: <TriangleAlert size={18} className="text-amber-500" />,
  info: <Info size={18} className="text-blue-500" />,
  loading: <Spinner size="small" />,
};

function Toaster({
  position = 'bottom',
  className,
}: {
  position?: 'top' | 'bottom';
  className?: string;
}) {
  const [toasts, setToasts] = React.useState<SonnerToast[]>([]);
  const insets = useSafeAreaInsets();

  React.useEffect(() => {
    const listener: Listener = (next) => setToasts(next);
    store.listeners.add(listener);
    return () => {
      store.listeners.delete(listener);
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <View
      pointerEvents="box-none"
      className={cn('absolute inset-x-0 z-50 items-center gap-2 px-4', className)}
      style={
        position === 'top' ? { top: insets.top + 8 } : { bottom: insets.bottom + 8 }
      }
    >
      {toasts.map((item) => (
        <SonnerToastView
          key={item.id}
          toast={item}
          position={position}
          onDismiss={() => store.remove(item.id)}
        />
      ))}
    </View>
  );
}

function SonnerToastView({
  toast: item,
  position,
  onDismiss,
}: {
  toast: SonnerToast;
  position: 'top' | 'bottom';
  onDismiss: () => void;
}) {
  const [opacity] = React.useState(() => new Animated.Value(0));
  const [translateY] = React.useState(
    () => new Animated.Value(position === 'top' ? -16 : 16)
  );

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

  return (
    <Animated.View
      style={{ opacity, transform: [{ translateY }] }}
      className="w-full max-w-sm flex-row items-center gap-3 rounded-lg border border-border bg-background p-4 shadow-lg shadow-foreground/10"
    >
      {ICONS[item.type]}
      <View className="flex-1 gap-0.5">
        <Text className="text-sm font-medium">{item.title}</Text>
        {item.description ? (
          <Text className="text-sm text-muted-foreground">{item.description}</Text>
        ) : null}
      </View>
      <Pressable
        accessibilityLabel="Dismiss notification"
        hitSlop={8}
        onPress={onDismiss}
        className="opacity-60 active:opacity-100 web:hover:opacity-100"
      >
        <X size={14} className="text-foreground" />
      </Pressable>
    </Animated.View>
  );
}

export { Toaster, toast };
export type { SonnerToast, SonnerType };
