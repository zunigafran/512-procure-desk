import type * as PopoverPrimitive from '@rn-primitives/popover';
import { Calendar as CalendarIcon } from 'lucide-react-native';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, type CalendarProps } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

type DatePickerProps = Omit<CalendarProps, 'selected' | 'onSelect'> & {
  value?: Date;
  onValueChange?: (date: Date | undefined) => void;
  placeholder?: string;
  formatDate?: (date: Date) => string;
  disabledTrigger?: boolean;
  triggerClassName?: string;
  portalHost?: string;
};

function defaultFormatDate(date: Date) {
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function DatePicker({
  value,
  onValueChange,
  placeholder = 'Pick a date',
  formatDate = defaultFormatDate,
  disabledTrigger,
  triggerClassName,
  portalHost,
  ...calendarProps
}: DatePickerProps) {
  const triggerRef = React.useRef<PopoverPrimitive.TriggerRef>(null);

  return (
    <Popover>
      <PopoverTrigger ref={triggerRef} asChild>
        <Button
          variant="outline"
          disabled={disabledTrigger}
          className={cn(
            'w-full flex-row justify-start gap-2',
            triggerClassName
          )}
        >
          <CalendarIcon size={16} className="text-muted-foreground" />
          <Text
            className={cn(
              'text-sm native:text-base',
              !value && 'text-muted-foreground'
            )}
          >
            {value ? formatDate(value) : placeholder}
          </Text>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" portalHost={portalHost}>
        <Calendar
          selected={value}
          onSelect={(date) => {
            onValueChange?.(date);
            triggerRef.current?.close();
          }}
          {...calendarProps}
        />
      </PopoverContent>
    </Popover>
  );
}

export { DatePicker };
export type { DatePickerProps };
