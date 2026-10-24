import * as React from 'react';
import {
  View,
  type GestureResponderEvent,
  type LayoutChangeEvent,
  type ViewProps,
} from 'react-native';
import { cn } from '@/lib/utils';

type SliderProps = Omit<ViewProps, 'children'> & {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  onValueCommit?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
};

function Slider({
  className,
  value: valueProp,
  defaultValue = 0,
  onValueChange,
  onValueCommit,
  min = 0,
  max = 100,
  step = 1,
  disabled,
  ...props
}: SliderProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const value = valueProp ?? internalValue;
  const trackWidth = React.useRef(0);

  const clamp = (raw: number) => {
    const stepped = Math.round(raw / step) * step;
    return Math.min(max, Math.max(min, stepped));
  };

  // Only called from responder handlers, so reading the layout ref here is safe.
  const updateFromEvent = (event: GestureResponderEvent) => {
    const width = trackWidth.current;
    if (width === 0) return value;
    const ratio = Math.min(1, Math.max(0, event.nativeEvent.locationX / width));
    const next = clamp(min + ratio * (max - min));
    if (valueProp === undefined) setInternalValue(next);
    onValueChange?.(next);
    return next;
  };

  const handleLayout = (event: LayoutChangeEvent) => {
    trackWidth.current = event.nativeEvent.layout.width;
  };

  const percentage = max === min ? 0 : ((value - min) / (max - min)) * 100;

  return (
    <View
      accessibilityRole="adjustable"
      accessibilityValue={{ min, max, now: value }}
      className={cn(
        'h-10 w-full justify-center',
        disabled && 'opacity-50',
        className
      )}
      onLayout={handleLayout}
      onStartShouldSetResponder={() => !disabled}
      onMoveShouldSetResponder={() => !disabled}
      onResponderTerminationRequest={() => false}
      onResponderGrant={updateFromEvent}
      onResponderMove={updateFromEvent}
      onResponderRelease={(event) => {
        onValueCommit?.(updateFromEvent(event));
      }}
      {...props}
    >
      <View className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
        <View
          className="h-full rounded-full bg-primary"
          style={{ width: `${percentage}%` }}
        />
      </View>
      <View
        pointerEvents="none"
        className="absolute h-5 w-5 rounded-full border-2 border-primary bg-background shadow-sm shadow-foreground/20"
        style={{ left: `${percentage}%`, marginLeft: -10 }}
      />
    </View>
  );
}

export { Slider };
export type { SliderProps };
