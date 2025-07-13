import React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const storedToken = localStorage.getItem("token");
  const [token, setToken] = useState(storedToken);
  const [user, setUser] = useState(() => {
    if (storedToken) {
      try {
        return jwtDecode(storedToken);
      } catch {
        return null;
      }
    }
    return null;
  });

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (err) {
        logout();
      }
    }
  }, [token]);

  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    const decoded = jwtDecode(newToken);
    setUser(decoded);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  // 👇 Wrapper around fetch to handle 401/403
  const secureFetch = async (url, options = {}) => {
    const isFormData = options.body instanceof FormData;

    const headers = {
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    };

    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok && [401, 403].includes(response.status)) {
      logout();
      throw new Error("Unauthorized. You have been logged out.");
    }

    return response;
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, secureFetch }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
