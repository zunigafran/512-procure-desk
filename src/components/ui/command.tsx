import { Search } from 'lucide-react-native';
import * as React from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  TextInput,
  View,
  type TextInputProps,
  type ViewProps,
} from 'react-native';
import { Text, TextClassContext } from '@/components/ui/text';
import { cn } from '@/lib/utils';

type CommandContextValue = {
  search: string;
  setSearch: (value: string) => void;
};

const CommandContext = React.createContext<CommandContextValue | null>(null);

function useCommand() {
  const context = React.useContext(CommandContext);
  if (!context) {
    throw new Error('Command compound components must be used within <Command />');
  }
  return context;
}

function Command({ className, ...props }: ViewProps) {
  const [search, setSearch] = React.useState('');
  return (
    <CommandContext.Provider value={{ search, setSearch }}>
      <View
        className={cn(
          'w-full flex-1 overflow-hidden rounded-md bg-popover',
          className
        )}
        {...props}
      />
    </CommandContext.Provider>
  );
}

function CommandDialog({
  open,
  onOpenChange,
  className,
  children,
  ...props
}: ViewProps & {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={() => onOpenChange(false)}
    >
      <Pressable
        className="flex-1 items-center justify-center bg-black/50 p-4"
        onPress={() => onOpenChange(false)}
      >
        <Pressable
          className={cn(
            'max-h-[70%] w-full max-w-lg overflow-hidden rounded-lg border border-border bg-popover shadow-lg',
            className
          )}
          onPress={(event) => event.stopPropagation()}
          {...props}
        >
          <Command className="flex-1">{children}</Command>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function CommandInput({
  className,
  placeholderClassName,
  ...props
}: TextInputProps) {
  const { search, setSearch } = useCommand();
  return (
    <View className="flex-row items-center gap-2 border-b border-border px-3">
      <Search size={16} className="text-muted-foreground" />
      <TextInput
        value={search}
        onChangeText={setSearch}
        className={cn(
          'h-11 native:h-12 flex-1 bg-transparent text-base native:text-lg text-foreground web:focus-visible:outline-none',
          className
        )}
        placeholderClassName={cn('text-muted-foreground', placeholderClassName)}
        {...props}
      />
    </View>
  );
}

function CommandList({ className, ...props }: React.ComponentProps<typeof ScrollView>) {
  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      className={cn('max-h-[300px]', className)}
      {...props}
    />
  );
}

function CommandEmpty({ className, children, ...props }: ViewProps) {
  return (
    <View className={cn('items-center py-6', className)} {...props}>
      {typeof children === 'string' ? (
        <Text className="text-sm text-muted-foreground">{children}</Text>
      ) : (
        children
      )}
    </View>
  );
}

function CommandGroup({
  className,
  heading,
  ...props
}: ViewProps & { heading?: string }) {
  return (
    <View className={cn('p-1', className)} {...props}>
      {heading ? (
        <Text className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
          {heading}
        </Text>
      ) : null}
      {props.children}
    </View>
  );
}

function CommandSeparator({ className, ...props }: ViewProps) {
  return <View className={cn('h-px bg-border', className)} {...props} />;
}

type CommandItemProps = React.ComponentProps<typeof Pressable> & {
  className?: string;
  /** Text used for filtering against the current search. Defaults to string children. */
  value?: string;
  disabled?: boolean;
};

function CommandItem({
  className,
  value,
  disabled,
  children,
  ...props
}: CommandItemProps) {
  const { search } = useCommand();

  const filterValue =
    value ?? (typeof children === 'string' ? children : undefined);

  if (
    search &&
    filterValue &&
    !filterValue.toLowerCase().includes(search.toLowerCase())
  ) {
    return null;
  }

  return (
    <TextClassContext.Provider value="text-sm native:text-base text-popover-foreground">
      <Pressable
        disabled={disabled}
        className={cn(
          'flex-row items-center gap-2 rounded-sm px-2 py-2.5 active:bg-accent web:hover:bg-accent',
          disabled && 'opacity-50',
          className
        )}
        {...props}
      >
        {typeof children === 'string' ? <Text>{children}</Text> : children}
      </Pressable>
    </TextClassContext.Provider>
  );
}

function CommandShortcut({
  className,
  ...props
}: React.ComponentProps<typeof Text>) {
  return (
    <Text
      className={cn('ml-auto text-xs tracking-widest text-muted-foreground', className)}
      {...props}
    />
  );
}

export {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
  useCommand,
};
