import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useStore } from '../../lib/store';
import { supabase } from '../../lib/supabase';

export default function ProfileScreen() {
  const user = useStore(state => state.user);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Signed in as:</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSignOut}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  card: {
    padding: 24,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 40,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  email: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  button: {
    height: 50,
    backgroundColor: '#ef4444',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
