import React, { useMemo, useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import BottomSheet, { BottomSheetTextInput, BottomSheetView } from '@gorhom/bottom-sheet';
import { supabase } from '../lib/supabase';
import { useStore } from '../lib/store';

interface QuickSaveSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialUrl?: string | null;
}

export function QuickSaveSheet({ isOpen, onClose, onSuccess, initialUrl }: QuickSaveSheetProps) {
  const { user, addItem, folders } = useStore();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['55%', '90%'], []);

  const [url, setUrl] = useState('');
  const [note, setNote] = useState('');
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialUrl) {
      setUrl(initialUrl);
    }
  }, [initialUrl]);

  useEffect(() => {
    if (isOpen) {
      bottomSheetRef.current?.expand();
      setNote('');
      setSelectedFolderId(null);
      setError(null);
    } else {
      bottomSheetRef.current?.close();
    }
  }, [isOpen]);

  const handleSave = async () => {
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: insertError } = await supabase
        .from('items')
        .insert([
          {
            url: url.trim(),
            user_note: note.trim(),
            user_id: user?.id,
            folder_id: selectedFolderId,
            description: null, // To be filled by AI
          },
        ])
        .select()
        .single();

      if (insertError) throw insertError;

      addItem(data);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderFolderChip = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.folderChip,
        selectedFolderId === item.id && styles.selectedFolderChip
      ]}
      onPress={() => setSelectedFolderId(item.id === selectedFolderId ? null : item.id)}
    >
      <Text style={[
        styles.folderChipText,
        selectedFolderId === item.id && styles.selectedFolderChipText
      ]}>
        {item.emoji || '📁'} {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      onClose={onClose}
    >
      <BottomSheetView style={styles.contentContainer}>
        <Text style={styles.title}>Quick Save</Text>
        
        {error && <Text style={styles.errorText}>{error}</Text>}

        <Text style={styles.label}>URL</Text>
        <BottomSheetTextInput
          style={styles.input}
          placeholder="https://example.com"
          value={url}
          onChangeText={setUrl}
          autoCapitalize="none"
          keyboardType="url"
        />

        <Text style={styles.label}>Note (Optional)</Text>
        <BottomSheetTextInput
          style={[styles.input, styles.textArea]}
          placeholder="What's this about?"
          value={note}
          onChangeText={setNote}
          multiline
          numberOfLines={3}
        />

        <Text style={styles.label}>Add to Folder (Optional)</Text>
        <View style={styles.folderListContainer}>
          <FlatList
            data={folders}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={renderFolderChip}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={
              <Text style={styles.emptyFoldersText}>No folders available</Text>
            }
          />
        </View>

        <TouchableOpacity 
          style={[styles.saveButton, loading && styles.disabledButton]} 
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Save to Brain</Text>
          )}
        </TouchableOpacity>
      </BottomSheetView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1e293b',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f8fafc',
  },
  textArea: {
    height: 100,
    verticalAlign: 'top',
  },
  folderListContainer: {
    marginBottom: 8,
  },
  folderChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  selectedFolderChip: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  folderChipText: {
    fontSize: 14,
    color: '#64748b',
  },
  selectedFolderChipText: {
    color: '#fff',
    fontWeight: '600',
  },
  emptyFoldersText: {
    color: '#94a3b8',
    fontStyle: 'italic',
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  disabledButton: {
    backgroundColor: '#94a3b8',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#ef4444',
    marginBottom: 16,
  },
});
