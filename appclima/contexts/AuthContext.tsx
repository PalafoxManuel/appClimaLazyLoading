import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  UserCredential,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth } from '@/firebase';

type AuthCtx = {
  user: User | null;
  loading: boolean;
  login: (e: string, p: string) => Promise<UserCredential>;
  register: (e: string, p: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
};

const Ctx = createContext<AuthCtx>(null!);
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }: React.PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() =>
    onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    }),
  []);

  const login = (email: string, pass: string) =>
    signInWithEmailAndPassword(auth, email, pass);

  const register = (email: string, pass: string) =>
    createUserWithEmailAndPassword(auth, email, pass);

  const logout = () => signOut(auth);

  return (
    <Ctx.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </Ctx.Provider>
  );
}
