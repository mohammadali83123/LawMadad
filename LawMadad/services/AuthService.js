import { auth } from "../Config/FirebaseConfig";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithCredential
} from "firebase/auth";
import { sendEmailVerification } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Keep existing functions and add these new ones:

// Check if user is logged in
export const checkAuthState = (callback) => {
  return onAuthStateChanged(auth, (user) => {
    callback(user);
  });
};

// Sign out
export const signOutUser = async () => {
  try {
    await signOut(auth);
    await AsyncStorage.removeItem('@user_session');
    return true;
  } catch (error) {
    console.error("Sign out error:", error.message);
    return false;
  }
};

// Save user session to AsyncStorage
export const saveUserSession = async (user) => {
  try {
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || '',
      photoURL: user.photoURL || '',
      emailVerified: user.emailVerified,
      provider: user.providerData[0]?.providerId || 'unknown',
      lastLogin: new Date().toISOString()
    };
    
    await AsyncStorage.setItem('@user_session', JSON.stringify(userData));
    return true;
  } catch (error) {
    console.error("Error saving user session:", error);
    return false;
  }
};

// Get user session from AsyncStorage
export const getUserSession = async () => {
  try {
    const userSession = await AsyncStorage.getItem('@user_session');
    return userSession ? JSON.parse(userSession) : null;
  } catch (error) {
    console.error("Error getting user session:", error);
    return null;
  }
};

// Handle Google Sign In (extend your existing function)
export const handleGoogleSignIn = async (idToken) => {
  try {
    // Create a Google credential with the token
    const googleCredential = GoogleAuthProvider.credential(idToken);
    
    // Sign in with credential
    const userCredential = await signInWithCredential(auth, googleCredential);
    
    // Save user session
    await saveUserSession(userCredential.user);
    
    return userCredential.user;
  } catch (error) {
    console.error("Google sign in error:", error);
    throw error;
  }
};

// Sign Up
export const signUpWithEmail = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Send verification email
    await sendEmailVerification(userCredential.user);
    
    return userCredential.user;
  } catch (error) {
    console.error("Sign up error:", error.message);
    throw error;
  }
};

// Update your existing signInWithEmail function
export const signInWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    // Check if the email is verified
    if (!userCredential.user.emailVerified) {
      throw new Error("Email not verified. Please check your inbox.");
    }
    
    // Save user session
    await saveUserSession(userCredential.user);

    return userCredential.user;
  } catch (error) {
    console.error("Sign in error:", error.message);
    return null;
  }
};