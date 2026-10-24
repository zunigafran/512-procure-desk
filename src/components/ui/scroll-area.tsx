import * as React from 'react';
import { ScrollView, type ScrollViewProps } from 'react-native';
import { cn } from '@/lib/utils';

type ScrollAreaProps = ScrollViewProps & {
  ref?: React.RefObject<ScrollView>;
  orientation?: 'vertical' | 'horizontal';
};

function ScrollArea({
  className,
  contentContainerClassName,
  orientation = 'vertical',
  ...props
}: ScrollAreaProps) {
  return (
    <ScrollView
      horizontal={orientation === 'horizontal'}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      className={cn('relative', className)}
      contentContainerClassName={contentContainerClassName}
      {...props}
    />
  );
}

export { ScrollArea };
