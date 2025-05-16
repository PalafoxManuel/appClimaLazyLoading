// app/(auth)/register.tsx
import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  useColorScheme,
  ColorSchemeName,
} from 'react-native';
import { useAuth } from '@/contexts/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const theme = useColorScheme();
  const styles = getStyles(theme);

  const handle = async () => {
    try {
      await register(email.trim(), pass);
      router.replace('/'); // Después de registrarse, va a las tabs
    } catch (e: any) {
      Alert.alert('Error', e.message);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <TextInput
          placeholder="Email"
          placeholderTextColor={theme === 'dark' ? '#888' : '#666'}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Contraseña"
          placeholderTextColor={theme === 'dark' ? '#888' : '#666'}
          secureTextEntry
          onChangeText={setPass}
          style={styles.input}
        />
        <Button title="Crear cuenta" onPress={handle} />
        <View style={styles.linkContainer}>
         <Button
           title="¿Ya tienes cuenta? Inicia sesión"
           onPress={() => router.push('/login')}
         />
       </View>
      </View>
    </SafeAreaView>
  );
}

const getStyles = (theme: ColorSchemeName) =>
  StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: theme === 'dark' ? '#000' : '#fff',
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 24,
      gap: 12,
    },
    input: {
      borderWidth: 1,
      borderColor: theme === 'dark' ? '#666' : '#ccc',
      borderRadius: 8,
      padding: 10,
      fontSize: 16,
      color: theme === 'dark' ? '#fff' : '#000',
      backgroundColor: theme === 'dark' ? '#111' : '#f9f9f9',
    },
    linkContainer: {
      marginTop: 12,
      alignItems: 'center',
    },
  });
