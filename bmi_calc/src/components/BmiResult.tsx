import { StyleSheet, Text, View } from 'react-native';

interface BmiResultProps {
  value: number | null;
}

function categoryFor(bmi: number): { label: string; color: string } {
  if (bmi < 18.5) return { label: 'Podváha', color: '#3b82f6' };
  if (bmi < 25) return { label: 'Normální váha', color: '#16a34a' };
  if (bmi < 30) return { label: 'Nadváha', color: '#f59e0b' };
  return { label: 'Obezita', color: '#dc2626' };
}

function BmiResult({ value }: BmiResultProps) {
  if (value === null) {
    return (
      <View style={styles.card}>
        <Text style={styles.placeholder}>Zadejte váhu a výšku a stiskněte Vypočítat.</Text>
      </View>
    );
  }

  const { label, color } = categoryFor(value);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Výsledek</Text>
      <Text style={[styles.value, { color }]}>{value.toFixed(1)}</Text>
      <Text style={[styles.category, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  title: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  value: {
    fontSize: 48,
    fontWeight: '700',
  },
  category: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 4,
  },
  placeholder: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default BmiResult;
