'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type UserRole = 'Admin' | 'Employer' | 'Candidate';

interface User {
  id: number;
  username: string;
  password_DO_NOT_STORE_IN_PRODUCTION: string; // This is insecure, for prototype only
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  signup: (username: string, password: string, role: UserRole) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// In-memory user store for prototype purposes.
// In a real application, this would be a secure database.
const users: User[] = [
  {
    id: 1,
    username: 'admin',
    password_DO_NOT_STORE_IN_PRODUCTION: 'admin',
    role: 'Admin',
  },
];

let nextUserId = 2;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (username: string, password: string): boolean => {
    const foundUser = users.find(
      (u) => u.username === username && u.password_DO_NOT_STORE_IN_PRODUCTION === password
    );
    if (foundUser) {
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const signup = (username: string, password: string, role: UserRole): boolean => {
    if (users.some((u) => u.username === username)) {
      return false; // Username already exists
    }
    const newUser: User = {
      id: nextUserId++,
      username,
      password_DO_NOT_STORE_IN_PRODUCTION: password,
      role,
    };
    users.push(newUser);
    setUser(newUser); // Automatically log in after signup
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
