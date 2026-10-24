import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { ChevronRight, MoreHorizontal } from "lucide-react-native";
import * as React from "react";
import { Pressable, View, type ViewProps } from "react-native";

function Breadcrumb({ className, ...props }: ViewProps) {
  return (
    <View
      role="navigation"
      aria-label="breadcrumb"
      className={className}
      {...props}
    />
  );
}

function BreadcrumbList({ className, ...props }: ViewProps) {
  return (
    <View
      role="list"
      className={cn(
        "flex-row flex-wrap items-center gap-1.5 sm:gap-2.5",
        className,
      )}
      {...props}
    />
  );
}

function BreadcrumbItem({ className, ...props }: ViewProps) {
  return (
    <View
      role="listitem"
      className={cn("flex-row items-center gap-1.5", className)}
      {...props}
    />
  );
}

function BreadcrumbLink({
  className,
  onPress,
  disabled,
  children,
  ...props
}: React.ComponentProps<typeof Pressable> & {
  className?: string;
}) {
  return (
    <Pressable
      role="link"
      onPress={onPress}
      disabled={disabled}
      className={cn("web:transition-colors", className)}
      {...props}
    >
      {typeof children === "string" ? (
        <Text className="text-sm text-muted-foreground web:hover:text-foreground active:text-foreground">
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
}

function BreadcrumbPage({
  className,
  ...props
}: React.ComponentProps<typeof Text>) {
  return (
    <Text
      role="link"
      aria-disabled
      aria-current="page"
      className={cn("text-sm font-normal text-foreground", className)}
      {...props}
    />
  );
}

function BreadcrumbSeparator({
  children,
  className,
  ...props
}: ViewProps & { children?: React.ReactNode }) {
  return (
    <View
      role="presentation"
      aria-hidden
      className={cn("items-center justify-center", className)}
      {...props}
    >
      {children ?? <ChevronRight size={14} className="text-muted-foreground" />}
    </View>
  );
}

function BreadcrumbEllipsis({ className, ...props }: ViewProps) {
  return (
    <View
      role="presentation"
      aria-hidden
      className={cn("h-9 w-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontal size={16} className="text-muted-foreground" />
    </View>
  );
}

export {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
};

