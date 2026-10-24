import * as SelectPrimitive from '@rn-primitives/select';
import { Check, ChevronDown } from 'lucide-react-native';
import * as React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { cn } from '@/lib/utils';

/**
 * Select built on the native-feeling @rn-primitives/select. On iOS/Android the
 * options render in a themed overlay; on web it renders a listbox.
 */
const NativeSelect = SelectPrimitive.Root;
const NativeSelectGroup = SelectPrimitive.Group;
const NativeSelectValue = SelectPrimitive.Value;

function NativeSelectTrigger({
  className,
  children,
  ...props
}: SelectPrimitive.TriggerProps & {
  ref?: React.RefObject<SelectPrimitive.TriggerRef>;
  children?: React.ReactNode;
}) {
  return (
    <SelectPrimitive.Trigger
      className={cn(
        'h-10 native:h-12 w-full flex-row items-center justify-between rounded-md border border-input bg-background px-3 py-2 web:ring-offset-background web:focus:outline-none web:focus:ring-2 web:focus:ring-ring web:focus:ring-offset-2',
        props.disabled && 'opacity-50 web:cursor-not-allowed',
        className
      )}
      {...props}
    >
      {children as React.ReactNode}
      <ChevronDown size={16} aria-hidden className="text-foreground opacity-50" />
    </SelectPrimitive.Trigger>
  );
}

function NativeSelectContent({
  className,
  children,
  position = 'popper',
  portalHost,
  ...props
}: SelectPrimitive.ContentProps & {
  ref?: React.RefObject<SelectPrimitive.ContentRef>;
  portalHost?: string;
}) {
  return (
    <SelectPrimitive.Portal hostName={portalHost}>
      <SelectPrimitive.Overlay
        style={Platform.OS !== 'web' ? StyleSheet.absoluteFill : undefined}
      >
        <SelectPrimitive.Content
          className={cn(
            'relative z-50 max-h-96 min-w-[8rem] rounded-md border border-border bg-popover px-1 py-2 shadow-md shadow-foreground/10',
            position === 'popper' && 'data-[side=bottom]:translate-y-1',
            className
          )}
          position={position}
          {...props}
        >
          <SelectPrimitive.Viewport
            className={cn(
              'p-1',
              position === 'popper' && 'h-full w-full min-w-[var(--radix-select-trigger-width)]'
            )}
          >
            {children}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Overlay>
    </SelectPrimitive.Portal>
  );
}

function NativeSelectLabel({
  className,
  ...props
}: SelectPrimitive.LabelProps & {
  ref?: React.RefObject<SelectPrimitive.LabelRef>;
}) {
  return (
    <SelectPrimitive.Label
      className={cn(
        'py-1.5 native:pb-2 pl-8 native:pl-10 pr-2 text-sm native:text-base font-semibold text-popover-foreground',
        className
      )}
      {...props}
    />
  );
}

function NativeSelectItem({
  className,
  children,
  ...props
}: SelectPrimitive.ItemProps & {
  ref?: React.RefObject<SelectPrimitive.ItemRef>;
}) {
  return (
    <SelectPrimitive.Item
      className={cn(
        'relative w-full flex-row items-center rounded-sm py-1.5 native:py-2 pl-8 native:pl-10 pr-2 web:cursor-default web:select-none active:bg-accent web:hover:bg-accent web:focus:bg-accent web:outline-none',
        props.disabled && 'opacity-50 web:pointer-events-none',
        className
      )}
      {...props}
    >
      <View className="absolute left-2 native:left-3.5 h-3.5 w-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Check size={16} strokeWidth={3} className="text-popover-foreground" />
        </SelectPrimitive.ItemIndicator>
      </View>
      <SelectPrimitive.ItemText className="text-sm native:text-base text-popover-foreground web:group-focus:text-accent-foreground" />
    </SelectPrimitive.Item>
  );
}

function NativeSelectSeparator({
  className,
  ...props
}: SelectPrimitive.SeparatorProps & {
  ref?: React.RefObject<SelectPrimitive.SeparatorRef>;
}) {
  return (
    <SelectPrimitive.Separator
      className={cn('-mx-1 my-1 h-px bg-muted', className)}
      {...props}
    />
  );
}

export {
  NativeSelect,
  NativeSelectContent,
  NativeSelectGroup,
  NativeSelectItem,
  NativeSelectLabel,
  NativeSelectSeparator,
  NativeSelectTrigger,
  NativeSelectValue,
};
