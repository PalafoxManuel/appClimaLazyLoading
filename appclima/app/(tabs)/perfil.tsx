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
  ColorSchemeName
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Perfil() {
  const [nombre, setNombre] = useState('');
  const [guardado, setGuardado] = useState('');
  const [loading, setLoading] = useState(true);

  const theme = useColorScheme();
  const styles = getStyles(theme);

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

  // Mientras carga, centramos el mensaje
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando perfil...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://i.pravatar.cc/150?img=5' }}
        style={styles.avatar}
      />

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

      <View style={styles.summary}>
        <Text style={styles.title}>Resumen</Text>
        <Text style={styles.info}>👤 {guardado || 'No registrado'}</Text>
        <Text style={styles.info}>📧 usuario@climaapp.com</Text>
      </View>
    </View>
  );
}

// Estilos dinámicos para claro/oscuro
const getStyles = (theme: ColorSchemeName) => StyleSheet.create({
  // Contenedor principal
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: theme === 'dark' ? '#000' : '#fff',
    justifyContent: 'center',
  },
  // Cargando
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
  // Avatar
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: theme === 'dark' ? '#444' : '#ccc',
  },
  // Etiqueta y input
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
  // Resumen
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
