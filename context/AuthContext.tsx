import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import * as Linking from 'expo-linking';
import { supabase } from '@/utils/supabase';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }
    // State updates handled by onAuthStateChange
  };

  const signup = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    const redirectUrl = Linking.createURL('auth/callback');
    console.log('[OAuth] Dynamic redirect URL:', redirectUrl);

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
      },
    });

    if (error) {
      throw error;
    }

    // On mobile, open the OAuth URL in the in-app browser
    if (Platform.OS !== 'web' && data?.url) {
      const WebBrowser = await import('expo-web-browser');
      const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        redirectUrl
      );

      console.log('[OAuth] Browser closed with type:', result.type);

      // Handle the successful redirect
      if (result.type === 'success' && result.url) {
        console.log('[OAuth] Redirect URL received:', result.url);

        // Supabase returns tokens in the URL hash: #access_token=...&refresh_token=...
        // Use Linking.parse to extract query params and fragment
        const parsed = Linking.parse(result.url);
        const fragment = result.url.split('#')[1] || '';
        const hashParams = new URLSearchParams(fragment);

        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');

        console.log('[OAuth] Tokens extraction status:', {
          hasAccessToken: !!accessToken,
          hasRefreshToken: !!refreshToken,
        });

        if (accessToken && refreshToken) {
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (sessionError) {
            console.error('[OAuth] Session error:', sessionError);
            throw sessionError;
          }

          console.log('[OAuth] Session set successfully!');
        } else {
          // If not in hash, check query params (sometimes happens depending on flow)
          const qAccessToken = (parsed.queryParams?.access_token as string) || '';
          const qRefreshToken = (parsed.queryParams?.refresh_token as string) || '';

          if (qAccessToken && qRefreshToken) {
            const { error: sessionError } = await supabase.auth.setSession({
              access_token: qAccessToken,
              refresh_token: qRefreshToken,
            });
            if (sessionError) throw sessionError;
            console.log('[OAuth] Session set successfully from query params!');
          } else {
            throw new Error('No tokens received from OAuth provider');
          }
        }
      } else if (result.type === 'cancel') {
        console.log('[OAuth] User cancelled');
        throw new Error('OAuth cancelled by user');
      } else {
        console.log('[OAuth] Unexpected result:', result);
        throw new Error('OAuth failed or was dismissed');
      }
    }
    // On web, the redirect happens automatically
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        isLoading,
        isAuthenticated: !!session,
        login,
        signup,
        logout,
        loginWithGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
