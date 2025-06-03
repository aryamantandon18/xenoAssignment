import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../services/auth';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { createUser } from '../services/api';
import { toast } from "react-hot-toast";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

    const syncUserWithBackend = async (firebaseUser) => {
    await createUser({
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
      emailVerified: firebaseUser.emailVerified
    });
  };
  async function signup(email, password, name) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user);
      await syncUserWithBackend(userCredential.user);
      
      return userCredential;
    } catch (error) {
      throw error;
    }
  }

  async function login(email, password) {
    try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    if (!user.emailVerified) {
      toast.error("Please verify your email before logging in.");
      throw new Error("Email not verified");
    }
    toast.success("Login successful!");
    return user;
  } catch (error) {
      if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
      toast.error("Invalid email or password.");
    } else if (error.message === "Email not verified") {
      // already handled above
    } else {
      toast.error("Login failed. Please try again.");
    }
    throw error;
  }
  }

  async function googleSignIn() {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      await syncUserWithBackend(userCredential.user);
      return userCredential;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    return signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
  
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
    signup,
    login,
    googleSignIn,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}