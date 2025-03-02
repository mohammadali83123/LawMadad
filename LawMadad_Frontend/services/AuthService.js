import { auth } from "../Config/FirebaseConfig";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  GoogleAuthProvider, 
  signInWithCredential, 
  PhoneAuthProvider 
} from "firebase/auth";
import * as WebBrowser from "expo-web-browser";
import { useAuthRequest } from "expo-auth-session/providers/google"; 
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


// Logout
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout error:", error.message);
  }
};

// Fix Google Sign-In Hook Issue
// WebBrowser.maybeCompleteAuthSession();

// export const useGoogleAuth = () => {
//   const [request, response, promptAsync] = useAuthRequest({
//     expoClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
//     androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
//   });

//   const handleGoogleSignIn = async () => {
//     try {
//       const result = await promptAsync();
//       if (result?.type === "success") {
//         const { id_token } = result.authentication;
//         const credential = GoogleAuthProvider.credential(id_token);
//         return signInWithCredential(auth, credential);
//       }
//     } catch (error) {
//       console.error("Google Sign-In Error:", error);
//       throw error;
//     }
//   };

//   return { handleGoogleSignIn };
// };

// Phone Authentication (Corrected)
export const sendOTP = async (phoneNumber, setVerificationId) => {
  try {
    const provider = new PhoneAuthProvider(auth);
    const verificationId = await provider.verifyPhoneNumber(phoneNumber, auth);
    setVerificationId(verificationId);
  } catch (error) {
    console.error("Error sending OTP:", error.message);
    throw error;
  }
};

export const verifyOTP = async (verificationId, otp) => {
  try {
    const credential = PhoneAuthProvider.credential(verificationId, otp);
    return signInWithCredential(auth, credential);
  } catch (error) {
    console.error("Error verifying OTP:", error.message);
    throw error;
  }
};
