import { useEffect } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { TodoProvider } from '@/context/TodoContext';

function RootLayoutNav() {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inTabsGroup = segments[0] === '(tabs)';

    const currentPath = segments.join('/');

    // Handle initial load and redirects
    if (!isAuthenticated) {
      // User not authenticated - should be in auth group
      if (!inAuthGroup) {
        console.log('[Routing] Redirecting to login - user not authenticated');
        router.replace('/(auth)/login');
      }
    } else {
      // User authenticated - redirect to tabs if in auth group or at root index
      if (inAuthGroup || currentPath === '') {
        router.replace('/(tabs)');
      }
    }
  }, [isAuthenticated, segments, isLoading]);

  // Show nothing while loading to prevent flash
  if (isLoading) {
    return null;
  }

  return (
    <>
      <Slot />
      <StatusBar style="auto" />
    </>
  );
}

export default function RootLayout() {
  useFrameworkReady();

  return (
    <ThemeProvider>
      <AuthProvider>
        <TodoProvider>
          <RootLayoutNav />
        </TodoProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
