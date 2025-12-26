'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // 🔴 IMPORTANT

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(
          'https://holy-saint-backend.onrender.com/api/v1/auth/me',
          {
            credentials: 'include'
          }
        );

        if (!res.ok) {
          setUser(null);
        } else {
          const data = await res.json();
          setUser(data.user || data.data?.user);
        }
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false); // 🔴 AUTH CHECK FINISHED
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
