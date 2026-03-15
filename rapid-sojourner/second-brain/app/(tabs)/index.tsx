import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { useStore, Item } from '../../lib/store';
import { supabase } from '../../lib/supabase';
import { TopicSection } from '../../components/TopicSection';
import { ItemSheet } from '../../components/ItemSheet';
import { QuickSaveSheet } from '../../components/QuickSaveSheet';
import { useShareIntentContext } from '../../components/ShareIntentProvider';

export default function LibraryScreen() {
  const { user, items, setItems, addItem, updateItem } = useStore();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isQuickSaveOpen, setIsQuickSaveOpen] = useState(false);
  
  const { sharedUrl, resetShareIntent, hasShareIntent } = useShareIntentContext();

  const fetchItems = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (e) {
      console.error('Error fetching items:', e);
    }
  };

  useEffect(() => {
    fetchItems();

    // Subscribe to realtime changes for enrichment updates
    const channel = supabase
      .channel('items_changes')
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'items', filter: `user_id=eq.${user?.id}` }, 
        (payload) => {
          updateItem(payload.new.id, payload.new as Item);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Handle shared URLs
  useEffect(() => {
    if (hasShareIntent && sharedUrl) {
      setIsQuickSaveOpen(true);
    }
  }, [hasShareIntent, sharedUrl]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchItems();
    setRefreshing(false);
  };

  // Group items by topic
  const groupedItems = React.useMemo(() => {
    const groups: { [key: string]: Item[] } = {};
    items.forEach((item) => {
      const topic = item.topic || 'New Saves';
      if (!groups[topic]) groups[topic] = [];
      groups[topic].push(item);
    });
    // Sort topics alphabetically but keep 'New Saves' first or last
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [items]);

  const handleQuickSaveSuccess = () => {
    resetShareIntent();
    fetchItems(); // Refresh to catch the new item
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Your Second Brain</Text>
          <Text style={styles.title}>Library</Text>
        </View>

        {items.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🧠</Text>
            <Text style={styles.emptyTitle}>Your brain is empty</Text>
            <Text style={styles.emptySubtitle}>Save some links to start enriching your focus.</Text>
          </View>
        ) : (
          groupedItems.map(([topic, topicItems]) => (
            <TopicSection
              key={topic}
              title={topic}
              items={topicItems}
              onItemPress={setSelectedItem}
            />
          ))
        )}
      </ScrollView>

      <TouchableOpacity 
        style={styles.fab}
        onPress={() => setIsQuickSaveOpen(true)}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <ItemSheet 
        item={selectedItem} 
        onClose={() => setSelectedItem(null)} 
      />

      <QuickSaveSheet
        isOpen={isQuickSaveOpen}
        initialUrl={sharedUrl}
        onClose={() => {
          setIsQuickSaveOpen(false);
          resetShareIntent();
        }}
        onSuccess={handleQuickSaveSuccess}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#f8fafc',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1e293b',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    marginTop: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 10,
  },
  fabText: {
    fontSize: 32,
    color: '#fff',
    fontWeight: '300',
  },
});
