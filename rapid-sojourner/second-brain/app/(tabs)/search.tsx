import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Keyboard } from 'react-native';
import { supabase } from '../../lib/supabase';
import { Item } from '../../lib/store';
import { ItemSheet } from '../../components/ItemSheet';
import { extractDomain, timeAgo } from '../../lib/utils';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    Keyboard.dismiss();

    try {
      const { data, error: searchError } = await supabase.functions.invoke('search', {
        body: { query: query.trim() }
      });

      if (searchError) throw searchError;
      setResults(data.results || []);
    } catch (e: any) {
      console.error('Search error:', e);
      setError('Failed to perform semantic search. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: Item }) => {
    const domain = extractDomain(item.url);
    const time = timeAgo(item.created_at);

    return (
      <TouchableOpacity 
        style={styles.card} 
        onPress={() => setSelectedItem(item)}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.domain}>{domain}</Text>
          <Text style={styles.time}>{time}</Text>
        </View>
        <Text style={styles.title} numberOfLines={2}>{item.title || item.url}</Text>
        {item.topic && (
          <View style={styles.topicBadge}>
            <Text style={styles.topicText}>{item.topic}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Semantic Search</Text>
        <Text style={styles.headerSubtitle}>Find items by concept, not just keywords.</Text>
        
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.input}
            placeholder="e.g. 'How do I build a mobile app?'"
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          <TouchableOpacity 
            style={styles.searchButton} 
            onPress={handleSearch}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.searchButtonText}>Search</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : results.length > 0 ? (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      ) : !loading && query.length > 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No matches found for that concept.</Text>
        </View>
      ) : !loading && (
        <View style={styles.centerContainer}>
          <Text style={styles.placeholderIcon}>🔍</Text>
          <Text style={styles.placeholderText}>Search for anything you've saved.</Text>
        </View>
      )}

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
    backgroundColor: '#ffffff',
  },
  header: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#f8fafc',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  input: {
    flex: 1,
    height: 56,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 16,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#1e293b',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchButton: {
    width: 90,
    height: 56,
    backgroundColor: '#2563eb',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  searchButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
  },
  listContent: {
    padding: 24,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  domain: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  time: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94a3b8',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    lineHeight: 24,
    marginBottom: 16,
  },
  topicBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  topicText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563eb',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorText: {
    color: '#ef4444',
    textAlign: 'center',
    fontWeight: '600',
  },
  emptyText: {
    color: '#64748b',
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 24,
  },
  placeholderIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  placeholderText: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 24,
  },
});
