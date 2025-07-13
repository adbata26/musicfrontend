import React from "react";
import { useAuth } from "./AuthProvider";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const { user } = useAuth();

  if (!user) {
    // Not logged in at all
    return <Navigate to="/login" />;
  }

  if (role && user.role !== role) {
    // Logged in but with the wrong role
    return <Navigate to="/" />;
  }

  return children;
}
