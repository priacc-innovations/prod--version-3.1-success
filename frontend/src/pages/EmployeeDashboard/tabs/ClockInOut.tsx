import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, LogIn, LogOut, Calendar } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { useAuthStore } from "../../../store/authStore";
import axios from "axios";
import toast from "react-hot-toast";

export default function ClockInOut() {
  const user = useAuthStore((state) => state.user);

  const [todayAttendance, setTodayAttendance] = useState<any | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isClockedIn, setIsClockedIn] = useState(false);

  // Fetch today's attendance
  const fetchTodayAttendance = async () => {
    if (!user?.id) return;

    try {
      const res = await axios.get(`/api/attendance/today/${user.id}`);
      // backend returns either an object or null
      const todayData = res.data || null;

      setTodayAttendance(todayData);
      setIsClockedIn(Boolean(todayData && todayData.loginTime && !todayData.logoutTime));
    } catch (err) {
      console.error("Error fetching attendance:", err);
    }
  };

  useEffect(() => {
    fetchTodayAttendance();

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // Clock In API
  const handleClockIn = async () => {
    if (!user?.id) return;
    try {
      const res = await axios.post(`/api/attendance/login/${user.id}`);
      toast.success(res.data || "Clocked in");
      await fetchTodayAttendance();
    } catch (err) {
      console.error("Clock-in failed:", err);
      toast.error("Clock-in failed");
    }
  };

  // Clock Out API
  const handleClockOut = async () => {
    if (!user?.id) return;
    try {
      const res = await axios.put(`/api/attendance/logout/${user.id}`);
      toast.success(res.data || "Clocked out");
      await fetchTodayAttendance();
    } catch (err) {
      console.error("Clock-out failed:", err);
      toast.error("Clock-out failed");
    }
  };

  // Working hours calculation
  const getWorkingHours = () => {
    if (!todayAttendance?.loginTime) return "0h 0m";

    // loginTime and logoutTime expected as "HH:mm:ss" or "HH:mm[:ss]"
    // create date objects anchored at same arbitrary date
    const parseTime = (t: string | null) => {
      if (!t) return null;
      // ensure t contains seconds — if not, add :00
      const withSeconds = t.split(":").length === 2 ? `${t}:00` : t;
      const dt = new Date(`2000-01-01T${withSeconds}`);
      return isNaN(dt.getTime()) ? null : dt;
    };

    const login = new Date(`${todayAttendance.date}T${todayAttendance.loginTime}`);
    const logout = todayAttendance.logoutTime ? new Date(`${todayAttendance.date}T${todayAttendance.logoutTime}`) : currentTime;
    const combined = new Date(`${todayAttendance.date}T${todayAttendance.loginTime}`);

    if (!login || !logout) return "0h 0m";

    const diff = logout.getTime() - login.getTime();
    if (diff < 0) return "0h 0m";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const getStatusColor = () => {
    if (!todayAttendance) return "text-blue-300 font-bold neon-blue";
    if (isClockedIn) return "text-green-400 font-bold neon-green";
    return "text-red-400 font-bold neon-red";
  };



  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Clock In / Clock Out
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track your daily working hours
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-8 text-white shadow-2xl"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-1">Current Time</h2>
              <p className="text-blue-100">
                {currentTime.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <Clock className="w-8 h-8" />
            </div>
          </div>

          <div className="text-center mb-8">
            <div className="text-6xl font-bold mb-2">
              {currentTime.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </div>

            <div className={`text-lg font-semibold ${getStatusColor()}`}>
              {!todayAttendance
                ? "Not Clocked In"
                : isClockedIn
                  ? "Currently Working"
                  : "Clocked Out"}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={handleClockIn}
              disabled={Boolean(todayAttendance?.loginTime)}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border-2 border-white/40 disabled:opacity-50"
              size="lg"
            >
              <LogIn className="w-5 h-5 mr-2" />
              Clock In
            </Button>

            <Button
              onClick={handleClockOut}
              disabled={!todayAttendance?.loginTime || Boolean(todayAttendance?.logoutTime)}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border-2 border-white/40 disabled:opacity-50"
              size="lg"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Clock Out
            </Button>
          </div>
        </motion.div>

        <div className="space-y-6">
          <Card glassmorphism>
            <CardHeader>
              <CardTitle>Today's Summary</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Clock In */}
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <LogIn className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Clock In</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {todayAttendance?.loginTime || "--:--:--"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Clock Out */}
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                    <LogOut className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Clock Out</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {todayAttendance?.logoutTime || "--:--:--"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Working Hours */}
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Working Hours
                    </p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {getWorkingHours()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Remarks */}
              {todayAttendance?.remarks && (
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-400 mb-1">
                    Status
                  </p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    {todayAttendance.remarks}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Policy Card (unchanged) */}
          <Card glassmorphism>
            <CardHeader>
              <CardTitle>Working Hours Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 mt-0.5 text-blue-500" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Standard Hours
                    </p>
                    <p>9:00 AM - 6:00 PM (9 hours)</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 mt-0.5 text-green-500" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Grace Period
                    </p>
                    <p>9:00 AM - 9:05 AM</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <LogIn className="w-4 h-4 mt-0.5 text-orange-500" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Late Login
                    </p>
                    <p>After 9:05 AM</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <LogOut className="w-4 h-4 mt-0.5 text-red-500" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Early Logout
                    </p>
                    <p>Before 6:00 PM</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
