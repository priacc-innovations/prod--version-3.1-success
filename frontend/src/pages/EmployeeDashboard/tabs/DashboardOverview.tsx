import { useEffect, useState } from 'react';
import { CheckCircle, Clock, Calendar, Wallet, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import StatCard from '../../../components/shared/StatCard';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { useAuthStore } from '../../../store/authStore';
import api from '../../../api/axiosInstance';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

const COLORS = ['#10b981', '#ef4444', '#f59e0b', '#3b82f6'];

export default function DashboardOverview() {
  const user = useAuthStore((state) => state.user);

  const [todayStatus, setTodayStatus] = useState<any>(null);

  const [monthStats, setMonthStats] = useState({
    present: 0,
    absent: 0,
    halfDay: 0,
    leave: 0,
  });

  const [walletBalance, setWalletBalance] = useState(0);
  const [performanceScore, setPerformanceScore] = useState(0);

  useEffect(() => {
    if (user?.id) {
      loadDashboardData(user.id);
    }
  }, [user]);

  const normalizeStatus = (status: string) => {
    if (!status) return "";
    return status.toLowerCase().replace(" ", "_");
  };

  const loadDashboardData = async (id: number) => {
    try {
      // ------------------ TODAY'S ATTENDANCE ------------------
      const todayRes = await api.get(`/attendance/today/${id}`); // FIXED
      const t = todayRes.data;

      setTodayStatus({
        login_time: t?.loginTime || "--:--",
        logout_time: t?.logoutTime || "--:--",
        status: normalizeStatus(t?.status) || "absent",
        remarks: t?.remarks || "",
      });

      // ------------------ MONTHLY ATTENDANCE ------------------
      const monthRes = await api.get(`/attendance/user/${id}`);
      const list = monthRes.data || [];

      const normalized = list.map((a: any) => ({
        status: normalizeStatus(a.status),
      }));

      setMonthStats({
        present: normalized.filter((a: { status: string; }) => a.status === "present" || a.status === "late").length,
        absent: normalized.filter((a: { status: string; }) => a.status === "absent").length,
        halfDay: normalized.filter((a: { status: string; }) => a.status === "half_day").length,
        leave: normalized.filter((a: { status: string; }) => a.status === "leave").length,
      });

      // ------------------ WALLET ------------------
      // ------------------ WALLET (Correct API + ₹ earnings) ------------------
      // ------------------ WALLET (Correct Earnings From MyWallet) ------------------
      const walletRes = await fetch(`/salary/salary-details/${id}`);
      const salaryData = await walletRes.json();

      setWalletBalance(salaryData.currentMonthEarned || 0);


      // ₹ Provisional Earnings from MyWallet


      // ------------------ PERFORMANCE ------------------
      // const perfRes = await api.get(`/performance/`);
      // const performance = perfRes.data || [];

      // if (performance.length > 0) {
      //   const total = performance.reduce(
      //     (acc: number, p: any) => acc + (p.rating || 0),
      //     0
      //   );
      //   setPerformanceScore(Number((total / performance.length).toFixed(1)));
      // }

    } catch (error) {
      //console.error("Dashboard error:", error);
    }
  };

  const attendanceChartData = [
    { name: 'Present', value: monthStats.present },
    { name: 'Absent', value: monthStats.absent },
    { name: 'Half Day', value: monthStats.halfDay },
    { name: 'Leave', value: monthStats.leave },
  ];

  const PERFORMANCE_SAMPLE = [
    { week: 'Week 1', score: 4.0 },
    { week: 'Week 2', score: 4.2 },
    { week: 'Week 3', score: 4.1 },
    { week: 'Week 4', score: 4.5 },
  ];

  return (
    <div className="space-y-6">

      {/* USER WELCOME */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome back, {user?.fullName}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Here's your overview for today and this month
        </p>
      </div>

      {/* TODAY STATUS CARD */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 text-white shadow-2xl"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">Today's Status</h2>
            <p className="text-blue-100">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>

          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <Clock className="w-8 h-8" />
          </div>
        </div>

        {/* Times */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-blue-100 text-sm">Login Time</p>
            <p className="text-2xl font-bold">{todayStatus?.login_time}</p>
          </div>

          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-blue-100 text-sm">Logout Time</p>
            <p className="text-2xl font-bold">{todayStatus?.logout_time}</p>
          </div>

          <div className="col-span-2 bg-white/10 rounded-lg p-4">
            <p className="text-blue-100 text-sm">Status</p>
            <p className="text-2xl font-bold capitalize">{todayStatus?.status}</p>

            {todayStatus?.remarks && (
              <p className="text-sm text-blue-100 mt-2">{todayStatus.remarks}</p>
            )}
          </div>
        </div>
      </motion.div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Present Days" value={monthStats.present} icon={CheckCircle} color="green" />
        <StatCard title="Absent Days" value={monthStats.absent} icon={Calendar} color="red" />
        <StatCard title="Performance Score" value={`${performanceScore}/5`} icon={Star} color="purple" />
        <StatCard
          title="Month Earnings"
          value={`₹${walletBalance.toLocaleString()}`}
          icon={Wallet}
          color="cyan"
        />

      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <Card>
          <CardHeader><CardTitle>Monthly Attendance</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={attendanceChartData} outerRadius={100} dataKey="value">
                  {attendanceChartData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Weekly Performance Trend</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={PERFORMANCE_SAMPLE}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
