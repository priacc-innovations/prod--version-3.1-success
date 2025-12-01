// import { useEffect, useState } from 'react';
// import { Users, TrendingUp, Calendar, Wallet, CheckCircle, XCircle } from 'lucide-react';
// import StatCard from '../../../components/shared/StatCard';
// import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
// import { supabase } from '../../../lib/supabase';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend, LabelList } from 'recharts';

// const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

// export default function DashboardOverview() {
//   const [stats, setStats] = useState({
//     totalEmployees: 0,
//     presentToday: 0,
//     avgPerformance: 0,
//     pendingLeaves: 0,
//   });

//   useEffect(() => {
//     loadStats();
//   }, []);

//   const loadStats = async () => {
//     setStats({
//       totalEmployees: 50,
//       presentToday: 45,
//       avgPerformance: 4.3,
//       pendingLeaves: 3,
//     });
//   };

//   const attendanceData = [
//     { name: 'Mon', present: 45, absent: 5 },
//     { name: 'Tue', present: 47, absent: 3 },
//     { name: 'Wed', present: 46, absent: 4 },
//     { name: 'Thu', present: 48, absent: 2 },
//     { name: 'Fri', present: 44, absent: 6 },
//   ];

//   const departmentData = [
//     { name: 'Engineering', value: 25 },
//     { name: 'Sales', value: 15 },
//     { name: 'Marketing', value: 10 },
//     { name: 'HR', value: 5 },
//   ];

//   const performanceTrend = [
//     { month: 'Jan', score: 3.8 },
//     { month: 'Feb', score: 4.0 },
//     { month: 'Mar', score: 4.2 },
//     { month: 'Apr', score: 4.1 },
//     { month: 'May', score: 4.4 },
//     { month: 'Jun', score: 4.3 },
//   ];

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
//           Admin Dashboard
//         </h1>
//         <p className="text-gray-600 dark:text-gray-400">
//           Welcome back! Here's what's happening with your team today.
//         </p>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <StatCard
//           title="Total Employees"
//           value={stats.totalEmployees}
//           icon={Users}
//           color="blue"
//           trend={{ value: 12, isPositive: true }}
//           delay={0}
//         />
//         <StatCard
//           title="Present Today"
//           value={stats.presentToday}
//           icon={CheckCircle}
//           color="green"
//           trend={{ value: 5, isPositive: true }}
//           delay={0.1}
//         />
//         <StatCard
//           title="Avg Performance"
//           value={`${stats.avgPerformance}/5`}
//           icon={TrendingUp}
//           color="purple"
//           trend={{ value: 8, isPositive: true }}
//           delay={0.2}
//         />
//         <StatCard
//           title="Pending Leaves"
//           value={stats.pendingLeaves}
//           icon={Calendar}
//           color="orange"
//           delay={0.3}
//         />
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <Card glassmorphism>
//           <CardHeader>
//             <CardTitle>Weekly Attendance Overview</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={attendanceData}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
//                 <XAxis dataKey="name" stroke="#6b7280" />
//                 <YAxis stroke="#6b7280" />
//                 <Tooltip
//                   contentStyle={{
//                     backgroundColor: '#1f2937',
//                     border: 'none',
//                     borderRadius: '8px',
//                     color: '#fff',
//                   }}
//                 />
//                 <Legend />
//                 <Bar dataKey="present" fill="#3b82f6" radius={[8, 8, 0, 0]} />
//                 <Bar dataKey="absent" fill="#ef4444" radius={[8, 8, 0, 0]} />
//               </BarChart>
//             </ResponsiveContainer>
//           </CardContent>
//         </Card>

//         <Card glassmorphism>
//           <CardHeader>
//             <CardTitle>Department Distribution</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <ResponsiveContainer width="100%" height={300}>
//               <PieChart>
//                 {/* <Pie
//                   data={departmentData}
//                   cx="50%"
//                   cy="50%"
//                   labelLine={false}
//                   label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}

//                   outerRadius={100}
//                   fill="#8884d8"
//                   dataKey="value"
//                 >
//                   {departmentData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie> */}
//                 <Pie
//                   data={departmentData}
//                   cx="50%"
//                   cy="50%"
//                   outerRadius={100}
//                   dataKey="value"
//                   labelLine={false}
//                 >
//                   {departmentData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}

//                   <LabelList
//                     content={({ x, y, percent, payload }) => (
//                       <text
//                         x={x}
//                         y={y}
//                         fill="#fff"
//                         textAnchor="middle"
//                         dominantBaseline="central"
//                       >
//                         {`${payload.name} ${(percent * 100).toFixed(0)}%`}
//                       </text>
//                     )}
//                   />
//                 </Pie>

