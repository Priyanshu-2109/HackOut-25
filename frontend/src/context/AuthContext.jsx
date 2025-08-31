import React, { createContext, useContext, useState, useEffect } from 'react';
import { comprehensiveLocalStorageService } from '../utils/comprehensiveLocalStorageService';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);
        
        // Check for existing user session
        const savedUser = localStorage.getItem('hydrogrid_user');
        const authToken = localStorage.getItem('hydrogrid_token');
        
        if (savedUser && authToken) {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          setIsAuthenticated(true);
        } else {
          // Create demo user if none exists
          await createDemoUserIfNeeded();
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Create demo user on error
        await createDemoUserIfNeeded();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const createDemoUserIfNeeded = async () => {
    try {
      // Check if demo user already exists
      const existingUser = localStorage.getItem('hydrogrid_user');
      if (existingUser) return;

      // Create demo user
      const demoUser = {
        id: 'demo-user-' + Date.now(),
        email: 'demo@hydrogrid.com',
        name: 'Demo User',
        role: 'admin',
        company: 'HydroGrid Demo',
        createdAt: new Date().toISOString(),
        preferences: {
          theme: 'light',
          notifications: true,
          autoSave: true
        }
      };

      // Save demo user
      localStorage.setItem('hydrogrid_user', JSON.stringify(demoUser));
      localStorage.setItem('hydrogrid_token', 'demo-token-' + Date.now());
      
      // Initialize comprehensive data for demo user
      await comprehensiveLocalStorageService.initializeAllData();
      
      setUser(demoUser);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error creating demo user:', error);
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      
      // Check if there's a temp signup user first
      const tempSignupUser = localStorage.getItem('hydrogrid_signup_temp');
      if (tempSignupUser) {
        const parsedTempUser = JSON.parse(tempSignupUser);
        if (parsedTempUser.email === (credentials.identifier || credentials.email)) {
          // Move temp user to active user
          localStorage.setItem('hydrogrid_user', JSON.stringify(parsedTempUser));
          localStorage.setItem('hydrogrid_token', 'token-' + Date.now());
          localStorage.removeItem('hydrogrid_signup_temp');
          
          // Initialize comprehensive data
          await comprehensiveLocalStorageService.initializeAllData();
          
          setUser(parsedTempUser);
          setIsAuthenticated(true);
          
          return {
            success: true,
            message: 'Login successful!',
            user: parsedTempUser
          };
        }
      }
      
      // Demo login - accept any credentials
      const demoUser = {
        id: 'user-' + Date.now(),
        email: credentials.identifier || credentials.email || 'demo@hydrogrid.com',
        name: credentials.name || 'Demo User',
        role: 'admin',
        company: 'HydroGrid',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        preferences: {
          theme: 'light',
          notifications: true,
          autoSave: true
        }
      };

      // Save to localStorage
      localStorage.setItem('hydrogrid_user', JSON.stringify(demoUser));
      localStorage.setItem('hydrogrid_token', 'token-' + Date.now());
      
      // Initialize or refresh comprehensive data
      await comprehensiveLocalStorageService.initializeAllData();
      
      setUser(demoUser);
      setIsAuthenticated(true);

      return {
        success: true,
        message: 'Login successful!',
        user: demoUser
      };
    } catch (error) {
      console.error('Login failed:', error);
      return {
        success: false,
        message: 'Login failed. Please try again.',
        error: error.message
      };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => {
    try {
      setLoading(true);
      
      // Demo signup - create user with provided data
      const newUser = {
        id: 'user-' + Date.now(),
        email: userData.email,
        name: userData.fullname || userData.name,
        username: userData.username,
        role: 'user',
        company: userData.company || 'HydroGrid',
        createdAt: new Date().toISOString(),
        preferences: {
          theme: 'light',
          notifications: true,
          autoSave: true
        }
      };

      // Save to localStorage (don't auto-login)
      localStorage.setItem('hydrogrid_signup_temp', JSON.stringify(newUser));

      return {
        success: true,
        message: 'Account created successfully! Please log in with your credentials.',
        user: newUser
      };
    } catch (error) {
      console.error('Signup failed:', error);
      return {
        success: false,
        message: 'Signup failed. Please try again.',
        error: error.message
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      
      // Clear localStorage
      localStorage.removeItem('hydrogrid_user');
      localStorage.removeItem('hydrogrid_token');
      localStorage.removeItem('hydrogrid_signup_temp');
      
      // Reset state
      setUser(null);
      setIsAuthenticated(false);
      
      return {
        success: true,
        message: 'Logged out successfully'
      };
    } catch (error) {
      console.error('Logout failed:', error);
      return {
        success: false,
        message: 'Logout failed',
        error: error.message
      };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates) => {
    try {
      if (!user) throw new Error('No user logged in');
      
      const updatedUser = {
        ...user,
        ...updates,
        updatedAt: new Date().toISOString()
      };
      
      localStorage.setItem('hydrogrid_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      return {
        success: true,
        message: 'Profile updated successfully',
        user: updatedUser
      };
    } catch (error) {
      console.error('Profile update failed:', error);
      return {
        success: false,
        message: 'Failed to update profile',
        error: error.message
      };
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    signup,
    logout,
    updateProfile,
    createDemoUserIfNeeded
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
