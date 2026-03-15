import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useStore, Item } from '../../lib/store';
import { TopicSection } from '../../components/TopicSection';
import { ItemSheet } from '../../components/ItemSheet';

export default function FolderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { items, folders } = useStore();
  const router = useRouter();
  
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const folder = folders.find(f => f.id === id);
  const folderItems = items.filter(i => i.folder_id === id);

  // Group items by topic (consistent with Library view)
  const groupedItems = useMemo(() => {
    const groups: { [key: string]: Item[] } = {};
    folderItems.forEach((item) => {
      const topic = item.topic || 'Uncategorized';
      if (!groups[topic]) groups[topic] = [];
      groups[topic].push(item);
    });
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [folderItems]);

  if (!folder) {
    return (
      <View style={styles.center}>
        <Text>Folder not found</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backLink}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: folder.name, headerShown: true }} />
      
      <FlatList
        data={groupedItems}
        keyExtractor={([topic]) => topic}
        renderItem={({ item: [topic, topicItems] }) => (
          <TopicSection 
            title={topic} 
            items={topicItems} 
            onItemPress={setSelectedItem} 
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No items in this folder yet.</Text>
          </View>
        }
      />

      <ItemSheet 
        item={selectedItem} 
        onClose={() => setSelectedItem(null)} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backLink: {
    marginTop: 12,
    color: '#2563eb',
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#94a3b8',
    fontSize: 16,
  },
});
