import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AuthProvider from "./auth/AuthProvider";
import ThemeProvider from "./context/ThemeContext";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./auth/ProtectedRoute";

import Login from "./auth/Login";
import Register from "./auth/Register";

import ArtistDashboard from "./pages/ArtistDashboard";
import UploadSong from "./pages/UploadSong";
import Summary from "./pages/Summary";
import ListenerHome from "./pages/ListenerHome";
import SongDetails from "./pages/SongDetails";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
     
          <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
            <Navbar />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<ListenerHome />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/song/:id" element={<SongDetails />} />

              {/* Protected Artist Routes */}
              <Route
                path="/artist/dashboard"
                element={
                  <ProtectedRoute role="artist">
                    <ArtistDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/artist/upload"
                element={
                  <ProtectedRoute role="artist">
                    <UploadSong />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/artist/summary"
                element={
                  <ProtectedRoute role="artist">
                    <Summary />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
//npm create vite@latest . --template react
//npm install -D @vitejs/plugin-react

//https://tailwindcss.com/docs/installation/using-vite

// npm install react react-dom

// npm install eslint --save-dev
// npx eslint --init

// npm install react-hook-form
// npm install react-router-dom

//npm install jwt-decode
// It’s a small, zero-dependency JavaScript library used to decode JSON Web Tokens (JWTs) — particularly the payload portion — without verifying the signature.

//npm install wavesurfer.js

//npm install html2pdf.js

//npm install xlsx
