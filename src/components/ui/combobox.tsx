import type * as PopoverPrimitive from '@rn-primitives/popover';
import { Check, ChevronsUpDown } from 'lucide-react-native';
import * as React from 'react';
import { View } from 'react-native';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

type ComboboxOption = {
  value: string;
  label: string;
};

type ComboboxProps = {
  options: ComboboxOption[];
  value?: string;
  onValueChange?: (value: string | undefined) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  disabled?: boolean;
  className?: string;
  portalHost?: string;
};

function Combobox({
  options,
  value,
  onValueChange,
  placeholder = 'Select an option...',
  searchPlaceholder = 'Search...',
  emptyText = 'No results found.',
  disabled,
  className,
  portalHost,
}: ComboboxProps) {
  const triggerRef = React.useRef<PopoverPrimitive.TriggerRef>(null);
  const [open, setOpen] = React.useState(false);
  const selected = options.find((option) => option.value === value);

  return (
    <Popover onOpenChange={setOpen}>
      <PopoverTrigger ref={triggerRef} asChild>
        <Button
          variant="outline"
          disabled={disabled}
          role="combobox"
          aria-expanded={open}
          className={cn('w-full flex-row justify-between', className)}
        >
          <Text
            className={cn(
              'text-sm native:text-base',
              !selected && 'text-muted-foreground'
            )}
            numberOfLines={1}
          >
            {selected?.label ?? placeholder}
          </Text>
          <ChevronsUpDown size={16} className="text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" portalHost={portalHost}>
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            {options.map((option) => (
              <CommandItem
                key={option.value}
                value={option.label}
                onPress={() => {
                  onValueChange?.(option.value === value ? undefined : option.value);
                  triggerRef.current?.close();
                }}
              >
                <View className="w-4">
                  {option.value === value ? (
                    <Check size={16} className="text-foreground" />
                  ) : null}
                </View>
                <Text>{option.label}</Text>
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export { Combobox };
export type { ComboboxOption, ComboboxProps };
