import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { AuthProvider } from '../src/contexts/auth-context';
import { ThemeProvider } from '../src/contexts/theme-context';
import './globals.css';

const AppStatusBar = () => (
  
  <StatusBar style="light" backgroundColor="#1E3A64" translucent={false} />
);

const AppProviders = ({ children }: { children: React.ReactNode }) => (
  <SafeAreaProvider>
    <AppStatusBar />
    <ThemeProvider>
      <AuthProvider>
        {children}
        <Toast />
      </AuthProvider>
    </ThemeProvider>
  </SafeAreaProvider>
);

const AppStack = () => (
  <Stack
    screenOptions={{
      headerShown: false,
      contentStyle: {
        backgroundColor: '#1E3A64',
      },
    }}
  >

    <Stack.Screen name="(tabs)" />
    <Stack.Screen name="index" />
    <Stack.Screen name="login" />
    <Stack.Screen name="register" />
  </Stack>
);

export default function RootLayout() {
  return (
    <AppProviders>
      <AppStack />
    </AppProviders>
  );
}
