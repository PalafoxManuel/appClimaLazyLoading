import React, { useState } from 'react';
import {
  View, Text, TextInput, Button, StyleSheet, FlatList,
  Alert, Keyboard, ActivityIndicator, Image,
  useColorScheme, ColorSchemeName
} from 'react-native';
import { getPronostico } from '../../api/weather';

type Dia = {
  fecha: string;
  temp: number;
  descripcion: string;
  icono: string;
};

export default function Pronostico() {
  const [ciudad, setCiudad] = useState('');
  const [pais, setPais] = useState('');
  const [dias, setDias] = useState<Dia[]>([]);
  const [loading, setLoading] = useState(false);

  const theme = useColorScheme();
  const styles = getStyles(theme);

  const buscarPronostico = async () => {
    if (!ciudad || !pais) {
      Alert.alert('Error', 'Ingresa ciudad y país');
      return;
    }

    try {
      setLoading(true);
      Keyboard.dismiss();
      const datos = await getPronostico(ciudad, pais);

      if (!datos?.list) {
        Alert.alert('Error', 'Respuesta inválida de la API');
        return;
      }

      const agrupados: { [fecha: string]: Dia } = {};

      datos.list.forEach((item: any) => {
        const fecha = item.dt_txt.split(' ')[0];
        if (!agrupados[fecha]) {
          agrupados[fecha] = {
            fecha,
            temp: item.main.temp,
            descripcion: item.weather[0].description,
            icono: item.weather[0].icon,
          };
        }
      });

      const listaDias = Object.values(agrupados).slice(0, 5);
      setDias(listaDias);
    } catch (error) {
      Alert.alert('Error', 'No se pudo obtener el pronóstico');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pronóstico</Text>

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
        autoCapitalize="characters"
        style={styles.input}
        placeholderTextColor={theme === 'dark' ? '#aaa' : '#888'}
      />

      <Button title="Buscar" onPress={buscarPronostico} disabled={loading} />

      {loading && <ActivityIndicator style={{ marginTop: 20 }} size="large" color="#007AFF" />}

      {!loading && dias.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Text style={styles.noData}>No hay datos aún. Ingresa una ciudad para comenzar.</Text>
        </View>
      ) : (
        <FlatList
          data={dias}
          keyExtractor={(item) => item.fecha}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.fecha}>{item.fecha}</Text>
              <View style={styles.row}>
                <Image
                  source={{ uri: `https://openweathermap.org/img/wn/${item.icono}@2x.png` }}
                  style={styles.icon}
                />
                <Text style={styles.text}>
                  {item.descripcion} - {item.temp.toFixed(1)}°C
                </Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

// Estilos con soporte de tema
const getStyles = (theme: ColorSchemeName) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    justifyContent: 'center',
    backgroundColor: theme === 'dark' ? '#000' : '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
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
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  fecha: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 6,
    color: theme === 'dark' ? '#fff' : '#000',
  },
  icon: { width: 40, height: 40, marginRight: 10 },
  row: { flexDirection: 'row', alignItems: 'center' },
  text: { color: theme === 'dark' ? '#fff' : '#000' },
  noData: {
    marginTop: 30,
    textAlign: 'center',
    fontSize: 16,
    color: theme === 'dark' ? '#aaa' : '#666',
  },
});
