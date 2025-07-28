import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface UserContextType {
  user: User | null;
  loading: boolean;
  updateBalance: (amount: number) => void;
  updateUser: (userData: Partial<User>) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Моковые данные пользователя
const mockUser: User = {
  id: '1',
  email: 'user@example.com',
  name: 'Дмитрий Петров',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  balance: {
    monetus: 1250,
    currency: 'USD'
  },
  subscription: {
    plan: 'pro',
    expiresAt: new Date('2024-12-31')
  }
};

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Имитация загрузки пользователя
    setTimeout(() => {
      setUser(mockUser);
      setLoading(false);
    }, 1000);
  }, []);

  const updateBalance = (amount: number) => {
    if (user) {
      setUser({
        ...user,
        balance: {
          ...user.balance,
          monetus: user.balance.monetus + amount
        }
      });
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({
        ...user,
        ...userData
      });
    }
  };

  const logout = () => {
    setUser(null);
  };

  const value: UserContextType = {
    user,
    loading,
    updateBalance,
    updateUser,
    logout
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}; 