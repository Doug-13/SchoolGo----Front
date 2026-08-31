import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  icon: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
};

export function DashboardCard({
  icon,
  title,
  subtitle = 'Gerenciar',
  onPress,
}: Props) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.iconBox}>
        <Text style={styles.icon}>{icon}</Text>
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    minHeight: 142,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderWidth: 1,
    borderColor: '#E7EBF2',
  },
  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF4FF',
    marginBottom: 14,
  },
  icon: {
    fontSize: 24,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#172033',
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    color: '#7A8496',
  },
});
