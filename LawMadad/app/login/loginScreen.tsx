"use client"

import { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { useRouter } from 'expo-router';
import { signInWithEmail, signUpWithEmail, handleGoogleSignIn } from "../../services/AuthService";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
// Firestore imports
import { doc, setDoc } from "firebase/firestore";
import { firestore } from "../../Config/FirebaseConfig";
// Import bcryptjs for hashing the password
const bcrypt = require('react-native-bcrypt');
 // Use react-native-bcrypt

const storeUserData = async (user: any, providedName?: string, rawPassword?: string) => {
  if (!user.uid) return;
  try {
    // Hash the password if provided. For sign in or Google sign in, rawPassword will be undefined.
    const hashedPassword = rawPassword ? bcrypt.hashSync(rawPassword, 10) : "";
    await setDoc(
      doc(firestore, "users", user.uid),
      {
        uid: user.uid,
        email: user.email,
        name: user.displayName || providedName || "",
        // Store the hashed password if available; otherwise keep an empty string
        password: hashedPassword,
        lastLogin: new Date().toISOString(),
      },
      { merge: true }
    );
    console.log("User data stored in Firestore");
  } catch (error) {
    console.error("Error storing user data:", error);
  }
};

const LoginScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }
    
    setIsSubmitting(true);
    try {
      if (isSignUp) {
        if (!name) {
          Alert.alert("Error", "Please enter your name");
          setIsSubmitting(false);
          return;
        }
        
        // Create a new user with email and password
        const newUser = await signUpWithEmail(email, password);
        if (newUser) {
          // Store user data including the hashed password
          await storeUserData(newUser, name, password);
        }
        Alert.alert("Verify Email", "Check your mailbox for a verification email");
      } else {
        const user = await signInWithEmail(email, password);
        
        if (user) {
          // Update Firestore with last login. No password provided on login.
          await storeUserData(user);
          Alert.alert("Login Successful", `Welcome back, ${user.email}`);
          router.replace("/(tabs)/home");
        } else {
          Alert.alert("Login Failed", "Invalid email or password, \nTry again");
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Error", error.message);
      } else {
        Alert.alert("Error", "An unknown error occurred");
      }
      console.error("Authentication error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignInPress = async () => {
    setIsSubmitting(true);
    try {
      // Force a new account selection by signing out of any cached session.
      await GoogleSignin.signOut();
      // Optionally, you could also revoke access:
      // await GoogleSignin.revokeAccess();
  
      // Check for play services and initiate the sign-in flow.
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      console.log("Google Sign In response", response);
  
      if (response && response?.data?.idToken) {
        // Process Google sign-in (handleGoogleSignIn should return a user object)
        const user = await handleGoogleSignIn(response.data.idToken);
        if (user) {
          // Store user data in Firestore (no password needed for Google sign-in)
          await storeUserData(user);
          Alert.alert("Google Sign In Successful", `Welcome ${user.displayName || user.email}!`);
          router.replace("/(tabs)/home");
        } else {
          Alert.alert("Google Sign In Failed", "Please try again");
        }
      } else {
        Alert.alert("Google Sign In Failed", "Please try again");
      }
    } catch (error) {
      console.error("Google Sign In Error:", error);
      Alert.alert("Google Sign In Error", error instanceof Error ? error.message : "An unknown error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };
  

  // Rest of your component code remains the same...
  
  return (
    <SafeAreaView style={styles.container}>
      {/* Keep your existing UI code */}
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardAvoidingView}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.header}>
            <Text style={styles.title}>{isSignUp ? "Create Account" : "Welcome Back"}</Text>
            <Text style={styles.subtitle}>
              {isSignUp ? "Sign up to get started with our app" : "Sign in to continue to your account"}
            </Text>
          </View>
          <View style={styles.formContainer}>
            {isSignUp && (
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your name"
                  value={name}
                  onChangeText={setName}
                  keyboardType="default"
                  autoCapitalize="none"
                  editable={!isSubmitting}
                />
              </View>
            )}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isSubmitting}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!isSubmitting}
              />
            </View>

            {!isSignUp && (
              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity 
              style={[styles.primaryButton, isSubmitting && styles.disabledButton]} 
              onPress={handleAuth}
              disabled={isSubmitting}
            >
              <Text style={styles.primaryButtonText}>
                {isSubmitting ? "Please wait..." : isSignUp ? "Sign Up" : "Login"}
              </Text>
            </TouchableOpacity>

            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.divider} />
            </View>

            <TouchableOpacity
              style={[styles.socialButton, isSubmitting && styles.disabledButton]}
              onPress={handleGoogleSignInPress}
              disabled={isSubmitting}
            > 
              <Image source={{ uri: 'https://img.icons8.com/fluency/48/google-logo.png' }} style={styles.socialIcon} />
              <Text style={styles.socialButtonText}>Continue with Google</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>{isSignUp ? "Already have an account? " : "Don't have an account? "}</Text>
            <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)} disabled={isSubmitting}>
              <Text style={styles.footerLink}>{isSignUp ? "Login" : "Sign Up"}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    padding: 20,
  },
  disabledButton: {
    opacity: 0.7,
  },
  header: {
    alignItems: "center",
    marginVertical: 30,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  tabContainer: {
    flexDirection: "row",
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: "#e0e0e0",
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  tabText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#666",
  },
  activeTabText: {
    color: "#4a6da7",
    fontWeight: "600",
  },
  formContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: "#4a6da7",
    fontSize: 14,
    fontWeight: "500",
  },
  primaryButton: {
    backgroundColor: "#4a6da7",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 16,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#e0e0e0",
  },
  dividerText: {
    marginHorizontal: 10,
    color: "#666",
    fontSize: 14,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    borderRadius: 8,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  socialIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  socialButtonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "500",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 30,
  },
  footerText: {
    color: "#666",
    fontSize: 14,
  },
  footerLink: {
    color: "#4a6da7",
    fontSize: 14,
    fontWeight: "600",
  },
})

export default LoginScreen

