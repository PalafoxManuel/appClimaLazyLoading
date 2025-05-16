// app/(tabs)/+not-found.tsx
import { Link, Stack } from 'expo-router';
import { StyleSheet, View, Text } from 'react-native';

export default function TabsNotFound() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.container}>
        <Text style={styles.title}>Página no encontrada en Clima</Text>
        <Link href="/climaActual" style={styles.link}>
          <Text style={styles.linkText}>Ir al inicio</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 18, marginBottom: 12 },
  link: { marginTop: 10 },
  linkText: { color: 'blue' },
});
