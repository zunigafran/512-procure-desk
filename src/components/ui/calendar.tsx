import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import * as React from 'react';
import { Pressable, View, type ViewProps } from 'react-native';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

function isSameDay(a: Date | undefined, b: Date | undefined) {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function startOfDay(date: Date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

type CalendarProps = ViewProps & {
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  /** Month shown initially. Defaults to the selected date or today. */
  defaultMonth?: Date;
  minDate?: Date;
  maxDate?: Date;
  disabled?: (date: Date) => boolean;
  weekStartsOn?: 0 | 1;
};

function Calendar({
  className,
  selected,
  onSelect,
  defaultMonth,
  minDate,
  maxDate,
  disabled,
  weekStartsOn = 0,
  ...props
}: CalendarProps) {
  const today = startOfDay(new Date());
  const [viewDate, setViewDate] = React.useState(
    () => defaultMonth ?? selected ?? today
  );

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const daysOfWeek = React.useMemo(() => {
    if (weekStartsOn === 1) {
      return [...DAYS_OF_WEEK.slice(1), DAYS_OF_WEEK[0]];
    }
    return DAYS_OF_WEEK;
  }, [weekStartsOn]);

  const weeks = React.useMemo(() => {
    const firstOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    let leadingBlanks = firstOfMonth.getDay() - weekStartsOn;
    if (leadingBlanks < 0) leadingBlanks += 7;

    const cells: (Date | null)[] = [];
    for (let i = 0; i < leadingBlanks; i++) cells.push(null);
    for (let day = 1; day <= daysInMonth; day++) {
      cells.push(new Date(year, month, day));
    }
    while (cells.length % 7 !== 0) cells.push(null);

    const result: (Date | null)[][] = [];
    for (let i = 0; i < cells.length; i += 7) {
      result.push(cells.slice(i, i + 7));
    }
    return result;
  }, [year, month, weekStartsOn]);

  const isDisabled = (date: Date) => {
    if (minDate && startOfDay(date) < startOfDay(minDate)) return true;
    if (maxDate && startOfDay(date) > startOfDay(maxDate)) return true;
    return disabled?.(date) ?? false;
  };

  return (
    <View className={cn('w-full max-w-sm rounded-md p-3', className)} {...props}>
      <View className="mb-4 flex-row items-center justify-between">
        <Pressable
          accessibilityLabel="Previous month"
          onPress={() => setViewDate(new Date(year, month - 1, 1))}
          className="h-8 w-8 items-center justify-center rounded-md border border-input active:bg-accent web:hover:bg-accent"
        >
          <ChevronLeft size={16} className="text-foreground" />
        </Pressable>
        <Text className="text-sm font-medium">
          {MONTHS[month]} {year}
        </Text>
        <Pressable
          accessibilityLabel="Next month"
          onPress={() => setViewDate(new Date(year, month + 1, 1))}
          className="h-8 w-8 items-center justify-center rounded-md border border-input active:bg-accent web:hover:bg-accent"
        >
          <ChevronRight size={16} className="text-foreground" />
        </Pressable>
      </View>
      <View className="mb-1 flex-row">
        {daysOfWeek.map((day) => (
          <View key={day} className="flex-1 items-center py-1">
            <Text className="text-xs font-normal text-muted-foreground">{day}</Text>
          </View>
        ))}
      </View>
      {weeks.map((week, weekIndex) => (
        <View key={weekIndex} className="flex-row">
          {week.map((date, dayIndex) => {
            if (!date) {
              return <View key={dayIndex} className="h-10 flex-1" />;
            }
            const isSelected = isSameDay(date, selected);
            const isToday = isSameDay(date, today);
            const dateDisabled = isDisabled(date);
            return (
              <Pressable
                key={dayIndex}
                disabled={dateDisabled}
                onPress={() =>
                  onSelect?.(isSelected ? undefined : startOfDay(date))
                }
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected, disabled: dateDisabled }}
                className={cn(
                  'h-10 flex-1 items-center justify-center rounded-md',
                  isSelected
                    ? 'bg-primary'
                    : isToday
                      ? 'bg-accent'
                      : 'active:bg-accent web:hover:bg-accent',
                  dateDisabled && 'opacity-40'
                )}
              >
                <Text
                  className={cn(
                    'text-sm',
                    isSelected && 'font-medium text-primary-foreground'
                  )}
                >
                  {date.getDate()}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}

export { Calendar };
export type { CalendarProps };
