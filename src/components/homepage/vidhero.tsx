import { Image } from "expo-image";
import { StyleSheet, useWindowDimensions } from "react-native";
import { Button } from "../ui/button";
import { Text } from "../ui/text";
import { View } from "../ui/view";

const VidHero = () => {
  const { height } = useWindowDimensions();

  return (
    <View
      className="relative w-full flex-1 items-center justify-center px-[2rem] pt-[12rem] overflow-hidden"
      style={{ minHeight: height }}
    >
      <Image
        source={{
          uri: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=80" as string,
        }}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        contentPosition="center"
        pointerEvents="none"
        accessibilityLabel="Architectural Interior"
      />
      <View
        id="hero-overlay"
        pointerEvents="none"
        className="absolute inset-0 bg-black opacity-50"
      />
      <View
        id="hero-content"
        className="relative w-full max-w-[720px] items-center justify-center gap-y-4"
      >
        <Text
          id="eyebrow"
          variant="subtitle"
          className="w-full text-center uppercase tracking-widest mb-[0.85rem] color-amber-300 font-normal"
        >
          Material Procurement
        </Text>
        <Text
          variant="title"
          className="w-full text-center mb-[0.85rem] text-white tracking-widest"
        >
          Site Hero
        </Text>
        <Text
          id="hero-sub"
          variant="subtitle"
          className="w-full text-center mb-8 text-white max-w-[36rem] pb-[2rem]"
        >
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
          quos.
        </Text>
        <Button variant="default" className="self-center bg-amber-300">
          <Text
            variant="button"
            className="text-center text-black tracking-widest uppercase"
          >
            Discover More
          </Text>
        </Button>
      </View>
    </View>
  );
};

export default VidHero;
