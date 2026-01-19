import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { authApi } from '../api/authApi';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'employee';
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  shouldRedirect: boolean; // Add this
}

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGIN_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'RESET_REDIRECT' }; // Add this

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isLoading: false,
  isAuthenticated: false,
  shouldRedirect: false, // Add this
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true, shouldRedirect: false };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        shouldRedirect: true, // Set redirect flag
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        shouldRedirect: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        shouldRedirect: false,
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'RESET_REDIRECT':
      return { ...state, shouldRedirect: false };
    default:
      return state;
  }
};

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: 'admin' | 'employee') => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  resetRedirect: () => void; // Add this
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (state.token) {
      localStorage.setItem('token', state.token);
    } else {
      localStorage.removeItem('token');
    }
    if (state.user) {
      localStorage.setItem('user', JSON.stringify(state.user));
    } else {
      localStorage.removeItem('user');
    }
  }, [state.token, state.user]);

 // AuthContext.tsx - Update the login function
const login = async (email: string, password: string): Promise<void> => {
  try {
    console.log('🔐 AuthContext: Starting login');
    dispatch({ type: 'LOGIN_START' });
    
    const response = await authApi.login({ email, password });
    console.log('✅ AuthContext: Login successful', response);
    
    // Store in localStorage immediately
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    
    dispatch({
      type: 'LOGIN_SUCCESS',
      payload: {
        user: response.data.user,
        token: response.data.token,
      },
    });
    
    console.log('🔄 AuthContext: State updated, shouldRedirect:', true);
    
  } catch (error: any) {
    console.error('❌ AuthContext: Login failed', error);
    
    // Clear any existing auth data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    dispatch({ type: 'LOGIN_FAILURE' });
    throw error;
  }
};

  const register = async (name: string, email: string, password: string, role?: 'admin' | 'employee'): Promise<void> => {
    try {
      dispatch({ type: 'LOGIN_START' });
      const response = await authApi.register({ name, email, password, role });
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: response.data.user,
          token: response.data.token,
        },
      });
    } catch (error: any) {
      dispatch({ type: 'LOGIN_FAILURE' });
      throw error;
    }
  };

  const logout = (): void => {
    authApi.logout();
    dispatch({ type: 'LOGOUT' });
  };

  const checkAuth = async (): Promise<void> => {
    const token = localStorage.getItem('token');
    if (!token) {
      dispatch({ type: 'LOGIN_FAILURE' });
      return;
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await authApi.getCurrentUser();
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: response.data.user,
          token,
        },
      });
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const resetRedirect = (): void => {
    dispatch({ type: 'RESET_REDIRECT' });
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    checkAuth,
    resetRedirect,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};