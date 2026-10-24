import { View, type ViewProps } from "react-native";

import { ThemeColor, themeBackgroundClass } from "@/constants/theme";
import { cn } from "@/lib/utils";

export type ContainerProps = ViewProps & {
  type?: ThemeColor;
};

export function Container({
  style,
  className,
  type = "background",
  ...otherProps
}: ContainerProps) {
  return (
    <View
      className={cn("flex-1 flex-row", themeBackgroundClass[type], className)}
      style={style}
      {...otherProps}
    />
  );
}
