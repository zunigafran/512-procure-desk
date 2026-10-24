import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import * as React from "react";
import {
  FlatList,
  Pressable,
  View,
  useWindowDimensions,
  type FlatListProps,
  type ViewProps,
} from "react-native";

type CarouselLoopMode = boolean | "after-end";

type CarouselContextValue = {
  currentIndex: number;
  itemCount: number;
  itemWidth: number;
  centerInset: number;
  loop: boolean;
  loopMode: CarouselLoopMode;
  infiniteRef: React.RefObject<boolean>;
  unlockLoop: () => void;
  scrollToIndex: (index: number) => void;
  setCurrentIndex: (index: number) => void;
  setItemCount: (count: number) => void;
  listRef: React.RefObject<FlatList<unknown> | null>;
};

const CarouselContext = React.createContext<CarouselContextValue | null>(null);
const CarouselCellContext = React.createContext(false);

const controlClassName =
  "absolute top-1/2 z-10 h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background shadow-sm active:bg-accent web:hover:bg-accent";

function useCarousel() {
  const context = React.useContext(CarouselContext);
  if (!context) {
    throw new Error(
      "Carousel compound components must be used within <Carousel />",
    );
  }
  return context;
}

function wrapIndex(index: number, count: number) {
  return ((index % count) + count) % count;
}

function clampIndex(index: number, count: number) {
  return Math.min(Math.max(index, 0), Math.max(count - 1, 0));
}

function repeatList<T>(data: ArrayLike<T>) {
  const items = Array.from(data);
  return items.concat(items, items);
}

function isConcealedClone(rawIndex: number, count: number) {
  return Math.floor(rawIndex / count) !== 1 && rawIndex % count === count - 1;
}

function Carousel({
  className,
  itemWidth: itemWidthProp,
  itemWidthRatio,
  align = "start",
  loop = false,
  children,
  ...props
}: ViewProps & {
  itemWidth?: number;
  itemWidthRatio?: number;
  align?: "start" | "center";
  loop?: CarouselLoopMode;
}) {
  const { width: windowWidth } = useWindowDimensions();
  const [containerWidth, setContainerWidth] = React.useState(windowWidth);
  const itemWidth =
    itemWidthProp ??
    (itemWidthRatio != null ? containerWidth * itemWidthRatio : containerWidth);
  const centerInset =
    align === "center" && itemWidth > 0
      ? Math.max(0, (containerWidth - itemWidth) / 2)
      : 0;
  const [currentIndex, setCurrentIndexState] = React.useState(0);
  const [itemCount, setItemCountState] = React.useState(0);
  const [infinite, setInfinite] = React.useState(loop === true);
  const listRef = React.useRef<FlatList<unknown>>(null);
  const itemCountRef = React.useRef(0);
  const infiniteRef = React.useRef(loop === true);
  const prepared = (loop === true || loop === "after-end") && itemWidth > 0;
  const preparedRef = React.useRef(prepared);

  const setCurrentIndex = React.useCallback((index: number) => {
    setCurrentIndexState((prev) => (prev === index ? prev : index));
  }, []);

  const setItemCount = React.useCallback((count: number) => {
    itemCountRef.current = count;
    setItemCountState((prev) => (prev === count ? prev : count));
  }, []);

  const unlockLoop = React.useCallback(() => {
    if (infiniteRef.current) {
      return;
    }
    infiniteRef.current = true;
    setInfinite(true);
  }, []);

  React.useEffect(() => {
    infiniteRef.current = infinite;
    preparedRef.current = prepared;
  }, [infinite, prepared]);

  const scrollToIndex = React.useCallback(
    (index: number) => {
      const count = itemCountRef.current;
      const copiesReady = preparedRef.current && count > 1;
      const next =
        infiniteRef.current && copiesReady
          ? wrapIndex(index, count)
          : clampIndex(index, count);
      listRef.current?.scrollToOffset({
        offset: (copiesReady ? count + next : next) * itemWidth,
        animated: true,
      });
      setCurrentIndex(next);
    },
    [itemWidth, setCurrentIndex],
  );

  return (
    <CarouselContext.Provider
      value={{
        currentIndex,
        itemCount,
        itemWidth,
        centerInset,
        loop: infinite && prepared,
        loopMode: loop,
        infiniteRef,
        unlockLoop,
        scrollToIndex,
        setCurrentIndex,
        setItemCount,
        listRef,
      }}
    >
      <View
        className={cn("relative w-full", className)}
        {...props}
        onLayout={(event) => {
          setContainerWidth(event.nativeEvent.layout.width);
          props.onLayout?.(event);
        }}
      >
        {children}
      </View>
    </CarouselContext.Provider>
  );
}

