import { PanelLeft } from 'lucide-react-native';
import * as React from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Modal,
  Pressable,
  ScrollView,
  View,
  useWindowDimensions,
  type ViewProps,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Separator } from '@/components/ui/separator';
import { Text, TextClassContext } from '@/components/ui/text';
import { cn } from '@/lib/utils';

const SIDEBAR_WIDTH = 288;
const BREAKPOINT = 768;

type SidebarContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
  isLargeScreen: boolean;
};

const SidebarContext = React.createContext<SidebarContextValue | null>(null);

function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error('Sidebar compound components must be used within <SidebarProvider />');
  }
  return context;
}

function SidebarProvider({
  defaultOpen = true,
  children,
  className,
  ...props
}: ViewProps & { defaultOpen?: boolean }) {
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= BREAKPOINT;
  const [open, setOpen] = React.useState(defaultOpen && isLargeScreen);

  const toggle = React.useCallback(() => setOpen((current) => !current), []);

  return (
    <SidebarContext.Provider value={{ open, setOpen, toggle, isLargeScreen }}>
      <View className={cn('flex-1 flex-row', className)} {...props}>
        {children}
      </View>
    </SidebarContext.Provider>
  );
}

function Sidebar({ className, children, ...props }: ViewProps) {
  const { open, setOpen, isLargeScreen } = useSidebar();
  const insets = useSafeAreaInsets();
  const [translateX] = React.useState(() => new Animated.Value(-SIDEBAR_WIDTH));
  // Stays true while the close animation plays so the Modal isn't unmounted mid-slide.
  const [modalVisible, setModalVisible] = React.useState(false);
  if (!isLargeScreen && open && !modalVisible) setModalVisible(true);

  React.useEffect(() => {
    if (isLargeScreen) return;
    if (open) {
      translateX.setValue(-SIDEBAR_WIDTH);
      Animated.timing(translateX, {
        toValue: 0,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    } else if (modalVisible) {
      Animated.timing(translateX, {
        toValue: -SIDEBAR_WIDTH,
        duration: 180,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) setModalVisible(false);
      });
    }
  }, [open, isLargeScreen, translateX, modalVisible]);

  const content = (
    <View
      className={cn('flex-1 border-r border-border bg-muted/40', className)}
      style={{ paddingTop: insets.top }}
      {...props}
    >
      {children}
    </View>
  );

  if (isLargeScreen) {
    if (!open) return null;
    return <View style={{ width: SIDEBAR_WIDTH }}>{content}</View>;
  }

  return (
    <Modal
      transparent
      visible={modalVisible}
      onRequestClose={() => setOpen(false)}
    >
      <Pressable className="flex-1 bg-black/50" onPress={() => setOpen(false)} />
      <Animated.View
        style={{
          transform: [{ translateX }],
          width: SIDEBAR_WIDTH,
          height: Dimensions.get('window').height,
        }}
        className="absolute left-0 top-0 bg-background"
      >
        {content}
      </Animated.View>
    </Modal>
  );
}

function SidebarTrigger({
  className,
  onPress,
  ...props
}: React.ComponentProps<typeof Pressable> & { className?: string }) {
  const { toggle } = useSidebar();
  return (
    <Pressable
      accessibilityLabel="Toggle sidebar"
      onPress={(event) => {
        toggle();
        onPress?.(event);
      }}
      className={cn(
        'h-9 w-9 items-center justify-center rounded-md active:bg-accent web:hover:bg-accent',
        className
      )}
      {...props}
    >
      <PanelLeft size={18} className="text-foreground" />
    </Pressable>
  );
}

function SidebarInset({ className, ...props }: ViewProps) {
  return <View className={cn('flex-1 bg-background', className)} {...props} />;
}

function SidebarHeader({ className, ...props }: ViewProps) {
  return <View className={cn('gap-2 p-4', className)} {...props} />;
}

function SidebarContent({ className, ...props }: React.ComponentProps<typeof ScrollView>) {
  return (
    <ScrollView
      className={cn('flex-1', className)}
      showsVerticalScrollIndicator={false}
      {...props}
    />
  );
}

function SidebarFooter({ className, ...props }: ViewProps) {
  return <View className={cn('gap-2 border-t border-border p-4', className)} {...props} />;
}

function SidebarSeparator({ className }: { className?: string }) {
  return <Separator className={cn('mx-4 w-auto', className)} />;
}

function SidebarGroup({ className, ...props }: ViewProps) {
  return <View className={cn('gap-1 px-3 py-2', className)} {...props} />;
}

function SidebarGroupLabel({
  className,
  ...props
}: React.ComponentProps<typeof Text>) {
  return (
    <Text
      className={cn(
        'px-2 py-1.5 text-xs font-medium text-muted-foreground',
        className
      )}
      {...props}
    />
  );
}

function SidebarMenu({ className, ...props }: ViewProps) {
  return <View role="list" className={cn('gap-1', className)} {...props} />;
}

function SidebarMenuItem({ className, ...props }: ViewProps) {
  return <View role="listitem" className={className} {...props} />;
}

function SidebarMenuButton({
  className,
  isActive,
  children,
  ...props
}: React.ComponentProps<typeof Pressable> & {
  className?: string;
  isActive?: boolean;
}) {
  return (
    <TextClassContext.Provider
      value={cn('text-sm text-foreground', isActive && 'font-medium')}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ selected: isActive }}
        className={cn(
          'h-10 flex-row items-center gap-2 rounded-md px-2 active:bg-accent web:hover:bg-accent',
          isActive && 'bg-accent',
          className
        )}
        {...props}
      >
        {children}
      </Pressable>
    </TextClassContext.Provider>
  );
}

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
};
