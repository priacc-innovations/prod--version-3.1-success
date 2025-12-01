
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

import { authService } from "./utils/authService";
import { useAuthStore } from "./store/authStore";

import Login from "./pages/Auth/Login";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import HRDashboard from "./pages/HRDashboard/HRDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard/EmployeeDashboard";

import ProtectedRoute from "./components/ProtectedRoute";
import ProfileRoute from './pages/Profile';
import Sigin from './pages/Auth/Siginin';

function App() {
  const { setUser, theme } = useAuthStore();

  // Theme
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  // Auto login
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    authService
      .getLoggedInUser(userId)
      .then((data) => {
        setUser(data);
      })
      .catch(() => localStorage.removeItem("userId"));
  }, []);

  return (
    <>
      <Toaster position="top-center" />
      <BrowserRouter>

        <Routes>
          {/* Login */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<ProfileRoute />}></Route>
          <Route path="/sigin" element={< Sigin />}></Route>
          {/* Admin */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* HR */}
          <Route
            path="/hr"
            element={
              <ProtectedRoute role="hr">
                <HRDashboard />
              </ProtectedRoute>
            }
          />

          {/* Employee */}
          <Route
            path="/employee"
            element={
              <ProtectedRoute role="employee">
                <EmployeeDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="/unauthorized" element={<h1>Unauthorized</h1>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
