import { useState } from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import BmiCard from './src/components/BmiCard';
import BmiResult from './src/components/BmiResult';
import BmiHistory from './src/components/BmiHistory';

export default function App() {
  const [result, setResult] = useState<number | null>(null);
  const [history, setHistory] = useState<number[]>([]);

  function handleResult(value: number | null) {
    setResult(value);
    if (value !== null) {
      setHistory([value, ...history]);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerText}>BMI kalkulačka</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <BmiCard
          calcText="Vypočítat BMI"
          resetText="Reset"
          onResult={handleResult}
        />
        <BmiResult value={result} />
        <BmiHistory items={history} onClear={() => setHistory([])} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    backgroundColor: '#3b82f6',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  content: {
    padding: 16,
  },
});
