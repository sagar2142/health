import React, { createContext, useContext, useState, ReactNode } from 'react';

type UserType = {
  email: string;
  name?: string;
  phone?: string;
  bloodGroup?: string;
};

type AuthContextType = {
  isAuthenticated: boolean;
  user: UserType | null;
  login: (token: string, user: UserType) => Promise<void>;
  logout: () => Promise<void>;
  register: (
    email: string,
    password: string,
    name?: string,
    phone?: string,
    bloodGroup?: string
  ) => Promise<{ success: boolean; error?: string; token?: string; user?: UserType }>;
  setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
};

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: async () => {},
  logout: async () => {},
  register: async () => ({ success: false }),
  setUser: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserType | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (token: string, userData: UserType) => {
    setUser(userData);
    setIsAuthenticated(true);
    // Optionally persist token/user in AsyncStorage
    const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = async () => {
    setUser(null);
    setIsAuthenticated(false);
    const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
  };

  const register = async (email: string, password: string, name?: string, phone?: string, bloodGroup?: string) => {
    try {
      // Register on your app server
      const res = await fetch('http://10.155.97.162:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, phone, bloodGroup }),
      });
      const data = await res.json();
      // Return token and user if available for immediate login
      return {
        success: !!data.success,
        error: data.error,
        token: data.token,
        user: data.user,
      };
    } catch (err) {
      return { success: false, error: 'Network error' };
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, register, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
