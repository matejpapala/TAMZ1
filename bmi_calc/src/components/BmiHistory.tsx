import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface BmiHistoryProps {
  items: number[];
  onClear: () => void;
}

function BmiHistory({ items, onClear }: BmiHistoryProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Historie</Text>
        {items.length > 0 && (
          <TouchableOpacity onPress={onClear}>
            <Text style={styles.clear}>Vymazat</Text>
          </TouchableOpacity>
        )}
      </View>

      {items.length === 0 ? (
        <Text style={styles.empty}>Zatím žádné výpočty.</Text>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(_, i) => String(i)}
          scrollEnabled={false}
          renderItem={({ item, index }) => (
            <View style={styles.row}>
              <Text style={styles.index}>#{items.length - index}</Text>
              <Text style={styles.value}>{item.toFixed(1)}</Text>
            </View>
          )}
        />
      )}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  clear: {
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '500',
  },
  empty: {
    color: '#666',
    fontSize: 14,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  index: {
    color: '#666',
    fontSize: 14,
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default BmiHistory;
