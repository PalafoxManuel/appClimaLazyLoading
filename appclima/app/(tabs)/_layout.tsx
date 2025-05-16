// app/(tabs)/_layout.tsx
import React, { Suspense } from 'react';
import { ActivityIndicator, Platform, View } from 'react-native';
import { Tabs, Redirect } from 'expo-router';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuth } from '@/contexts/AuthContext';     // 👈 auth hook

export default function TabLayout() {
  const { user, loading } = useAuth();               // 👈 estado de auth
  const colorScheme = useColorScheme();

  /* 1️⃣  Mientras verifica la sesión */
  if (loading) return <LoadingScreen />;

  /* 2️⃣  Sin usuario → manda al login */
  if (!user) return <Redirect href="../login" />;

  /* 3️⃣  Usuario presente → muestra Tabs */
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: { position: 'absolute' },
            default: {},
          }),
        }}
      >
        <Tabs.Screen
          name="climaActual"
          options={{
            title: 'Clima Actual',
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="cloud.sun.fill" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="pronostico"
          options={{
            title: '15 Días',
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="calendar" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="perfil"
          options={{
            title: 'Perfil',
            tabBarIcon: ({ color }) => (
              <IconSymbol
                size={28}
                name="person.crop.circle.fill"
                color={color}
              />
            ),
          }}
        />
      </Tabs>
    </Suspense>
  );
}

/* Pantalla de carga reutilizada */
function LoadingScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#007AFF" />
    </View>
  );
}
