import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput, Button, Alert,
  Keyboard, ActivityIndicator, useColorScheme, ColorSchemeName
} from 'react-native'; // ← aquí ya está todo
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getClimaActual } from '../../api/weather';

export default function ClimaActual() {
  const [ciudad, setCiudad] = useState('');
  const [pais, setPais] = useState('');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [inicialCargando, setInicialCargando] = useState(true);

  const theme = useColorScheme(); // ← Detecta modo oscuro o claro
  const styles = getStyles(theme); // ← Usa estilos dinámicos

  useEffect(() => {
    const cargarUbicacion = async () => {
      try {
        const valor = await AsyncStorage.getItem('ubicacion');
        if (valor) {
          const [ciudadGuardada, paisGuardado] = valor.split(',');
          setCiudad(ciudadGuardada);
          setPais(paisGuardado);
          await buscarClima(ciudadGuardada, paisGuardado);
        }
      } catch (error) {
        console.error('Error al recuperar ubicación guardada');
      } finally {
        setInicialCargando(false);
      }
    };

    cargarUbicacion();
  }, []);

  const buscarClima = async (ciudadParam?: string, paisParam?: string) => {
    const ciudadBuscar = ciudadParam || ciudad;
    const paisBuscar = paisParam || pais;

    if (!ciudadBuscar || !paisBuscar) {
      Alert.alert('Error', 'Ingresa ciudad y país.');
      return;
    }

    try {
      setLoading(true);
      Keyboard.dismiss();
      const resultado = await getClimaActual(ciudadBuscar, paisBuscar);
      setData(resultado);
      await AsyncStorage.setItem('ubicacion', `${ciudadBuscar},${paisBuscar}`);
    } catch (error) {
      Alert.alert('Error', 'No se pudo obtener el clima. Verifica los datos.');
    } finally {
      setLoading(false);
    }
  };

  if (inicialCargando) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.text}>Cargando datos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buscar Clima</Text>

      <TextInput
        placeholder="Ciudad"
        value={ciudad}
        onChangeText={setCiudad}
        style={styles.input}
        placeholderTextColor={theme === 'dark' ? '#aaa' : '#888'}
      />
      <TextInput
        placeholder="País (ej. MX, ES)"
        value={pais}
        onChangeText={setPais}
        style={styles.input}
        autoCapitalize="characters"
        placeholderTextColor={theme === 'dark' ? '#aaa' : '#888'}
      />

      <Button title="Buscar" onPress={() => buscarClima()} disabled={loading} />

      {loading && <ActivityIndicator style={{ marginTop: 20 }} size="small" color="#007AFF" />}

      {!loading && data && (
        <View style={styles.result}>
          <Text style={styles.subtitle}>Clima en {data.name}, {data.sys.country}</Text>
          <Text style={styles.text}>🌡 {data.main.temp}°C</Text>
          <Text style={styles.text}>💧 Humedad: {data.main.humidity}%</Text>
          <Text style={styles.text}>💨 Viento: {data.wind.speed} m/s</Text>
          <Text style={styles.text}>🌥 {data.weather[0].description}</Text>
        </View>
      )}

      {!loading && !data && (
        <Text style={styles.noData}>No hay datos disponibles. Ingresa una ciudad para comenzar.</Text>
      )}
    </View>
  );
}

// Estilos con tema dinámico
const getStyles = (theme: ColorSchemeName) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: theme === 'dark' ? '#000' : '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme === 'dark' ? '#000' : '#fff',
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: theme === 'dark' ? '#fff' : '#000',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    color: theme === 'dark' ? '#fff' : '#000',
  },
  text: {
    fontSize: 16,
    color: theme === 'dark' ? '#fff' : '#000',
    marginBottom: 4,
  },
  result: {
    marginTop: 20,
    alignItems: 'center',
  },
  noData: {
    marginTop: 30,
    textAlign: 'center',
    fontSize: 16,
    color: theme === 'dark' ? '#aaa' : '#666',
  }
});
