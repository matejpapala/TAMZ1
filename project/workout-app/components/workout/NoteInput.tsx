import { StyleSheet, TextInput, View } from "react-native";
import { tokens } from "@/theme/tokens";
import { SeedsConstants } from "@/constants/SeedsConstants";
import { useTranslation } from "react-i18next";

interface NoteInputProps {
  value: string;
  onChange: (v: string) => void;
}

export function NoteInput({ value, onChange }: NoteInputProps) {
  const { t } = useTranslation();
  return (
    <View style={styles.wrap}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        placeholder={t("workout.note") + "…"}
        placeholderTextColor={tokens.muted}
        multiline
        accessibilityLabel={t("workout.note")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: SeedsConstants.margin10 },
  input: {
    backgroundColor: tokens.bg3,
    borderRadius: SeedsConstants.borderRadius8,
    padding: SeedsConstants.margin12,
    fontSize: SeedsConstants.fontSize13,
    color: tokens.text,
    minHeight: 48,
  },
});
