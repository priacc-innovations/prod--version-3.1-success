import { useEffect, useState } from "react";
import { Users, CheckCircle, TrendingUp, Calendar } from "lucide-react";
import StatCard from "../../../components/shared/StatCard";
import api from "../../../api/axiosInstance";

interface AttendanceStatsDTO {
  date: string;
  present: number;
  absent: number;
}

export default function DashboardOverview() {
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [presentToday, setPresentToday] = useState(0);
  const [onLeaveToday, setOnLeaveToday] = useState(0);

  const [chartData, setChartData] = useState<AttendanceStatsDTO[]>([]);

  useEffect(() => {
    loadCounts();
    loadGraphData();
  }, []);

  // ---------- FETCH VALUES FOR CARDS ----------
  const loadCounts = async () => {
    try {
      const emp = await api.get("/user/count");
      const present = await api.get("/user/present-today");
      const leave = await api.get("/user/on-leave-today");

      // FIX: Extract number from {count: number}
      setTotalEmployees(emp.data.count);
      setPresentToday(present.data.count);
      setOnLeaveToday(leave.data.count);

    } catch (err) {
      console.error("Count API Error:", err);
    }
  };

  // ---------- FETCH GRAPH DATA ----------
  const loadGraphData = async () => {
    try {
      const res = await api.get<AttendanceStatsDTO[]>("/attendance/daily-summary");
      setChartData(res.data);
    } catch (err) {
      console.error("Graph API Error:", err);
    }
  };

  // ---------- CANVASJS OPTIONS ----------
  const options = {
    theme: "light2",
    animationEnabled: true,
    title: {
      text: "Attendance Trend (Present vs Absent)"
    },
    subtitles: [
      {
        text: "Daily Attendance Tracking"
      }
    ],
    axisX: {
      title: "Date",
      labelAngle: -45
    },
    axisY: {
      title: "Present Count",
      titleFontColor: "#28a745",
      lineColor: "#28a745",
      labelFontColor: "#28a745",
      tickColor: "#28a745"
    },
    axisY2: {
      title: "Absent Count",
      titleFontColor: "#ff4d4d",
      lineColor: "#ff4d4d",
      labelFontColor: "#ff4d4d",
      tickColor: "#ff4d4d"
    },
    toolTip: {
      shared: true
    },
    legend: {
      cursor: "pointer"
    },
    data: [
      {
        type: "spline",
        name: "Present",
        showInLegend: true,
        color: "#28a745",
        dataPoints: chartData.map((row) => ({
          label: row.date,
          y: row.present
        }))
      },
      {
        type: "spline",
        name: "Absent",
        axisYType: "secondary",
        showInLegend: true,
        color: "#ff4d4d",
        dataPoints: chartData.map((row) => ({
          label: row.date,
          y: row.absent
        }))
      }
    ]
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          HR Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage employees, attendance, and performance
        </p>
      </div>

      {/* ---------- TOP CARDS ---------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Employees" value={totalEmployees} icon={Users} color="blue" delay={0} />
        <StatCard title="Present Today StandUp Call" value={presentToday} icon={CheckCircle} color="green" delay={0.1} />
        <StatCard title="Avg Performance" value="0/5" icon={TrendingUp} color="purple" delay={0.2} />
        <StatCard title="On Leave" value={onLeaveToday} icon={Calendar} color="orange" delay={0.3} />
      </div>

      {/* ---------- DYNAMIC GRAPH ---------- */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow">
      </div>
    </div>
  );
}
