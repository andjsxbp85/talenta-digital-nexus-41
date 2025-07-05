
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  registeredUsers: User[];
  addUser: (userData: { email: string; password: string; role: string }) => void;
  deleteUser: (userId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Initialize with default admin user and load from localStorage
  const [registeredUsers, setRegisteredUsers] = useState<(User & { password: string })[]>(() => {
    const stored = localStorage.getItem('registeredUsers');
    if (stored) {
      return JSON.parse(stored);
    }
    // Default admin user
    return [
      {
        id: '1',
        email: 'admin@kemenkominfo.go.id',
        role: 'admin' as const,
        password: 'admin123'
      }
    ];
  });

  // Save registered users to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  useEffect(() => {
    // Check for existing login session
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('authToken');
    
    if (storedUser && token) {
      const userData = JSON.parse(storedUser);
      // Verify the user still exists in registered users
      const userExists = registeredUsers.find(u => u.id === userData.id && u.email === userData.email);
      if (userExists) {
        setUser(userData);
      } else {
        // User was removed, clear session
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
      }
    }
    setIsLoading(false);
  }, [registeredUsers]);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Check against registered users
    const registeredUser = registeredUsers.find(u => 
      (u.email === email || u.email === 'admin') && u.password === password
    );
    
    if (registeredUser) {
      const userData = {
        id: registeredUser.id,
        email: registeredUser.email,
        role: registeredUser.role
      };
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('authToken', 'token-' + Date.now());
      return true;
    }
    
    // Also check for legacy 'admin' username with admin email
    if (email === 'admin' && password === 'admin123') {
      const adminUser = registeredUsers.find(u => u.email === 'admin@kemenkominfo.go.id');
      if (adminUser) {
        const userData = {
          id: adminUser.id,
          email: adminUser.email,
          role: adminUser.role
        };
        
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('authToken', 'token-' + Date.now());
        return true;
      }
    }
    
    return false;
  };

  const addUser = (userData: { email: string; password: string; role: string }) => {
    const newUser = {
      id: Date.now().toString(),
      email: userData.email,
      role: userData.role as 'admin' | 'user',
      password: userData.password
    };
    
    setRegisteredUsers(prev => [...prev, newUser]);
  };

  const deleteUser = (userId: string) => {
    setRegisteredUsers(prev => prev.filter(u => u.id !== userId));
    
    // If the currently logged in user is being deleted, log them out
    if (user && user.id === userId) {
      logout();
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isLoading, 
      registeredUsers: registeredUsers.map(({ password, ...user }) => user),
      addUser,
      deleteUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};
