import { GripVertical } from 'lucide-react-native';
import * as React from 'react';
import {
  View,
  type GestureResponderEvent,
  type LayoutChangeEvent,
  type ViewProps,
} from 'react-native';
import { cn } from '@/lib/utils';

type Orientation = 'horizontal' | 'vertical';

type ResizableContextValue = {
  orientation: Orientation;
  /** First panel size as a fraction of the container (0-1). */
  ratio: number;
  setRatio: (ratio: number) => void;
  containerSize: number;
};

const ResizableContext = React.createContext<ResizableContextValue | null>(null);

function useResizable() {
  const context = React.useContext(ResizableContext);
  if (!context) {
    throw new Error(
      'Resizable compound components must be used within <ResizablePanelGroup />'
    );
  }
  return context;
}

type ResizablePanelGroupProps = ViewProps & {
  direction?: Orientation;
  /** Initial size of the first panel as a percentage (0-100). */
  defaultSize?: number;
  minSize?: number;
  maxSize?: number;
  onResize?: (ratio: number) => void;
};

function ResizablePanelGroup({
  className,
  direction = 'horizontal',
  defaultSize = 50,
  minSize = 10,
  maxSize = 90,
  onResize,
  children,
  ...props
}: ResizablePanelGroupProps) {
  const [ratio, setRatioState] = React.useState(defaultSize / 100);
  const [containerSize, setContainerSize] = React.useState(0);

  const setRatio = React.useCallback(
    (next: number) => {
      const clamped = Math.min(maxSize / 100, Math.max(minSize / 100, next));
      setRatioState(clamped);
      onResize?.(clamped);
    },
    [minSize, maxSize, onResize]
  );

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setContainerSize(direction === 'horizontal' ? width : height);
  };

  return (
    <ResizableContext.Provider
      value={{ orientation: direction, ratio, setRatio, containerSize }}
    >
      <View
        onLayout={handleLayout}
        className={cn(
          'flex-1',
          direction === 'horizontal' ? 'flex-row' : 'flex-col',
          className
        )}
        {...props}
      >
        {children}
      </View>
    </ResizableContext.Provider>
  );
}

type ResizablePanelProps = ViewProps & {
  /** Panels are laid out in order; the first gets `ratio`, the second gets the rest. */
  index?: 0 | 1;
};

function ResizablePanel({ className, index = 0, style, ...props }: ResizablePanelProps) {
  const { ratio } = useResizable();
  const flex = index === 0 ? ratio : 1 - ratio;
  return (
    <View
      className={cn('overflow-hidden', className)}
      style={[{ flex }, style]}
      {...props}
    />
  );
}

function ResizableHandle({
  className,
  withHandle,
  ...props
}: ViewProps & { withHandle?: boolean }) {
  const { orientation, ratio, setRatio, containerSize } = useResizable();
  // Snapshot taken when the drag starts; only touched inside responder handlers.
  const dragStart = React.useRef({ ratio, position: 0 });

  const positionOf = (event: GestureResponderEvent) =>
    orientation === 'horizontal' ? event.nativeEvent.pageX : event.nativeEvent.pageY;

  return (
    <View
      onStartShouldSetResponder={() => true}
      onMoveShouldSetResponder={() => true}
      onResponderTerminationRequest={() => false}
      onResponderGrant={(event) => {
        dragStart.current = { ratio, position: positionOf(event) };
      }}
      onResponderMove={(event) => {
        if (containerSize === 0) return;
        const delta = positionOf(event) - dragStart.current.position;
        setRatio(dragStart.current.ratio + delta / containerSize);
      }}
      className={cn(
        'items-center justify-center bg-border',
        orientation === 'horizontal' ? 'w-2' : 'h-2',
        className
      )}
      {...props}
    >
      {withHandle ? (
        <View
          className={cn(
            'z-10 items-center justify-center rounded-sm border border-border bg-background',
            orientation === 'horizontal' ? 'h-6 w-3' : 'h-3 w-6'
          )}
        >
          <GripVertical
            size={10}
            className={cn(
              'text-muted-foreground',
              orientation === 'vertical' && 'rotate-90'
            )}
          />
        </View>
      ) : null}
    </View>
  );
}

export { ResizableHandle, ResizablePanel, ResizablePanelGroup };
