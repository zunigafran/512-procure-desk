import { cn } from '@/lib/utils';
import * as Slot from '@rn-primitives/slot';
import { View as RNView, type ViewProps } from 'react-native';

function View({
  className,
  asChild = false,
  ...props
}: ViewProps & {
  ref?: React.RefObject<RNView>;
  asChild?: boolean;
}) {
  const Component = asChild ? Slot.View : RNView;
  return <Component className={cn(className)} {...props} />;
}

View.displayName = 'View';

export { View };
export type { ViewProps };
