import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import { useAuth } from '../../src/contexts/AuthContext';

export default function GuardianDashboard() {
  const { user, signOut } = useAuth();

  async function logout() {
    await signOut();
    router.replace('/login');
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.eyebrow}>RESPONSÁVEL</Text>
      <Text style={styles.title}>Olá, {user?.name}</Text>
      <Text style={styles.subtitle}>
        Aqui você acompanhará o transporte dos seus filhos.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Nenhum aluno vinculado</Text>
        <Text style={styles.cardText}>
          Na próxima fase, os alunos vinculados à sua conta aparecerão nesta área.
        </Text>
      </View>

      <Pressable style={styles.logout} onPress={logout}>
        <Text style={styles.logoutText}>Sair da conta</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F8FC',
    padding: 24,
  },
  eyebrow: {
    color: '#245BDB',
    fontWeight: '900',
    fontSize: 12,
    marginTop: 18,
  },
  title: {
    fontSize: 30,
    fontWeight: '900',
    color: '#172033',
    marginTop: 4,
  },
  subtitle: {
    color: '#737D90',
    marginTop: 8,
    lineHeight: 21,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E7EBF2',
    padding: 20,
    marginTop: 30,
  },
  cardTitle: {
    fontWeight: '900',
    fontSize: 18,
    color: '#172033',
  },
  cardText: {
    marginTop: 8,
    color: '#747E91',
    lineHeight: 20,
  },
  logout: {
    marginTop: 'auto',
    alignItems: 'center',
    padding: 18,
  },
  logoutText: {
    color: '#D94B4B',
    fontWeight: '800',
  },
});
