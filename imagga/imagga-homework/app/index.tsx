import { useState } from "react";
import { View, Text, Button, FlatList, Image, StyleSheet, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Buffer } from "buffer";

const API_KEY = "acc_78857e1059ef280";
const API_SECRET = "67f6c2429c21353604e2ad87ef4a8c8b";
const AUTH_HEADER = "Basic " + Buffer.from(API_KEY + ":" + API_SECRET).toString("base64");

type Tag = {
  tag: { en: string };
  confidence: number;
};

export default function App() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.9,
    });

    if (!result.canceled) {
      analyzeImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Chyba", "Nemáme přístup k fotoaparátu.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({ quality: 0.9 });

    if (!result.canceled) {
      analyzeImage(result.assets[0].uri);
    }
  };

  const analyzeImage = async (uri: string) => {
    setImageUri(uri);
    setTags([]);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("image", {
        uri,
        type: "image/jpeg",
        name: "foto.jpg",
      } as unknown as Blob);

      const response = await fetch("https://api.imagga.com/v2/tags", {
        method: "POST",
        headers: { Authorization: AUTH_HEADER },
        body: formData,
      });

      const data = await response.json();
      const filtered = data.result.tags.filter((t: Tag) => t.confidence > 40);
      setTags(filtered);
    } catch (err) {
      Alert.alert("Chyba", "Analýza selhala, zkontroluj konzoli.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI Rozpoznávač</Text>

      <View style={styles.buttons}>
        <Button title="Vyfotit" onPress={takePhoto} />
        <Button title="Z galerie" onPress={pickImage} />
      </View>

      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}

      {loading && <Text>Analyzuji...</Text>}

      <FlatList
        data={tags}
        keyExtractor={(item) => item.tag.en}
        renderItem={({ item }) => (
          <Text style={styles.tag}>
            {item.tag.en} – {Math.round(item.confidence)} %
          </Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  buttons: { flexDirection: "row", gap: 12, marginBottom: 16 },
  image: { width: "100%", height: 250, borderRadius: 8, marginBottom: 16 },
  tag: { fontSize: 16, paddingVertical: 4 },
});