function CarouselContent<T>({
  className,
  data,
  renderItem,
  keyExtractor,
  contentContainerStyle,
  ...props
}: Omit<FlatListProps<T>, "horizontal" | "pagingEnabled"> & {
  className?: string;
}) {
  const {
    itemWidth,
    centerInset,
    loopMode,
    loop,
    currentIndex,
    setItemCount,
    setCurrentIndex,
    listRef,
    unlockLoop,
    infiniteRef,
  } = useCarousel();
  const realCount = data?.length ?? 0;
  const prepared =
    (loopMode === true || loopMode === "after-end") &&
    itemWidth > 0 &&
    realCount > 1;
  const currentIndexRef = React.useRef(currentIndex);
  const listData = React.useMemo(
    () => (data && prepared ? repeatList(data) : data),
    [data, prepared],
  );

  const logicalIndex = React.useCallback(
    (rawIndex: number) =>
      prepared ? wrapIndex(rawIndex, realCount) : rawIndex,
    [prepared, realCount],
  );

  const scrollToRaw = React.useCallback(
    (rawIndex: number, animated: boolean) => {
      listRef.current?.scrollToOffset({
        offset: rawIndex * itemWidth,
        animated,
      });
    },
    [itemWidth, listRef],
  );

  React.useEffect(() => {
    setItemCount(realCount);
  }, [realCount, setItemCount]);

  React.useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  React.useEffect(() => {
    if (!prepared) {
      return;
    }
    const frame = requestAnimationFrame(() => {
      const index = clampIndex(currentIndexRef.current, realCount);
      scrollToRaw(realCount + index, false);
      setCurrentIndex(index);
    });
    return () => cancelAnimationFrame(frame);
  }, [prepared, realCount, scrollToRaw, setCurrentIndex]);

  const settle = React.useCallback(
    (offset: number) => {
      if (!itemWidth) {
        return;
      }
      let rawIndex = Math.round(offset / itemWidth);
      if (!prepared) {
        setCurrentIndex(rawIndex);
        return;
      }
      if (!infiniteRef.current) {
        const min = realCount;
        const max = realCount * 2 - 1;
        if (rawIndex < min || rawIndex > max) {
          rawIndex = Math.min(max, Math.max(min, rawIndex));
          scrollToRaw(rawIndex, true);
        }
        const next = rawIndex - realCount;
        setCurrentIndex(next);
        if (next === realCount - 1) {
          unlockLoop();
        }
        return;
      }
      if (rawIndex < realCount || rawIndex >= realCount * 2) {
        rawIndex = realCount + wrapIndex(rawIndex, realCount);
        scrollToRaw(rawIndex, false);
      }
      setCurrentIndex(rawIndex % realCount);
    },
    [itemWidth, prepared, realCount, scrollToRaw, setCurrentIndex, unlockLoop],
  );

  const handleScroll = React.useCallback(
    (offset: number) => {
      if (!itemWidth) {
        return;
      }
      const next = logicalIndex(Math.round(offset / itemWidth));
      setCurrentIndex(next);
      if (loopMode === "after-end" && next === realCount - 1) {
        unlockLoop();
      }
    },
    [itemWidth, logicalIndex, loopMode, realCount, setCurrentIndex, unlockLoop],
  );

  return (
    <FlatList
      ref={listRef as React.RefObject<FlatList<T>>}
      data={listData}
      horizontal
      pagingEnabled={false}
      snapToInterval={itemWidth || undefined}
      decelerationRate="fast"
      disableIntervalMomentum={itemWidth > 0}
      showsHorizontalScrollIndicator={false}
      scrollEventThrottle={16}
      initialScrollIndex={prepared ? realCount : undefined}
      getItemLayout={
        itemWidth > 0
          ? (_, index) => ({
              length: itemWidth,
              offset: itemWidth * index,
              index,
            })
          : undefined
      }
      onScroll={(event) => {
        handleScroll(event.nativeEvent.contentOffset.x);
      }}
      onMomentumScrollEnd={(event) => {
        settle(event.nativeEvent.contentOffset.x);
      }}
      className={cn("w-full", className)}
      {...props}
      contentContainerStyle={
        centerInset > 0
          ? [contentContainerStyle, { paddingHorizontal: centerInset }]
          : contentContainerStyle
      }
      keyExtractor={
        keyExtractor
          ? (item, index) =>
              `${keyExtractor(item, logicalIndex(index))}-${index}`
          : undefined
      }
      renderItem={
        renderItem
          ? (info) => (
              <CarouselCellContext.Provider
                value={
                  loopMode === "after-end" &&
                  !loop &&
                  realCount > 1 &&
                  isConcealedClone(info.index, realCount)
                }
              >
                {renderItem({
                  ...info,
                  index: logicalIndex(info.index),
                })}
              </CarouselCellContext.Provider>
            )
          : undefined
      }
    />
  );
}

