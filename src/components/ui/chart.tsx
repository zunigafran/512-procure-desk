import * as React from 'react';
import { View, type ViewProps } from 'react-native';
import Svg, { Circle, G, Path, Rect, Line as SvgLine } from 'react-native-svg';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

type ChartConfig = Record<
  string,
  {
    label: string;
    color: string;
  }
>;

type ChartDataPoint = {
  label: string;
  [key: string]: string | number;
};

const ChartContext = React.createContext<{ config: ChartConfig } | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);
  if (!context) {
    throw new Error('Chart components must be used within <ChartContainer />');
  }
  return context;
}

function ChartContainer({
  className,
  config,
  children,
  ...props
}: ViewProps & { config: ChartConfig }) {
  return (
    <ChartContext.Provider value={{ config }}>
      <View className={cn('w-full gap-3', className)} {...props}>
        {children}
      </View>
    </ChartContext.Provider>
  );
}

function ChartLegend({ className, ...props }: ViewProps) {
  const { config } = useChart();
  return (
    <View
      className={cn('flex-row flex-wrap items-center justify-center gap-4', className)}
      {...props}
    >
      {Object.entries(config).map(([key, item]) => (
        <View key={key} className="flex-row items-center gap-1.5">
          <View
            className="h-2.5 w-2.5 rounded-[2px]"
            style={{ backgroundColor: item.color }}
          />
          <Text className="text-xs text-muted-foreground">{item.label}</Text>
        </View>
      ))}
    </View>
  );
}

type ChartDimensions = {
  width: number;
  height: number;
};

function useContainerWidth(): [ChartDimensions, (event: { nativeEvent: { layout: { width: number } } }) => void, number] {
  const [width, setWidth] = React.useState(0);
  const onLayout = React.useCallback(
    (event: { nativeEvent: { layout: { width: number } } }) => {
      setWidth(event.nativeEvent.layout.width);
    },
    []
  );
  return [{ width, height: 200 }, onLayout, width];
}

type BarChartProps = ViewProps & {
  data: ChartDataPoint[];
  /** Keys in each data point to render as bar series. Must exist in the chart config. */
  dataKeys: string[];
  height?: number;
  showLabels?: boolean;
};

