// context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { checkAuthState, getUserSession, saveUserSession, signOutUser } from '../services/AuthService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for cached user session first
    const loadCachedUserSession = async () => {
      const cachedUser = await getUserSession();
      if (cachedUser) {
        setUser(cachedUser);
      }
    };
    
    loadCachedUserSession();
    
    // Set up Firebase auth state listener
    const unsubscribe = checkAuthState(async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        await saveUserSession(firebaseUser);
        setUser(firebaseUser);
      } else {
        // User is signed out
        setUser(null);
      }
      setLoading(false);
    });

    // Clean up subscription
    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);