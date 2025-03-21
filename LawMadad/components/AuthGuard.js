// components/AuthGuard.js
import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';

const publicRoutes = ['/login', '/register', '/reset-password'];

const AuthGuard = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      // If not authenticated and trying to access protected route
      if (!user && !publicRoutes.includes(pathname) && pathname !== '/') {
        router.replace('/login');
      }
      
      // If authenticated and trying to access login page
      if (user && (publicRoutes.includes(pathname) || pathname === '/')) {
        router.replace('/(tabs)/home');
      }
    }
  }, [user, loading, pathname]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4a6da7" />
      </View>
    );
  }

  return children;
};

export default AuthGuard;