import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AlertProvider } from '@/template';
import { HomeProvider } from '@/contexts/HomeContext';

export default function RootLayout() {
  return (
    <AlertProvider>
      <SafeAreaProvider>
        <HomeProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="login" />
            <Stack.Screen
              name="voice-assistant"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="bill-details"
              options={{ headerShown: true, title: 'Bill Details' }}
            />
            <Stack.Screen
              name="task-details"
              options={{ headerShown: true, title: 'Task Details' }}
            />
          </Stack>
        </HomeProvider>
      </SafeAreaProvider>
    </AlertProvider>
  );
}
