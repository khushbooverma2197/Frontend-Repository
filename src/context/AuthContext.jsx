import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  getAuthSession,
  onAuthStateChange,
  signInWithEmail,
  signInWithGoogle,
  signOutUser,
  signUpWithEmail,
} from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore session from localStorage — no network call
    getAuthSession().then(({ data }) => {
      setSession(data.session || null);
      setUser(data.session?.user || null);
      setLoading(false);
    });

    // Subscribe to in-memory auth events (signup, login, logout)
    const { data: subscriptionData } = onAuthStateChange((_event, nextSession) => {
      setSession(nextSession || null);
      setUser(nextSession?.user || null);
    });

    return () => subscriptionData?.subscription?.unsubscribe();
  }, []);

  const signUp = async ({ email, password, name }) => {
    const { data, error } = await signUpWithEmail({ email, password, name });
    if (error) throw error;
    return data;
  };

  const signIn = async ({ email, password }) => {
    const { data, error } = await signInWithEmail({ email, password });
    if (error) throw error;
    return data;
  };

  const signInGoogle = async () => {
    const { data, error } = await signInWithGoogle();
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    const { error } = await signOutUser();
    if (error) throw error;
  };

  const value = useMemo(
    () => ({
      user,
      session,
      loading,
      authConfigured: true,
      signUp,
      signIn,
      signInGoogle,
      signOut,
      isAuthenticated: Boolean(user),
    }),
    [user, session, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
