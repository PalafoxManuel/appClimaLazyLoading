// app/(tabs)/perfil.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  Button,
  Alert,
  useColorScheme,
  ColorSchemeName,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/contexts/AuthContext';           // 👈 Estado y logout

export default function Perfil() {
  const { user, logout } = useAuth();                       // 👈 user.email y logout
  const [nombre, setNombre] = useState('');
  const [guardado, setGuardado] = useState('');
  const [loading, setLoading] = useState(true);

  const theme = useColorScheme();
  const styles = getStyles(theme);

  /* ────────── Cargar nombre local ────────── */
  useEffect(() => {
    const cargarNombre = async () => {
      try {
        const valor = await AsyncStorage.getItem('nombreUsuario');
        if (valor) {
          setNombre(valor);
          setGuardado(valor);
        }
      } catch (error) {
        console.error('Error al cargar el nombre:', error);
      } finally {
        setLoading(false);
      }
    };
    cargarNombre();
  }, []);

  /* ────────── Guardar nombre en AsyncStorage ────────── */
  const guardarNombre = async () => {
    if (!nombre.trim()) {
      Alert.alert('Campo vacío', 'Escribe un nombre válido');
      return;
    }
    try {
      await AsyncStorage.setItem('nombreUsuario', nombre);
      setGuardado(nombre);
      Alert.alert('Guardado', 'Tu nombre ha sido actualizado');
    } catch {
      Alert.alert('Error', 'No se pudo guardar el nombre');
    }
  };

  /* ────────── Loading splash ────────── */
  if (loading)
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando perfil...</Text>
      </View>
    );

  /* ────────── UI principal ────────── */
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://i.pravatar.cc/150?img=5' }}
        style={styles.avatar}
      />

      {/* Nombre editable */}
      <Text style={styles.label}>Nombre:</Text>
      <TextInput
        value={nombre}
        onChangeText={setNombre}
        placeholder="Tu nombre"
        placeholderTextColor={theme === 'dark' ? '#888' : '#666'}
        style={styles.input}
      />
      <Button
        title="Guardar cambios"
        onPress={guardarNombre}
        disabled={nombre.trim() === guardado.trim()}
        color={theme === 'dark' ? '#888' : undefined}
      />

      {/* Resumen de datos */}
      <View style={styles.summary}>
        <Text style={styles.title}>Resumen</Text>
        <Text style={styles.info}>👤 {guardado || 'Sin nombre'}</Text>
        <Text style={styles.info}>📧 {user?.email ?? 'Sin e-mail'}</Text>
      </View>

      {/* Cerrar sesión */}
      <View style={{ marginTop: 40 }}>
        <Button title="Cerrar sesión" onPress={logout} />
      </View>
    </View>
  );
}

/* ────────── Estilos dinámicos ────────── */
const getStyles = (theme: ColorSchemeName) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: theme === 'dark' ? '#000' : '#fff',
      justifyContent: 'center',
    },
    /* Loading */
    loadingContainer: {
      flex: 1,
      backgroundColor: theme === 'dark' ? '#000' : '#fff',
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      fontSize: 18,
      color: theme === 'dark' ? '#fff' : '#000',
    },
    /* Avatar */
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      alignSelf: 'center',
      marginBottom: 20,
      borderWidth: 2,
      borderColor: theme === 'dark' ? '#444' : '#ccc',
    },
    /* Input nombre */
    label: {
      fontSize: 16,
      marginBottom: 6,
      color: theme === 'dark' ? '#fff' : '#000',
    },
    input: {
      borderWidth: 1,
      borderColor: theme === 'dark' ? '#666' : '#ccc',
      borderRadius: 8,
      padding: 10,
      marginBottom: 12,
      fontSize: 16,
      color: theme === 'dark' ? '#fff' : '#000',
      backgroundColor: theme === 'dark' ? '#111' : '#f9f9f9',
    },
    /* Resumen */
    summary: {
      marginTop: 30,
      alignItems: 'center',
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 8,
      color: theme === 'dark' ? '#fff' : '#000',
    },
    info: {
      fontSize: 16,
      marginBottom: 4,
      color: theme === 'dark' ? '#ccc' : '#333',
    },
  });
