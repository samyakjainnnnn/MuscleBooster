import React, { createContext, useEffect, useMemo, useState } from "react";
import { User, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut as firebaseSignOut, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, updateProfile, signInWithCredential } from "firebase/auth";
import { auth, app } from "@/firebaseConfig";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

type SignInProps = {
  email: string;
  password: string;
};

type SignUpProps = {
  name: string;
  email: string;
  password: string;
};

type AuthContextDataType = {
  user: User | null;
  avatarUri: string | null;
  isLoading: boolean;
  signIn: (props: SignInProps) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (props: SignUpProps) => Promise<void>;
  signInWithGoogle: () => Promise<void>; 
};

type AuthContextProviderProps = {
  children: React.ReactNode;
};

export const AuthContext = createContext<AuthContextDataType>({} as AuthContextDataType);

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const auth = getAuth(app);

  // Handle sign-in
  async function handleSignIn({ email, password }: SignInProps) {
    try {
      setIsLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Sign-In Error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  // Handle sign-up
  async function handleSignUp({ name, email, password }: SignUpProps) {
    try {
      setIsLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (userCredential.user) {
        await updateProfile(userCredential.user, { displayName: name }); // Proper usage of `updateProfile`
      }
    } catch (error) {
      console.error("Sign-Up Error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSignInWithGoogle() {
    try {
      setIsLoading(true);
      await GoogleSignin.signIn();
      const googleUser = await GoogleSignin.getTokens();
      const googleCredential = GoogleAuthProvider.credential(googleUser.idToken);
      const result = await signInWithCredential(auth, googleCredential); // Firebase signIn
      setUser(result.user);
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  // Handle sign-out
  async function handleSignOut() {
    try {
      await firebaseSignOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Sign-Out Error:", error);
      throw error;
    }
  }

  // Avatar URI (if you store user avatars in Firebase Storage)
  const avatarUri = useMemo(() => {
    return user?.photoURL || null;
  }, [user]);

  // Sync user state with Firebase authentication
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  return (
    <AuthContext.Provider
      value={{
        user,
        avatarUri,
        isLoading,
        signIn: handleSignIn,
        signOut: handleSignOut,
        signUp: handleSignUp,
        signInWithGoogle: handleSignInWithGoogle
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