//                 <Tooltip
//                   contentStyle={{
//                     backgroundColor: '#1f2937',
//                     border: 'none',
//                     borderRadius: '8px',
//                     color: '#fff',
//                   }}
//                 />
//               </PieChart> *

//             </ResponsiveContainer>
//           </CardContent>
//         </Card>
//       </div>

//       <Card glassmorphism>
//         <CardHeader>
//           <CardTitle>Performance Trend (6 Months)</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <ResponsiveContainer width="100%" height={300}>
//             <LineChart data={performanceTrend}>
//               <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
//               <XAxis dataKey="month" stroke="#6b7280" />
//               <YAxis stroke="#6b7280" domain={[0, 5]} />
//               <Tooltip
//                 contentStyle={{
//                   backgroundColor: '#1f2937',
//                   border: 'none',
//                   borderRadius: '8px',
//                   color: '#fff',
//                 }}
//               />
//               <Legend />
//               <Line
//                 type="monotone"
//                 dataKey="score"
//                 stroke="#8b5cf6"
//                 strokeWidth={3}
//                 dot={{ fill: '#8b5cf6', r: 6 }}
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }





import { useEffect, useState } from "react";
import {
  Users,
  TrendingUp,
  Calendar,
  CheckCircle,
} from "lucide-react";
import StatCard from "../../../components/shared/StatCard";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../../components/ui/Card";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
  LabelList,   // FIX: Import added
} from "recharts";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

export default function DashboardOverview() {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    avgPerformance: 0,
    pendingLeaves: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setStats({
      totalEmployees: 50,
      presentToday: 45,
      avgPerformance: 4.3,
      pendingLeaves: 3,
    });
  };

  const attendanceData = [
    { name: "Mon", present: 45, absent: 5 },
    { name: "Tue", present: 47, absent: 3 },
    { name: "Wed", present: 46, absent: 4 },
    { name: "Thu", present: 48, absent: 2 },
    { name: "Fri", present: 44, absent: 6 },
  ];

  const departmentData = [
    { name: "Engineering", value: 25 },
    { name: "Sales", value: 15 },
    { name: "Marketing", value: 10 },
    { name: "HR", value: 5 },
  ];

  const performanceTrend = [
    { month: "Jan", score: 3.8 },
    { month: "Feb", score: 4.0 },
    { month: "Mar", score: 4.2 },
    { month: "Apr", score: 4.1 },
    { month: "May", score: 4.4 },
    { month: "Jun", score: 4.3 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome back! Here's what's happening with your team today.
        </p>
      </div>

      {/* TOP CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Employees"
          value={stats.totalEmployees}
          icon={Users}
          color="blue"
          trend={{ value: 12, isPositive: true }}
        />

        <StatCard
          title="Present Today"
          value={stats.presentToday}
          icon={CheckCircle}
          color="green"
          trend={{ value: 5, isPositive: true }}
        />

        <StatCard
          title="Avg Performance"
          value={`${stats.avgPerformance}/5`}
          icon={TrendingUp}
          color="purple"
          trend={{ value: 8, isPositive: true }}
        />

        <StatCard
          title="Pending Leaves"
          value={stats.pendingLeaves}
          icon={Calendar}
          color="orange"
        />
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* WEEKLY ATTENDANCE */}
        <Card glassmorphism>
          <CardHeader>
            <CardTitle>Weekly Attendance Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Legend />
                <Bar dataKey="present" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                <Bar dataKey="absent" fill="#ef4444" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* DEPARTMENT PIE CHART */}
        <Card glassmorphism>
          <CardHeader>
            <CardTitle>Department Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  labelLine={false}
                >
                  {departmentData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}

                  {/* FIXED LABELS */}
                  <LabelList
                    content={({ x, y, percent, payload }) => {
                      if (!payload || percent == null) return null;

                      return (
                        <text
                          x={x}
                          y={y}
                          fill="#fff"
                          textAnchor="middle"
                          dominantBaseline="central"
                          fontSize={12}
                        >
                          {`${payload.name} ${(percent * 100).toFixed(0)}%`}
                        </text>
                      );
                    }}
                  />
                </Pie>

                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* PERFORMANCE LINE CHART */}
      <Card glassmorphism>
        <CardHeader>
          <CardTitle>Performance Trend (6 Months)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" domain={[0, 5]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "none",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#8b5cf6"
                strokeWidth={3}
                dot={{ fill: "#8b5cf6", r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
