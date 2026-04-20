import { SeedsConstants } from "@/constants/SeedsConstants";
import { tokens } from "@/theme/tokens";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{ flex: 1, backgroundColor: tokens.bg0, paddingTop: insets.top }}
    >
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: SeedsConstants.margin24 }}
      ></ScrollView>
    </View>
  );
}
