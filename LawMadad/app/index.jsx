import { Text, View } from "react-native";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import { checkAuthState, getUserSession } from "../services/AuthService";

export default function Index() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    // First check local storage for faster loading
    const checkLocalSession = async () => {
      try {
        const sessionUser = await getUserSession();
        if (sessionUser) {
          setUser(sessionUser);
        }
      } catch (error) {
        console.error("Error checking local session:", error);
      }
      
      // Then verify with Firebase (which is more authoritative)
      const unsubscribe = checkAuthState((firebaseUser) => {
        setUser(firebaseUser);
        setInitializing(false);
      });
      
      return unsubscribe;
    };
    
    checkLocalSession();
  }, []);
  
  // Show loading indicator while checking auth state
  if (initializing) {
    return (
      <View style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}>
        <ActivityIndicator size="large" color="#4a6da7" />
      </View>
    );
  }
  
  // Redirect based on auth state
  return (
    <View style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    }}>
      {user ? <Redirect href="/(tabs)/home" /> : <Redirect href="/login" />}
    </View>
  );
}