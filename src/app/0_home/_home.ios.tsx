import { Container } from "@/components/container";
import Kicker from "@/components/homepage/kicker";
import ProcureHero from "@/components/homepage/procurehero";
import SpacesSmall from "@/components/homepage/spacessmall";
import MobileNavbar, { useHeaderScroll } from "@/components/mobile-navbar";
import { ScrollView, View } from "react-native";

export default function HomeIOS() {
  const { collapsed, onScroll, onReveal } = useHeaderScroll();

  return (
    <Container>
      <View className="w-full flex-1">
        <ScrollView
          onScroll={onScroll}
          scrollEventThrottle={16}
          contentContainerStyle={{ flexGrow: 1 }}
          style={{ backgroundColor: "transparent" }}
          className="flex-1"
        >
          <ProcureHero />
          <Kicker />
          {/* <SpacesLarge /> */}
          <SpacesSmall />
        </ScrollView>
        <MobileNavbar collapsed={collapsed} onReveal={onReveal} />
      </View>
    </Container>
  );
}
