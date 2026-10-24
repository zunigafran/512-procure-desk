import { TextClassContext } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import * as NavigationMenuPrimitive from "@rn-primitives/navigation-menu";
import { cva } from "class-variance-authority";
import { ChevronDown } from "lucide-react-native";
import * as React from "react";
import { View } from "react-native";

function NavigationMenu({
  className,
  children,
  ...props
}: NavigationMenuPrimitive.RootProps & {
  ref?: React.RefObject<NavigationMenuPrimitive.RootRef>;
}) {
  return (
    <NavigationMenuPrimitive.Root
      className={cn(
        "relative z-10 flex-row max-w-max items-center justify-center",
        className,
      )}
      {...props}
    >
      {children}
    </NavigationMenuPrimitive.Root>
  );
}

function NavigationMenuList({
  className,
  ...props
}: NavigationMenuPrimitive.ListProps & {
  ref?: React.RefObject<NavigationMenuPrimitive.ListRef>;
}) {
  return (
    <NavigationMenuPrimitive.List
      className={cn(
        "web:group flex-row flex-1 items-center justify-center gap-1",
        className,
      )}
      {...props}
    />
  );
}

const NavigationMenuItem = NavigationMenuPrimitive.Item;

const navigationMenuTriggerStyle = cva(
  "web:group h-10 native:h-12 flex-row items-center justify-center rounded-md bg-background px-4 py-2 web:transition-colors web:hover:bg-accent active:bg-accent web:focus:bg-accent web:focus:outline-none",
);

function NavigationMenuTrigger({
  className,
  children,
  ...props
}: NavigationMenuPrimitive.TriggerProps & {
  ref?: React.RefObject<NavigationMenuPrimitive.TriggerRef>;
}) {
  const { value } = NavigationMenuPrimitive.useRootContext();
  const { value: itemValue } = NavigationMenuPrimitive.useItemContext();

  return (
    <TextClassContext.Provider value="text-sm native:text-base font-medium text-foreground">
      <NavigationMenuPrimitive.Trigger
        className={cn(navigationMenuTriggerStyle(), "gap-1.5", className)}
        {...props}
      >
        {children as React.ReactNode}
        <ChevronDown
          size={12}
          className={cn(
            "text-foreground web:transition-transform",
            value === itemValue && "rotate-180",
          )}
          aria-hidden
        />
      </NavigationMenuPrimitive.Trigger>
    </TextClassContext.Provider>
  );
}

function NavigationMenuContent({
  className,
  portalHost,
  ...props
}: NavigationMenuPrimitive.ContentProps & {
  ref?: React.RefObject<NavigationMenuPrimitive.ContentRef>;
  portalHost?: string;
}) {
  return (
    <NavigationMenuPrimitive.Portal hostName={portalHost}>
      <NavigationMenuPrimitive.Content
        className={cn(
          "z-50 w-full rounded-md border border-border bg-popover p-4 shadow-lg shadow-foreground/5",
          className,
        )}
        {...props}
      />
    </NavigationMenuPrimitive.Portal>
  );
}

function NavigationMenuLink({
  className,
  ...props
}: NavigationMenuPrimitive.LinkProps & {
  ref?: React.RefObject<NavigationMenuPrimitive.LinkRef>;
}) {
  return (
    <TextClassContext.Provider value="text-sm native:text-base text-foreground">
      <NavigationMenuPrimitive.Link
        className={cn(
          "rounded-md p-2 web:transition-colors web:hover:bg-accent active:bg-accent web:focus:bg-accent web:outline-none",
          className,
        )}
        {...props}
      />
    </TextClassContext.Provider>
  );
}

function NavigationMenuIndicator({
  className,
  ...props
}: NavigationMenuPrimitive.IndicatorProps & {
  ref?: React.RefObject<NavigationMenuPrimitive.IndicatorRef>;
}) {
  return (
    <NavigationMenuPrimitive.Indicator
      className={cn(
        "top-full z-[1] h-1.5 items-center justify-center overflow-hidden",
        className,
      )}
      {...props}
    >
      <View className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md shadow-foreground/5" />
    </NavigationMenuPrimitive.Indicator>
  );
}

export {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
};

