import { motion } from "framer-motion";
import { Moon, Sun, LogOut, Bell } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";
import logo from '../../assests/teamhub-logo.png';


export default function Navbar() {
  const { user, clearUser, theme, toggleTheme } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearUser();
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 shadow-sm"
    >
      <div className="w-full">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">

          {/* LEFT */}
          <div className="flex items-center gap-3">

            {/* 🔵 NEW — T Logo replacing Sparkles */}
            <motion.img
              src={logo}
              alt="TeamHub Logo"
              className="w-10 h-10 rounded-lg shadow-lg object-contain"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            />

            <div>
              {/* 🔵 NEW — Replace MAMA with TeamHub */}
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
                TeamHub
              </h1>

              <p className="text-xs text-gray-500 dark:text-gray-400">
                {user?.role === "admin"
                  ? "Admin Portal"
                  : user?.role === "hr"
                    ? "HR Portal"
                    : "Employee Portal"}
              </p>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-4">

            {/* Notification */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </motion.button>

            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {theme === "light" ? (
                <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              ) : (
                <Sun className="w-5 h-5 text-gray-300" />
              )}
            </motion.button>

            {/* Profile */}
            <div
              className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-700 cursor-pointer"
              onClick={() => navigate("/profile")}
            >
              <img
                src={
                  user?.photoUrl && user.photoUrl !== ""
                    ? user.photoUrl
                    : `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`
                }
                alt={user?.fullName}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-500/20"
              />

              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {user?.fullName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                  {user?.role}
                </p>
              </div>
            </div>

            {/* Logout */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-600 dark:text-red-400 rounded-full flex items-center gap-2 transition"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline font-medium">Logout</span>
            </motion.button>

          </div>
        </div>
      </div>
    </motion.nav>
  );
}
