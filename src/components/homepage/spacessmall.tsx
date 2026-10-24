import { ArrowRightIcon } from "lucide-react-native";
import { Button } from "../ui/button";
import { Text } from "../ui/text";
import { View } from "../ui/view";

const SpacesSmall = () => {
  return (
    <View className="relative w-1/2 bg-red-500 px-4 py-16 items-center justify-center">
      <Text className="text-2xl font-medium mb-8 leading-tight text-center">
        Stunning Kitchens Spaces
      </Text>
      <Button
        variant="outline"
        className="flex-row items-center rounded-full gap-1"
      >
        <Text className="text-sm font-normal">View All</Text>
        <ArrowRightIcon size={16} />
      </Button>
    </View>
  );
};

export default SpacesSmall;
