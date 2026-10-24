import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react-native';
import * as React from 'react';
import { View, type ViewProps } from 'react-native';
import { Button, type ButtonProps } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

function Pagination({ className, ...props }: ViewProps) {
  return (
    <View
      role="navigation"
      aria-label="pagination"
      className={cn('w-full flex-row justify-center', className)}
      {...props}
    />
  );
}

function PaginationContent({ className, ...props }: ViewProps) {
  return (
    <View
      role="list"
      className={cn('flex-row items-center gap-1', className)}
      {...props}
    />
  );
}

function PaginationItem({ className, ...props }: ViewProps) {
  return <View role="listitem" className={className} {...props} />;
}

type PaginationLinkProps = ButtonProps & {
  isActive?: boolean;
};

function PaginationLink({
  className,
  isActive,
  size = 'icon',
  ...props
}: PaginationLinkProps) {
  return (
    <Button
      aria-current={isActive ? 'page' : undefined}
      variant={isActive ? 'outline' : 'ghost'}
      size={size}
      className={className}
      {...props}
    />
  );
}

function PaginationPrevious({ className, ...props }: PaginationLinkProps) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={cn('flex-row gap-1 pl-2.5', className)}
      {...props}
    >
      <ChevronLeft size={16} className="text-foreground" />
      <Text>Previous</Text>
    </PaginationLink>
  );
}

function PaginationNext({ className, ...props }: PaginationLinkProps) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={cn('flex-row gap-1 pr-2.5', className)}
      {...props}
    >
      <Text>Next</Text>
      <ChevronRight size={16} className="text-foreground" />
    </PaginationLink>
  );
}

function PaginationEllipsis({ className, ...props }: ViewProps) {
  return (
    <View
      aria-hidden
      className={cn('h-9 w-9 items-center justify-center', className)}
      {...props}
    >
      <MoreHorizontal size={16} className="text-muted-foreground" />
    </View>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
