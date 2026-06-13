import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Rehydrate from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('ats_token');
    const savedUser = localStorage.getItem('ats_user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      // Verify token is still valid
      authAPI.getMe()
        .then(res => setUser(res.data.user))
        .catch(() => {
          localStorage.removeItem('ats_token');
          localStorage.removeItem('ats_user');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }

    // Supabase Auth Listener for Google OAuth callback
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.access_token) {
        try {
          const res = await authAPI.google({ access_token: session.access_token });
          const { token, user } = res.data;
          localStorage.setItem('ats_token', token);
          localStorage.setItem('ats_user', JSON.stringify(user));
          setUser(user);
          toast.success(`Welcome, ${user.name}!`);
        } catch (error) {
          toast.error(error.response?.data?.message || 'Google login failed.');
        }
      }
    });
    
    return () => subscription.unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/',
      }
    });
    if (error) toast.error(error.message);
  };

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    const { token, user } = res.data;
    localStorage.setItem('ats_token', token);
    localStorage.setItem('ats_user', JSON.stringify(user));
    setUser(user);
    toast.success(`Welcome back, ${user.name}! `);
    return user;
  };

  const register = async (data) => {
    const res = await authAPI.register(data);
    const { token, user } = res.data;
    localStorage.setItem('ats_token', token);
    localStorage.setItem('ats_user', JSON.stringify(user));
    setUser(user);
    toast.success(`Account created! Welcome, ${user.name}! `);
    return user;
  };

  const logout = async () => {
    localStorage.removeItem('ats_token');
    localStorage.removeItem('ats_user');
    setUser(null);
    await supabase.auth.signOut();
    toast.success('Logged out successfully.');
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('ats_user', JSON.stringify(updatedUser));
  };

  const contextValue = React.useMemo(() => ({
    user, loading, login, loginWithGoogle, register, logout, updateUser
  }), [user, loading]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
