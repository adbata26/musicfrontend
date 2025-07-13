import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../auth/AuthProvider";

export default function Navbar() {
  const { darkMode, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav
      className={`${
        darkMode ? "dark" : ""
      } p-4 bg-gray-100 dark:bg-gray-800 shadow-md flex justify-between items-center`}
    >
      <h1 className="text-xl font-bold text-gray-800 dark:text-white">
        🎵 MusicApp
      </h1>

      <div className="flex items-center gap-4 text-sm">
        {user?.role === "artist" && (
          <>
            <Link to="/artist/dashboard" className="hover:underline">
              Dashboard
            </Link>
            <Link to="/artist/upload" className="hover:underline">
              Upload
            </Link>
            <Link to="/artist/summary" className="hover:underline">
              Summary
            </Link>
          </>
        )}

        {!user && (
          <>
            <Link to="/" className="hover:underline">
              Home
            </Link>
            <Link to="/login" className="hover:underline">
              Login
            </Link>
            <Link to="/register" className="hover:underline">
              Register
            </Link>
          </>
        )}

        {user && (
          <>
            <span className="text-gray-600 dark:text-gray-300">
              {user.name} ({user.role})
            </span>
            <button
              onClick={handleLogout}
              className="text-red-500 hover:underline"
            >
              Logout
            </button>
          </>
        )}

        <button
          onClick={toggleTheme}
          className="ml-2 px-2 py-1 border rounded text-xs"
        >
          {darkMode ? "☀ Light" : "🌙 Dark"}
        </button>
      </div>
    </nav>
  );
}
