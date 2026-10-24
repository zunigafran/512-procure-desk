import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react-native';
import * as React from 'react';
import { FlatList, Pressable, View, type ViewProps } from 'react-native';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

type SortDirection = 'asc' | 'desc' | null;

type DataTableColumn<T> = {
  key: string;
  header: string;
  /** Fixed width in pixels; flex: 1 when omitted. */
  width?: number;
  sortable?: boolean;
  accessor?: (row: T) => string | number;
  cell?: (row: T) => React.ReactNode;
};

type DataTableProps<T> = ViewProps & {
  columns: DataTableColumn<T>[];
  data: T[];
  keyExtractor: (row: T, index: number) => string;
  onRowPress?: (row: T) => void;
  emptyText?: string;
};

function defaultAccessor<T>(row: T, key: string): string | number {
  const value = (row as Record<string, unknown>)[key];
  if (typeof value === 'number') return value;
  return String(value ?? '');
}

function DataTable<T>({
  className,
  columns,
  data,
  keyExtractor,
  onRowPress,
  emptyText = 'No results.',
  ...props
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = React.useState<string | null>(null);
  const [sortDirection, setSortDirection] = React.useState<SortDirection>(null);

  const toggleSort = (key: string) => {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDirection('asc');
    } else if (sortDirection === 'asc') {
      setSortDirection('desc');
    } else {
      setSortKey(null);
      setSortDirection(null);
    }
  };

  const sortedData = React.useMemo(() => {
    if (!sortKey || !sortDirection) return data;
    const column = columns.find((col) => col.key === sortKey);
    const accessor =
      column?.accessor ?? ((row: T) => defaultAccessor(row, sortKey));
    return [...data].sort((a, b) => {
      const aValue = accessor(a);
      const bValue = accessor(b);
      const comparison =
        typeof aValue === 'number' && typeof bValue === 'number'
          ? aValue - bValue
          : String(aValue).localeCompare(String(bValue));
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [data, sortKey, sortDirection, columns]);

  return (
    <View
      className={cn('overflow-hidden rounded-md border border-border', className)}
      {...props}
    >
      <Table aria-labelledby="data-table">
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead
                key={column.key}
                style={column.width ? { width: column.width } : { flex: 1 }}
              >
                {column.sortable ? (
                  <Pressable
                    onPress={() => toggleSort(column.key)}
                    className="flex-row items-center gap-1"
                  >
                    <Text className="text-sm font-medium text-muted-foreground">
                      {column.header}
                    </Text>
                    {sortKey === column.key ? (
                      sortDirection === 'asc' ? (
                        <ArrowUp size={14} className="text-foreground" />
                      ) : (
                        <ArrowDown size={14} className="text-foreground" />
                      )
                    ) : (
                      <ArrowUpDown size={14} className="text-muted-foreground" />
                    )}
                  </Pressable>
                ) : (
                  <Text className="text-sm font-medium text-muted-foreground">
                    {column.header}
                  </Text>
                )}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.length === 0 ? (
            <View className="items-center py-8">
              <Text className="text-sm text-muted-foreground">{emptyText}</Text>
            </View>
          ) : (
            <FlatList
              data={sortedData}
              keyExtractor={keyExtractor}
              renderItem={({ item }) => (
                <TableRow
                  onPress={onRowPress ? () => onRowPress(item) : undefined}
                  className={cn(onRowPress && 'active:bg-muted/50')}
                >
                  {columns.map((column) => (
                    <TableCell
                      key={column.key}
                      style={column.width ? { width: column.width } : { flex: 1 }}
                    >
                      {column.cell ? (
                        column.cell(item)
                      ) : (
                        <Text className="text-sm">
                          {String(
                            column.accessor
                              ? column.accessor(item)
                              : defaultAccessor(item, column.key)
                          )}
                        </Text>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              )}
            />
          )}
        </TableBody>
      </Table>
    </View>
  );
}

export { DataTable };
export type { DataTableColumn, DataTableProps };
