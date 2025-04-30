// app/(tabs)/_layout.tsx
import React, { Suspense } from 'react';
import { ActivityIndicator, Platform, View } from 'react-native';
import { Tabs } from 'expo-router';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Suspense fallback={<LoadingScreen />}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({ ios: { position: 'absolute' }, default: {} }),
        }}
      >
        <Tabs.Screen
          name="climaActual"
          options={{
            title: 'Clima Actual',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="cloud.sun.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="pronostico"
          options={{
            title: '15 Días',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="calendar" color={color} />,
          }}
        />
        <Tabs.Screen
          name="perfil"
          options={{
            title: 'Perfil',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.crop.circle.fill" color={color} />,
          }}
        />
      </Tabs>
    </Suspense>
  );
}

function LoadingScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#007AFF" />
    </View>
  );
}
