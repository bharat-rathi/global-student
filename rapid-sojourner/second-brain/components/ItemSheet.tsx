import { useRef, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Linking, ScrollView } from 'react-native';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import * as WebBrowser from 'expo-web-browser';
import { Item, useStore } from '../lib/store';
import { extractDomain, timeAgo } from '../lib/utils';
import { supabase } from '../lib/supabase';

interface ItemSheetProps {
  item: Item | null;
  onClose: () => void;
}

export function ItemSheet({ item, onClose }: ItemSheetProps) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['60%', '90%'], []);
  const { deleteItem, folders, updateItem } = useStore();

  const handleMoveToFolder = async (folderId: string | null) => {
    if (!item) return;

    try {
      const { error } = await supabase
        .from('items')
        .update({ folder_id: folderId })
        .eq('id', item.id);

      if (error) throw error;

      updateItem(item.id, { folder_id: folderId });
      // We don't close the sheet, just update local state
    } catch (error: any) {
      Alert.alert('Error', 'Failed to move item to folder.');
    }
  };

  useEffect(() => {
    if (item) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [item]);

  const handleSheetChanges = (index: number) => {
    if (index === -1) {
      onClose();
    }
  };

  const handleOpenLink = async () => {
    if (!item?.url) return;
    try {
      await WebBrowser.openBrowserAsync(item.url);
    } catch (error) {
      // Fallback to standard linking if WebBrowser fails
      Linking.openURL(item.url).catch(err => {
        Alert.alert('Error', 'Could not open the link.');
      });
    }
  };

  const handleDelete = async () => {
    if (!item) return;

    Alert.alert(
      'Delete Item',
      'Are you sure you want to completely remove this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const idToDelete = item.id;
            // Optimistic UUID update
            deleteItem(idToDelete);
            onClose();

            // Perform backend deletion
            const { error } = await supabase
              .from('items')
              .delete()
              .eq('id', idToDelete);

            if (error) {
              Alert.alert('Error', 'Failed to delete item from server.');
              // Note: robust implementation would revert optimistic update here
            }
          },
        },
      ]
    );
  };

  if (!item) return null;

  const domain = extractDomain(item.url);
  const formattedTime = timeAgo(item.created_at);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      enablePanDownToClose
      backgroundStyle={styles.background}
    >
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.domain}>{domain}</Text>
          <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
            <Text style={styles.deleteText}>🗑️ Delete</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>{item.title || item.url}</Text>
        <Text style={styles.time}>{formattedTime}</Text>
      </View>

      <BottomSheetScrollView contentContainerStyle={styles.content}>
        {item.user_note ? (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Your Note</Text>
            <Text style={styles.text}>{item.user_note}</Text>
          </View>
        ) : null}

        {item.enriched_at ? (
          <View style={styles.section}>
            <View style={styles.aiHeader}>
              <Text style={styles.sectionHeader}>AI Summary</Text>
              <View style={styles.topicBadge}>
                <Text style={styles.topicText}>{item.topic}</Text>
              </View>
            </View>
            <View style={styles.summaryBox}>
              <Text style={styles.summaryText}>
                {item.description || "No summary specifically generated."}
              </Text>
            </View>
            
            {item.tags && item.tags.length > 0 && (
              <View style={styles.tagsContainer}>
                {item.tags.map((tag, idx) => (
                  <View key={idx} style={styles.tagBadge}>
                    <Text style={styles.tagText}>#{tag}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ) : (
          <View style={styles.processingSection}>
            <Text style={styles.processingTitle}>Enriching link...</Text>
            <Text style={styles.processingText}>
              The Second Brain AI is currently summarizing and extracting concepts from this linked content.
            </Text>
          </View>
        )}

        <View style={styles.folderSection}>
          <Text style={styles.sectionHeader}>Folder</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.folderScroll}>
            <TouchableOpacity
              style={[
                styles.folderChip,
                !item.folder_id && styles.selectedFolderChip
              ]}
              onPress={() => handleMoveToFolder(null)}
            >
              <Text style={[
                styles.folderChipText,
                !item.folder_id && styles.selectedFolderChipText
              ]}>
                No Folder
              </Text>
            </TouchableOpacity>
            {folders.map(folder => (
              <TouchableOpacity
                key={folder.id}
                style={[
                  styles.folderChip,
                  item.folder_id === folder.id && styles.selectedFolderChip
                ]}
                onPress={() => handleMoveToFolder(folder.id)}
              >
                <Text style={[
                  styles.folderChipText,
                  item.folder_id === folder.id && styles.selectedFolderChipText
                ]}>
                  {folder.emoji || '📁'} {folder.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </BottomSheetScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.openButton} onPress={handleOpenLink}>
          <Text style={styles.openButtonText}>Open Original Link</Text>
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#fff',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  domain: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  deleteButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#fef2f2',
    borderRadius: 8,
  },
  deleteText: {
    fontSize: 12,
    color: '#ef4444',
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 6,
    lineHeight: 30,
  },
  time: {
    fontSize: 13,
    color: '#94a3b8',
  },
  content: {
    padding: 24,
    paddingBottom: 120,
  },
  section: {
    marginBottom: 32,
  },
  aiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  topicBadge: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  topicText: {
    fontSize: 11,
    color: '#2563eb',
    fontWeight: '700',
  },
  text: {
    fontSize: 16,
    lineHeight: 26,
    color: '#334155',
  },
  summaryBox: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    borderRadius: 16,
    padding: 20,
  },
  summaryText: {
    fontSize: 16,
    lineHeight: 26,
    color: '#1e293b',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 20,
  },
  tagBadge: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  tagText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  processingSection: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#fffbeb',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#fef3c7',
  },
  processingTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#92400e',
    marginBottom: 8,
  },
  processingText: {
    fontSize: 14,
    color: '#b45309',
    textAlign: 'center',
    lineHeight: 22,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingBottom: 40,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  openButton: {
    backgroundColor: '#2563eb',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  openButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  folderSection: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 24,
  },
  folderScroll: {
    marginTop: 12,
  },
  folderChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  selectedFolderChip: {
    backgroundColor: '#eff6ff',
    borderColor: '#2563eb',
  },
  folderChipText: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '600',
  },
  selectedFolderChipText: {
    color: '#2563eb',
    fontWeight: '700',
  },
});
