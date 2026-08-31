import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';

import { DashboardCard } from '../../src/components/DashboardCard';
import { useAuth } from '../../src/contexts/AuthContext';

export default function AdminDashboard() {
  const { user, signOut } = useAuth();

  async function handleLogout() {
    await signOut();
    router.replace('/login');
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.welcome}>Bem-vindo</Text>
            <Text style={styles.name}>{user?.name}</Text>
            <Text style={styles.role}>Administrador SchoolGo</Text>
          </View>

          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0).toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.hero}>
          <Text style={styles.heroLabel}>Operação de hoje</Text>
          <Text style={styles.heroTitle}>Tudo pronto para começar</Text>
          <Text style={styles.heroText}>
            As viagens, alunos e vans aparecerão aqui conforme forem cadastrados.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Resumo</Text>

        <View style={styles.stats}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Vans em rota</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Alunos previstos</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Administração</Text>

        <View style={styles.grid}>
          <DashboardCard icon="🎓" title="Alunos" />
          <DashboardCard icon="👨‍👩‍👧" title="Responsáveis" />
          <DashboardCard icon="👨‍✈️" title="Motoristas" />
          <DashboardCard icon="🚌" title="Vans" />
          <DashboardCard icon="🏫" title="Escolas" />
          <DashboardCard icon="🗺️" title="Rotas" />
          <DashboardCard icon="📍" title="Viagens" />
          <DashboardCard icon="📊" title="Relatórios" />
        </View>

        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Sair da conta</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F6F8FC',
  },
  content: {
    padding: 22,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  welcome: {
    fontSize: 14,
    color: '#7A8496',
  },
  name: {
    fontSize: 25,
    fontWeight: '900',
    color: '#172033',
    marginTop: 2,
  },
  role: {
    marginTop: 3,
    color: '#245BDB',
    fontWeight: '700',
    fontSize: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#245BDB',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '900',
  },
  hero: {
    borderRadius: 22,
    padding: 20,
    backgroundColor: '#172033',
    marginBottom: 26,
  },
  heroLabel: {
    color: '#AFC5FF',
    fontSize: 13,
    fontWeight: '700',
  },
  heroTitle: {
    marginTop: 6,
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
  },
  heroText: {
    marginTop: 8,
    color: '#D1D7E3',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#172033',
    marginBottom: 13,
  },
  stats: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 26,
  },
  statCard: {
    flex: 1,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderWidth: 1,
    borderColor: '#E7EBF2',
  },
  statValue: {
    fontSize: 30,
    fontWeight: '900',
    color: '#245BDB',
  },
  statLabel: {
    marginTop: 5,
    color: '#747E91',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  logoutButton: {
    alignItems: 'center',
    padding: 18,
    marginTop: 26,
  },
  logoutText: {
    color: '#D94B4B',
    fontWeight: '800',
  },
});
