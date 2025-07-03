import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is logged in on app start
    const savedUser = localStorage.getItem('user');
    const savedCredentials = localStorage.getItem('credentials');
    
    if (savedUser && savedCredentials) {
      setUser(JSON.parse(savedUser));
      // Set default authorization header
      const credentials = JSON.parse(savedCredentials);
      authAPI.setAuthHeader(credentials.username, credentials.password);
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      setLoading(true);
      setError(null);
      
      // Test authentication by making a request to protected endpoint
      const response = await authAPI.login(username, password);
      
      const userData = { username };
      setUser(userData);
      
      // Store user data and credentials
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('credentials', JSON.stringify({ username, password }));
      
      return response;
    } catch (err) {
      setError('Invalid username or password');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, password) => {
    try {
      setLoading(true);
      setError(null);
      
      await authAPI.register({ username, password });
      
      // Auto-login after successful registration
      await login(username, password);
    } catch (err) {
      setError('Registration failed. Username might already exist.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setError(null);
    localStorage.removeItem('user');
    localStorage.removeItem('credentials');
    authAPI.clearAuthHeader();
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 