import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { Item } from '../lib/store';
import { extractDomain, timeAgo } from '../lib/utils';

interface ItemCardProps {
  item: Item;
  onPress: () => void;
}

export function ItemCard({ item, onPress }: ItemCardProps) {
  const domain = extractDomain(item.url);
  const formattedTime = timeAgo(item.created_at);

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.thumbnailContainer}>
        {item.thumbnail_url ? (
          <Image source={{ uri: item.thumbnail_url }} style={styles.thumbnail} />
        ) : (
          <View style={styles.placeholderThumbnail} />
        )}
      </View>
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.domain} numberOfLines={1}>{domain}</Text>
          <Text style={styles.time}>{formattedTime}</Text>
        </View>

        <Text style={styles.title} numberOfLines={2}>
          {item.title || item.url}
        </Text>

        <View style={styles.footer}>
          {!item.enriched_at ? (
            <View style={styles.processingBadge}>
              <Text style={styles.processingText}>Processing...</Text>
            </View>
          ) : (
            <View style={styles.topicBadge}>
              <Text style={styles.topicText}>{item.topic || 'Saved'}</Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 220,
    height: 180,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginRight: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  thumbnailContainer: {
    height: 90,
    width: '100%',
    backgroundColor: '#f8fafc',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  placeholderThumbnail: {
    width: '100%',
    height: '100%',
    backgroundColor: '#cbd5e1',
    opacity: 0.3,
  },
  content: {
    padding: 14,
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  domain: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    flex: 1,
  },
  time: {
    fontSize: 10,
    color: '#94a3b8',
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
    lineHeight: 18,
  },
  footer: {
    marginTop: 6,
  },
  processingBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  processingText: {
    fontSize: 10,
    color: '#92400e',
    fontWeight: '600',
  },
  topicBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  topicText: {
    fontSize: 10,
    color: '#2563eb',
    fontWeight: '700',
  },
});
