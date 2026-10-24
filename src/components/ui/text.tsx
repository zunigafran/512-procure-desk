import { cn } from "@/lib/utils";
import * as Slot from "@rn-primitives/slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { Text as RNText } from "react-native";

const TextClassContext = React.createContext<string | undefined>(undefined);

const textVariants = cva("text-foreground web:select-text", {
  variants: {
    variant: {
      default: "text-base leading-6 font-medium",
      small: "text-sm leading-5 font-medium",
      smallBold: "text-sm leading-5 font-bold",
      link: "text-sm leading-[30px]",
      linkPrimary: "text-sm leading-[30px] text-[#3c87f7]",
      body: "text-base leading-6 font-medium",
      title: "text-5xl leading-[52px] font-light",
      subtitle: "text-sm leading-5 font-light",
      button: "native:text-[13px] leading-5 font-bold",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

function Text({
  className,
  asChild = false,
  variant,
  ...props
}: React.ComponentProps<typeof RNText> &
  VariantProps<typeof textVariants> & {
    ref?: React.RefObject<RNText>;
    asChild?: boolean;
  }) {
  const textClass = React.useContext(TextClassContext);
  const Component = asChild ? Slot.Text : RNText;
  return (
    <Component
      className={cn(textClass, textVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Text, TextClassContext, textVariants };
