import { Minus } from 'lucide-react-native';
import * as React from 'react';
import { Pressable, TextInput, View, type ViewProps } from 'react-native';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

type InputOTPContextValue = {
  value: string;
  maxLength: number;
  isFocused: boolean;
  focus: () => void;
  slotIndex: { current: number };
};

const InputOTPContext = React.createContext<InputOTPContextValue | null>(null);

function useInputOTP() {
  const context = React.useContext(InputOTPContext);
  if (!context) {
    throw new Error('InputOTP compound components must be used within <InputOTP />');
  }
  return context;
}

type InputOTPProps = ViewProps & {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  maxLength: number;
  autoFocus?: boolean;
  editable?: boolean;
};

function InputOTP({
  className,
  value: valueProp,
  defaultValue = '',
  onChange,
  onComplete,
  maxLength,
  autoFocus,
  editable = true,
  children,
  ...props
}: InputOTPProps) {
  const inputRef = React.useRef<TextInput>(null);
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const [isFocused, setIsFocused] = React.useState(false);
  const value = valueProp ?? internalValue;

  const handleChange = (next: string) => {
    const sanitized = next.replace(/[^0-9a-zA-Z]/g, '').slice(0, maxLength);
    if (valueProp === undefined) {
      setInternalValue(sanitized);
    }
    onChange?.(sanitized);
    if (sanitized.length === maxLength) {
      onComplete?.(sanitized);
    }
  };

  const focus = () => inputRef.current?.focus();

  // Slot index counter is reset each render so InputOTPSlot instances can
  // derive their position without explicit index props.
  const slotIndex = { current: 0 };

  return (
    <InputOTPContext.Provider value={{ value, maxLength, isFocused, focus, slotIndex }}>
      <Pressable onPress={focus} disabled={!editable}>
        <View
          className={cn(
            'flex-row items-center gap-2',
            !editable && 'opacity-50',
            className
          )}
          {...props}
        >
          {children}
        </View>
        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={handleChange}
          maxLength={maxLength}
          keyboardType="number-pad"
          autoComplete="one-time-code"
          textContentType="oneTimeCode"
          autoFocus={autoFocus}
          editable={editable}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="absolute h-px w-px opacity-0"
          accessibilityLabel="One-time password input"
        />
      </Pressable>
    </InputOTPContext.Provider>
  );
}

function InputOTPGroup({ className, ...props }: ViewProps) {
  return <View className={cn('flex-row items-center', className)} {...props} />;
}

function InputOTPSlot({
  className,
  index,
  ...props
}: ViewProps & { index: number }) {
  const { value, isFocused } = useInputOTP();
  const char = value[index];
  const isActive = isFocused && value.length === index;

  return (
    <View
      className={cn(
        'h-12 w-10 items-center justify-center border-y border-r border-input bg-background first:rounded-l-md first:border-l last:rounded-r-md',
        index === 0 && 'rounded-l-md border-l',
        isActive && 'border-2 border-ring',
        className
      )}
      {...props}
    >
      {char ? (
        <Text className="text-lg font-medium">{char}</Text>
      ) : isActive ? (
        <View className="h-5 w-px bg-foreground" />
      ) : null}
    </View>
  );
}

function InputOTPSeparator({ className, ...props }: ViewProps) {
  return (
    <View role="presentation" className={cn('px-1', className)} {...props}>
      <Minus size={16} className="text-muted-foreground" />
    </View>
  );
}

export { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot };
