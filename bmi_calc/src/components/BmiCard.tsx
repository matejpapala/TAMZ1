import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface BmiCardProps {
  calcText: string;
  resetText: string;
  onResult: (value: number | null) => void;
}

function BmiCard({ calcText, resetText, onResult }: BmiCardProps) {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');

  function handleCalc() {
    const w = parseFloat(weight.replace(',', '.'));
    const h = parseFloat(height.replace(',', '.'));
    if (!w || !h) {
      onResult(null);
      return;
    }
    const meters = h / 100;
    const bmi = w / (meters * meters);
    onResult(Math.round(bmi * 10) / 10);
  }

  function handleReset() {
    setWeight('');
    setHeight('');
    onResult(null);
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>BMI kalkulačka</Text>

      <Text style={styles.label}>Váha (kg)</Text>
      <TextInput
        style={styles.input}
        value={weight}
        onChangeText={setWeight}
        keyboardType="numeric"
        placeholder="např. 70"
      />

      <Text style={styles.label}>Výška (cm)</Text>
      <TextInput
        style={styles.input}
        value={height}
        onChangeText={setHeight}
        keyboardType="numeric"
        placeholder="např. 175"
      />

      <TouchableOpacity style={styles.buttonPrimary} onPress={handleCalc}>
        <Text style={styles.buttonPrimaryText}>{calcText}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonSecondary} onPress={handleReset}>
        <Text style={styles.buttonSecondaryText}>{resetText}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: '#444',
    marginTop: 8,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  buttonPrimary: {
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonPrimaryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonSecondary: {
    backgroundColor: '#e5e7eb',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonSecondaryText: {
    color: '#111',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default BmiCard;