function ChartBar({
  className,
  data,
  dataKeys,
  height = 200,
  showLabels = true,
  ...props
}: BarChartProps) {
  const { config } = useChart();
  const [, onLayout, width] = useContainerWidth();

  const maxValue = Math.max(
    1,
    ...data.flatMap((point) => dataKeys.map((key) => Number(point[key]) || 0))
  );

  const chartHeight = height - (showLabels ? 24 : 0);
  const groupWidth = data.length > 0 ? width / data.length : 0;
  const barGap = 4;
  const barWidth = Math.max(
    2,
    (groupWidth - barGap * (dataKeys.length + 1)) / dataKeys.length
  );

  return (
    <View className={cn('w-full', className)} onLayout={onLayout} {...props}>
      {width > 0 ? (
        <Svg width={width} height={height}>
          {[0.25, 0.5, 0.75, 1].map((ratio) => (
            <SvgLine
              key={ratio}
              x1={0}
              x2={width}
              y1={chartHeight * (1 - ratio)}
              y2={chartHeight * (1 - ratio)}
              stroke="hsl(240 5.9% 90%)"
              strokeWidth={0.5}
            />
          ))}
          {data.map((point, groupIndex) => (
            <G key={groupIndex} x={groupIndex * groupWidth}>
              {dataKeys.map((key, seriesIndex) => {
                const value = Number(point[key]) || 0;
                const barHeight = (value / maxValue) * (chartHeight - 8);
                return (
                  <Rect
                    key={key}
                    x={barGap + seriesIndex * (barWidth + barGap)}
                    y={chartHeight - barHeight}
                    width={barWidth}
                    height={barHeight}
                    rx={3}
                    fill={config[key]?.color ?? 'hsl(240 5.9% 10%)'}
                  />
                );
              })}
            </G>
          ))}
        </Svg>
      ) : null}
      {showLabels ? (
        <View className="flex-row">
          {data.map((point, index) => (
            <View key={index} className="flex-1 items-center">
              <Text className="text-xs text-muted-foreground" numberOfLines={1}>
                {point.label}
              </Text>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

type LineChartProps = ViewProps & {
  data: ChartDataPoint[];
  dataKeys: string[];
  height?: number;
  showLabels?: boolean;
  showDots?: boolean;
};

function ChartLine({
  className,
  data,
  dataKeys,
  height = 200,
  showLabels = true,
  showDots = true,
  ...props
}: LineChartProps) {
  const { config } = useChart();
  const [, onLayout, width] = useContainerWidth();

  const maxValue = Math.max(
    1,
    ...data.flatMap((point) => dataKeys.map((key) => Number(point[key]) || 0))
  );

  const chartHeight = height - (showLabels ? 24 : 0);
  const stepX = data.length > 1 ? width / (data.length - 1) : width;

  const pointsFor = (key: string) =>
    data.map((point, index) => ({
      x: index * stepX,
      y: chartHeight - ((Number(point[key]) || 0) / maxValue) * (chartHeight - 8),
    }));

  return (
    <View className={cn('w-full', className)} onLayout={onLayout} {...props}>
      {width > 0 ? (
        <Svg width={width} height={height}>
          {[0.25, 0.5, 0.75, 1].map((ratio) => (
            <SvgLine
              key={ratio}
              x1={0}
              x2={width}
              y1={chartHeight * (1 - ratio)}
              y2={chartHeight * (1 - ratio)}
              stroke="hsl(240 5.9% 90%)"
              strokeWidth={0.5}
            />
          ))}
          {dataKeys.map((key) => {
            const points = pointsFor(key);
            const d = points
              .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`)
              .join(' ');
            const color = config[key]?.color ?? 'hsl(240 5.9% 10%)';
            return (
              <G key={key}>
                <Path d={d} stroke={color} strokeWidth={2} fill="none" />
                {showDots
                  ? points.map((p, i) => (
                      <Circle key={i} cx={p.x} cy={p.y} r={3} fill={color} />
                    ))
                  : null}
              </G>
            );
          })}
        </Svg>
      ) : null}
      {showLabels ? (
        <View className="flex-row justify-between">
          {data.map((point, index) => (
            <Text key={index} className="text-xs text-muted-foreground">
              {point.label}
            </Text>
          ))}
        </View>
      ) : null}
    </View>
  );
}

type PieChartProps = ViewProps & {
  data: { key: string; value: number }[];
  size?: number;
  /** Inner radius ratio (0 for pie, e.g. 0.6 for donut). */
  innerRadiusRatio?: number;
};

function ChartPie({
  className,
  data,
  size = 180,
  innerRadiusRatio = 0,
  ...props
}: PieChartProps) {
  const { config } = useChart();
  const total = data.reduce((sum, item) => sum + item.value, 0) || 1;
  const radius = size / 2;
  const innerRadius = radius * innerRadiusRatio;

  // Each slice starts where the previous one ended; -PI/2 puts the first slice at 12 o'clock.
  const startAngles = data.reduce<number[]>(
    (angles, item, index) =>
      index === 0
        ? [-Math.PI / 2]
        : [...angles, angles[index - 1] + (data[index - 1].value / total) * Math.PI * 2],
    []
  );

  const slices = data.map((item, index) => {
    const angle = (item.value / total) * Math.PI * 2;
    const startAngle = startAngles[index];
    const endAngle = startAngle + angle;

    const largeArc = angle > Math.PI ? 1 : 0;
    const x1 = radius + radius * Math.cos(startAngle);
    const y1 = radius + radius * Math.sin(startAngle);
    const x2 = radius + radius * Math.cos(endAngle);
    const y2 = radius + radius * Math.sin(endAngle);

    let d: string;
    if (innerRadius > 0) {
      const ix1 = radius + innerRadius * Math.cos(endAngle);
      const iy1 = radius + innerRadius * Math.sin(endAngle);
      const ix2 = radius + innerRadius * Math.cos(startAngle);
      const iy2 = radius + innerRadius * Math.sin(startAngle);
      d = [
        `M${x1},${y1}`,
        `A${radius},${radius} 0 ${largeArc} 1 ${x2},${y2}`,
        `L${ix1},${iy1}`,
        `A${innerRadius},${innerRadius} 0 ${largeArc} 0 ${ix2},${iy2}`,
        'Z',
      ].join(' ');
    } else {
      d = [
        `M${radius},${radius}`,
        `L${x1},${y1}`,
        `A${radius},${radius} 0 ${largeArc} 1 ${x2},${y2}`,
        'Z',
      ].join(' ');
    }

    return {
      d,
      color: config[item.key]?.color ?? 'hsl(240 5.9% 10%)',
      key: item.key,
    };
  });

  return (
    <View className={cn('items-center', className)} {...props}>
      <Svg width={size} height={size}>
        {slices.map((slice) => (
          <Path key={slice.key} d={slice.d} fill={slice.color} />
        ))}
      </Svg>
    </View>
  );
}

export { ChartBar, ChartContainer, ChartLegend, ChartLine, ChartPie, useChart };
export type { ChartConfig, ChartDataPoint };
