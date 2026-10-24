import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from "react-native";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "./ui/button";
import { Carousel, CarouselContent, CarouselSlide } from "./ui/carousel";
import { Collapsible, CollapsibleTrigger } from "./ui/collapsible";
import { Separator } from "./ui/separator";
import { Text } from "./ui/text";

const LINKS = [
  "Products",
  "Spaces",
  "Projects",
  "Virtual Showroom",
  "Contact",
] as const;

const HEADER =
  "absolute inset-x-0 top-0 z-20 border-b border-white/[0.12] text-white backdrop-blur-[10px]";

const EASE = Easing.bezier(0.25, 0.1, 0.25, 1);

export function useHeaderScroll() {
  const [collapsed, setCollapsed] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const lastY = useRef(0);

  const onScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const y = event.nativeEvent.contentOffset.y;
      const dy = y - lastY.current;

      if (y <= 8) {
        setCollapsed(false);
        lastY.current = y;
        return;
      }

      if (dy > 12) {
        setCollapsed(true);
        setRevealed(false);
        lastY.current = y;
      } else if (dy < -12) {
        setCollapsed(false);
        lastY.current = y;
      }
    },
    [],
  );

  return {
    collapsed: collapsed && !revealed,
    onScroll,
    onReveal: () => setRevealed(true),
  };
}

function NavLink({
  label,
  className,
  onPress,
}: {
  label: string;
  className?: string;
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} className={className}>
      {({ pressed }) => (
        <Text
          className={`text-[12.5px] uppercase tracking-[1.8px] ${pressed ? "text-[#e8c547]" : "text-white"}`}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

export default function MobileNavbar({
  collapsed = false,
  onReveal,
}: {
  collapsed?: boolean;
  onReveal?: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuShown, setMenuShown] = useState(false);
  const [barHeight, setBarHeight] = useState(0);
  const [fullHeight, setFullHeight] = useState(0);
  const [wasCollapsed, setWasCollapsed] = useState(collapsed);

  if (collapsed !== wasCollapsed) {
    setWasCollapsed(collapsed);
    if (collapsed) setMenuOpen(false);
  }
  if (menuOpen && !menuShown) setMenuShown(true);
  const { height } = useWindowDimensions();
  const { top } = useSafeAreaInsets();
  const menuHeight = Math.max(0, height - top - barHeight);
  const openHeight = useSharedValue(0);
  const headerHeight = useSharedValue(-1);
  const measured = useRef(false);

  useEffect(() => {
    openHeight.value = withTiming(
      menuOpen ? menuHeight : 0,
      { duration: 200 },
      (finished) => {
        if (finished && !menuOpen) runOnJS(setMenuShown)(false);
      },
    );
  }, [menuOpen, menuHeight, openHeight]);

  useEffect(() => {
    if (fullHeight <= 0) return;
    const target = collapsed ? fullHeight * 0.5 : fullHeight;
    headerHeight.value = measured.current
      ? withTiming(target, { duration: 300, easing: EASE })
      : target;
    measured.current = true;
  }, [collapsed, fullHeight, headerHeight]);

  const menuStyle = useAnimatedStyle(() => ({ height: openHeight.value }));
  const headerStyle = useAnimatedStyle(() =>
    headerHeight.value < 0 ? {} : { height: headerHeight.value },
  );

  return (
    <Animated.View
      id="mobile-header"
      className={HEADER}
      style={[
        {
          backgroundColor: "transparent",
          overflow: menuShown && !collapsed ? "visible" : "hidden",
        },
        headerStyle,
      ]}
    >
      <LinearGradient
        colors={["rgba(17, 17, 17, 1)", "rgba(17, 17, 17, 0)"]}
        pointerEvents="none"
        style={StyleSheet.absoluteFill}
      />
      <Collapsible
        open={menuOpen}
        onOpenChange={setMenuOpen}
        onLayout={(event) => {
          if (collapsed) return;
          const next = event.nativeEvent.layout.height;
          setFullHeight((current) =>
            Math.abs(current - next) < 1 ? current : next,
          );
        }}
        style={{ paddingTop: top }}
      >
        <View className="w-full max-w-[1180px] self-center">
          <View
            className="flex-row items-center justify-between"
            onLayout={(event) => setBarHeight(event.nativeEvent.layout.height)}
          >
            <Text className="px-6 py-[14px] text-[19px] font-bold tracking-[8px] text-white">
              512
            </Text>
            <View className="flex-row items-center pr-1">
              <Button variant="ghost" className="native:px-4">
                <Text className="text-2xl font-bold text-white">Login</Text>
              </Button>
              <CollapsibleTrigger
                accessibilityLabel="Toggle menu"
                className="h-12 w-12 items-center justify-center"
              >
                <Text className="text-center text-2xl font-bold leading-8 text-white">
                  {menuOpen ? "✕" : "☰"}
                </Text>
              </CollapsibleTrigger>
            </View>
          </View>
          <Separator />
          <Carousel
            className="w-full"
            itemWidthRatio={2.25 / LINKS.length}
            align="center"
            loop="after-end"
          >
            <CarouselContent
              data={LINKS}
              keyExtractor={(label) => label}
              renderItem={({ item, index }) => (
                <CarouselSlide index={index}>
                  <NavLink label={item} className="shrink-0 py-3" />
                </CarouselSlide>
              )}
            />
          </Carousel>
          <Animated.View
            pointerEvents={menuOpen ? "auto" : "none"}
            className="absolute inset-x-0 z-30 border-t border-white/[0.35] bg-[#51514F]"
            style={[{ top: barHeight, overflow: "hidden" }, menuStyle]}
          >
            {menuShown
              ? LINKS.map((label) => (
                  <NavLink
                    key={label}
                    label={label}
                    onPress={() => setMenuOpen(false)}
                    className="px-5 py-4"
                  />
                ))
              : null}
          </Animated.View>
        </View>
      </Collapsible>
      {collapsed ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Show menu"
          onPress={onReveal}
          style={StyleSheet.absoluteFill}
        />
      ) : null}
    </Animated.View>
  );
}