function CarouselItem({ className, style, ...props }: ViewProps) {
  const { itemWidth } = useCarousel();
  return (
    <View
      className={cn("items-center justify-center", className)}
      style={[itemWidth ? { width: itemWidth } : null, style]}
      {...props}
    />
  );
}

function CarouselSlide({
  index,
  className,
  style,
  ...props
}: ViewProps & { index: number }) {
  const { currentIndex } = useCarousel();
  const concealed = React.useContext(CarouselCellContext);
  const active = index === currentIndex;

  return (
    <CarouselItem
      className={cn("px-2", className)}
      pointerEvents={concealed ? "none" : "auto"}
      style={[
        concealed ? { opacity: 0 } : active ? null : { opacity: 0.3 },
        style,
      ]}
      {...props}
    />
  );
}

function CarouselLoop({ onReachEnd }: { onReachEnd: () => void }) {
  const { currentIndex, itemCount, loop } = useCarousel();

  React.useEffect(() => {
    if (!loop && itemCount > 1 && currentIndex === itemCount - 1) {
      onReachEnd();
    }
  }, [currentIndex, itemCount, loop, onReachEnd]);

  return null;
}

function CarouselControl({
  direction,
  className,
  ...props
}: ViewProps & { direction: "previous" | "next" }) {
  const { currentIndex, itemCount, loop, scrollToIndex } = useCarousel();
  const previous = direction === "previous";
  const disabled = !loop && currentIndex >= itemCount - 1;
  if (previous && !loop && currentIndex <= 0) {
    return null;
  }
  const Icon = previous ? ChevronLeft : ChevronRight;

  return (
    <Pressable
      accessibilityLabel={previous ? "Previous slide" : "Next slide"}
      disabled={!previous && disabled}
      onPress={() => scrollToIndex(currentIndex + (previous ? -1 : 1))}
      className={cn(
        controlClassName,
        previous ? "left-2" : "right-2",
        !previous && disabled && "opacity-40",
        className,
      )}
      {...(props as React.ComponentProps<typeof Pressable>)}
    >
      <Icon size={18} className="text-foreground" />
    </Pressable>
  );
}

function CarouselPrevious(props: ViewProps) {
  return <CarouselControl direction="previous" {...props} />;
}

function CarouselNext(props: ViewProps) {
  return <CarouselControl direction="next" {...props} />;
}

function CarouselDots({ className, ...props }: ViewProps) {
  const { currentIndex, itemCount, scrollToIndex } = useCarousel();
  return (
    <View
      className={cn(
        "mt-3 flex-row items-center justify-center gap-1.5",
        className,
      )}
      {...props}
    >
      {Array.from({ length: itemCount }).map((_, index) => (
        <Pressable
          key={index}
          accessibilityLabel={`Go to slide ${index + 1}`}
          onPress={() => scrollToIndex(index)}
          className={cn(
            "h-2 w-2 rounded-full",
            index === currentIndex ? "bg-primary" : "bg-muted",
          )}
        />
      ))}
    </View>
  );
}

export {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselLoop,
  CarouselNext,
  CarouselPrevious,
  CarouselSlide,
  useCarousel
};

