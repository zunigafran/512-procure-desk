import { Separator } from "../ui/separator";
import { Text } from "../ui/text";
import { View } from "../ui/view";

const Kicker = () => {
  return (
    <View
      id="kicker"
      className="relative w-full bg-[#f8f8f8] px-4 pt-16 pb-8 items-center justify-center"
    >
      <Text className="w-full text-center mb-2 font-medium text-2xl">
        A different way of sourcing so you can focus on the flip.
      </Text>
      <Separator className="my-4 h-px w-1/2 bg-black" />
      <Text className="w-full text-center font-light text-lg">
        One-Stop-Shop for quality materials with finishes that last
      </Text>
    </View>
  );
};

export default Kicker;
