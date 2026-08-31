import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';

import { useAuth } from '../src/contexts/AuthContext';

export default function LoginScreen() {
  const { signIn } = useAuth();

  const [email, setEmail] = useState('admin@schoolgo.com');
  const [password, setPassword] = useState('Admin@123');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email.trim() || !password) {
      Alert.alert('Atenção', 'Informe seu e-mail e senha.');
      return;
    }

    try {
      setLoading(true);
      await signIn(email, password);
      router.replace('/');
    } catch (error: any) {
      const message =
        error?.response?.data?.message ??
        'Não foi possível conectar ao servidor.';

      Alert.alert(
        'Não foi possível entrar',
        Array.isArray(message) ? message.join('\n') : message,
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.content}>
          <View style={styles.brand}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>🚌</Text>
            </View>

            <Text style={styles.title}>SchoolGo</Text>
            <Text style={styles.subtitle}>
              Segurança e acompanhamento no transporte escolar.
            </Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>E-mail</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              placeholder="seu@email.com"
              editable={!loading}
            />

            <Text style={styles.label}>Senha</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="Sua senha"
              editable={!loading}
            />

            <Pressable
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>Entrar</Text>
              )}
            </Pressable>

            <Text style={styles.testHint}>
              Acesso inicial: admin@schoolgo.com / Admin@123
            </Text>
          </View>
        </View>

        <Text style={styles.footer}>SchoolGo • Transporte escolar conectado</Text>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  brand: {
    alignItems: 'center',
    marginBottom: 42,
  },
  logo: {
    width: 92,
    height: 92,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EAF1FF',
    marginBottom: 18,
  },
  logoText: {
    fontSize: 46,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#172033',
  },
  subtitle: {
    maxWidth: 320,
    textAlign: 'center',
    marginTop: 8,
    color: '#6F798C',
    lineHeight: 21,
  },
  form: {
    gap: 9,
  },
  label: {
    color: '#354057',
    fontWeight: '700',
    marginTop: 7,
  },
  input: {
    height: 54,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#DCE2EC',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#172033',
  },
  button: {
    height: 56,
    borderRadius: 15,
    backgroundColor: '#245BDB',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
  },
  buttonDisabled: {
    opacity: 0.65,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 16,
  },
  testHint: {
    marginTop: 12,
    fontSize: 12,
    color: '#8A93A4',
    textAlign: 'center',
  },
  footer: {
    textAlign: 'center',
    color: '#98A0AF',
    fontSize: 12,
    paddingBottom: 8,
  },
});
