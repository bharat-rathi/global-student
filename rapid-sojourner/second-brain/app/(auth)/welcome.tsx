import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';
// import { GoogleSignin } from '@react-native-google-signin/google-signin';

export default function WelcomeScreen() {
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    // Phase 2 MVP -> Mocking Google SignIn for now to ensure UI works
    Alert.alert('Google Sign In', 'Configure Google Cloud Console & iOS URL scheme in app.json for production.');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Second Brain</Text>
        <Text style={styles.subtitle}>Save anything. Find everything.</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity 
          style={[styles.button, styles.googleButton]} 
          onPress={handleGoogleSignIn}
        >
          <Text style={styles.googleButtonText}>Continue with Google</Text>
        </TouchableOpacity>

        <Link href="/login" asChild>
          <TouchableOpacity style={[styles.button, styles.emailButton]}>
            <Text style={styles.emailButtonText}>Continue with email</Text>
          </TouchableOpacity>
        </Link>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <Link href="/signup" style={styles.link}>Sign up</Link>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  header: {
    marginTop: 100,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
  actions: {
    marginBottom: 40,
    gap: 16,
  },
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  emailButton: {
    backgroundColor: '#000',
  },
  emailButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  footerText: {
    color: '#666',
  },
  link: {
    color: '#000',
    fontWeight: '600',
  },
});
