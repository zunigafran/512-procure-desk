import * as React from 'react';
import { Animated, Easing, View, type ViewProps } from 'react-native';
import { cn } from '@/lib/utils';

function Skeleton({
  className,
  ...props
}: ViewProps & {
  ref?: React.RefObject<View>;
}) {
  const [opacity] = React.useState(() => new Animated.Value(1));

  React.useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.5,
          duration: 750,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 750,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={{ opacity }}
      className={cn('rounded-md bg-muted', className)}
      {...props}
    />
  );
}

export { Skeleton };
