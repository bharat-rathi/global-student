import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { ItemCard } from './ItemCard';
import { Item } from '../lib/store';

interface TopicSectionProps {
  title: string;
  items: Item[];
  onItemPress: (item: Item) => void;
}

export function TopicSection({ title, items, onItemPress }: TopicSectionProps) {
  if (items.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {items.length > 6 && (
          <TouchableOpacity>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <FlatList
        data={items.slice(0, 6)}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ItemCard item={item} onPress={() => onItemPress(item)} />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  seeAll: {
    fontSize: 14,
    color: '#2563eb', // blue-600
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: 16,
  },
});
