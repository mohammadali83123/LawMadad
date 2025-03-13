import { auth } from "../Config/FirebaseConfig";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  signInWithCredential, 
  PhoneAuthProvider 
} from "firebase/auth";

import { sendEmailVerification } from "firebase/auth";

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

// Login
export const signInWithEmail = async (email, password) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    // Check if the email is verified
    if (!userCredential.user.emailVerified) {
      throw new Error("Email not verified. Please check your inbox.");
    }

    return userCredential.user;
  } catch (error) {
    console.error("Sign in error:", error.message);
    return null;
    throw error;
    
  }
};