/* eslint-disable react/prop-types */
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authenticated, setAuthenticated] = useState(false)
  const [user, setUser] = useState(null); // Holds user data (e.g., id, name, role)
  const [loading, setLoading] = useState(false); // Loading state for initial auth check



  // Check for a token in localStorage to persist login
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem("user");
    // console.log("Token", token)
    if (token) {
      console.log("token", token)
      setAuthenticated(true)
      setUser(JSON.parse(userData));
    } else {
      setLoading(false);
    }
  }, []);

  // Login function
  const login = (credentials) => {
    setAuthenticated(true);
    setUser(credentials)
    console.log("login called", credentials)

  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user')
    setUser(null);
    setAuthenticated(false)
  };

  // Helper function to check if user is SUPER_ADMIN
  const isSuperAdmin = () => {
    return user?.role === 'SUPER_ADMIN';
  };

  // Helper function to check if user is ADMIN (regular admin)
  const isAdmin = () => {
    return user?.role === 'ADMIN';
  };

  // Helper function to check if user has any admin role
  const isAnyAdmin = () => {
    return user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN';
  };

  // Helper function to check if user has a specific permission
  const hasPermission = (permission) => {
    // SUPER_ADMIN has all permissions
    if (user?.role === 'SUPER_ADMIN') {
      return true;
    }

    // Check if user has the permission in their permissions object
    return user?.permissions?.[permission] === true;
  };

  // Helper function to get user role
  const getRole = () => {
    return user?.role || null;
  };

  // Helper function to get all permissions
  const getPermissions = () => {
    return user?.permissions || {};
  };

  return (
    <AuthContext.Provider value={{
      authenticated,
      user,
      login,
      logout,
      loading,
      role: user?.role,
      permissions: user?.permissions,
      isSuperAdmin,
      isAdmin,
      isAnyAdmin,
      hasPermission,
      getRole,
      getPermissions
    }}>
      {children}
    </AuthContext.Provider>
  );
};
