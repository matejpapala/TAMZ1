import { ActivityCard, DashboardHeader, HeroWeekCard, StartCTAs, StatChips, TemplatesCard } from "@/components";
import { SeedsConstants } from "@/constants/SeedsConstants";
import { tokens } from "@/theme/tokens";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  const handleStartBlank = () => {
    console.log("start blank workout");
  };

  const handleStartTemplate = () => {
    console.log("start from template");
  };

  return (
    <View style={{ flex: 1, backgroundColor: tokens.bg0, paddingTop: insets.top }}>
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: SeedsConstants.margin24 }}
      >
        <DashboardHeader userName="Matej"></DashboardHeader>
        <StartCTAs onStartBlank={handleStartBlank} onStartTemplate={handleStartTemplate} />
        {/*<HeroWeekCard></HeroWeekCard>
        <StatChips></StatChips>
        <TemplatesCard></TemplatesCard>
        <ActivityCard></ActivityCard>*/}
      </ScrollView>
    </View>
  );
}
