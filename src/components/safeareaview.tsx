import { cssInterop } from "nativewind";
import {
  SafeAreaView as RNSafeAreaView,
  type SafeAreaViewProps,
} from "react-native-safe-area-context";

import { cn } from "@/lib/utils";

cssInterop(RNSafeAreaView, { className: "style" });

export function SafeAreaView({
  className,
  style,
  ...props
}: SafeAreaViewProps) {
  return (
    <RNSafeAreaView
      className={cn(
        "w-full flex-1 flex-col items-stretch gap-4 pb-4 max-w-[800px] ios:pb-[66px] android:pb-[96px]",
        className,
      )}
      style={style}
      {...props}
    />
  );
}
