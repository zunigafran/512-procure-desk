import { cn } from "@/lib/utils";
import * as CollapsiblePrimitive from "@rn-primitives/collapsible";
import { Platform } from "react-native";
import Animated, {
  FadeInUp,
  FadeOutUp,
  ReduceMotion,
} from "react-native-reanimated";

const motion = ReduceMotion.System;
const entering = FadeInUp.duration(250).reduceMotion(motion);
const exiting =
  Platform.OS === "web"
    ? undefined
    : FadeOutUp.duration(200).reduceMotion(motion);

const Collapsible = CollapsiblePrimitive.Root;

function CollapsibleTrigger({
  className,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Trigger>) {
  return (
    <CollapsiblePrimitive.Trigger
      className={cn("flex-row items-center justify-center", className)}
      {...props}
    />
  );
}

function CollapsibleContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Content>) {
  return (
    <CollapsiblePrimitive.Content {...props}>
      <Animated.View
        entering={entering}
        exiting={exiting}
        className={cn("overflow-hidden", className)}
      >
        {children}
      </Animated.View>
    </CollapsiblePrimitive.Content>
  );
}

export { Collapsible, CollapsibleContent, CollapsibleTrigger };
