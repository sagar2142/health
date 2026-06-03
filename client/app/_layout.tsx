import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { Text, LogBox } from 'react-native';

import { useColorScheme } from '@/hooks/useColorScheme';
import { UserProvider } from './context/UserContext';
import { useAuth, AuthProvider } from './context/AuthContext';

// Suppress "Text strings must be rendered within a <Text> component" warning in UI, log to console only
LogBox.ignoreLogs(['Text strings must be rendered within a <Text> component']);

function MainLayout() {
  const { isAuthenticated } = useAuth();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <>
          <Stack.Screen name="pages/auth/Login" options={{ headerShown: false }} />
          <Stack.Screen name="pages/auth/Signup" options={{ headerShown: false }} />
        </>
      ) : (
        <>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="pages/DailyTrack" options={{ headerShown: false }} />
          <Stack.Screen name="pages/AISupport" options={{ headerShown: false }} />
          <Stack.Screen name="pages/Account" options={{ headerShown: false }} />
        </>
      )}
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <UserProvider>
        <AuthProvider>
          <MainLayout />
        </AuthProvider>
      </UserProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
