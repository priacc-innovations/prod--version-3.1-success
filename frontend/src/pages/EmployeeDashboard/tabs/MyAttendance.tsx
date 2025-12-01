import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle, XCircle, Clock, MinusCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { useAuthStore } from '../../../store/authStore';
import axios from 'axios';
import { format } from 'date-fns';

type AttendanceItem = {
  id: number;
  date: string;
  loginTime?: string | null;
  logoutTime?: string | null;
  status?: string;
  remarks?: string;
  reason?: string;         // ⭐ added support for backend "reason"
};

export default function MyAttendance() {
  const user = useAuthStore((state) => state.user);
  const [attendance, setAttendance] = useState<AttendanceItem[]>([]);
  const [stats, setStats] = useState({
    present: 0,
    absent: 0,
    late: 0,
    halfDay: 0,
    leave: 0,
    total: 0,
  });

  useEffect(() => {
    if (user) loadAttendance();
  }, [user]);

  const normalizeStatus = (s?: string) =>
    s ? s.toLowerCase().replace(' ', '_') : 'absent';

  const safeFormatDate = (value: any, fmt: string) => {
    if (!value) return '—';
    const d = new Date(value);
    if (isNaN(d.getTime())) return '—';
    return format(d, fmt);
  };

  const loadAttendance = async () => {
    if (!user?.id) return;

    try {
      const res = await axios.get(
        `/api/attendance/user/${user.id}`
      );

      const data = res.data || [];

      const mapped = (Array.isArray(data) ? data : [data]).map((att: any) => ({
        id: att.id,
        date: att.date,
        loginTime: att.loginTime ?? att.login_time ?? null,
        logoutTime: att.logoutTime ?? att.logout_time ?? null,
        status: normalizeStatus(att.status),
        remarks: att.remarks ?? att.reason ?? '',    // ⭐ support remarks or reason
        reason: att.reason ?? att.remarks ?? '',      // ⭐ keep reason for safety
      }));

      const sorted = mapped.sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });

      setAttendance(sorted);

      setStats({
        present: mapped.filter((a) => a.status === 'present').length,
        absent: mapped.filter((a) => a.status === 'absent').length,
        late: mapped.filter((a) => a.status === 'late').length,
        halfDay: mapped.filter((a) => a.status === 'half_day').length,
        leave: mapped.filter((a) => a.status === 'leave').length,
        total: mapped.length,
      });
    } catch (err) {
      console.error("Attendance fetch error", err);
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'absent':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'late':
        return <Clock className="w-5 h-5 text-orange-500" />;
      case 'half_day':
        return <MinusCircle className="w-5 h-5 text-yellow-500" />;
      case 'leave':
        return <Calendar className="w-5 h-5 text-blue-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'present':
        return 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400';
      case 'absent':
        return 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400';
      case 'late':
        return 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400';
      case 'half_day':
        return 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400';
      case 'leave':
        return 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400';
      default:
        return '';
    }
  };

  const attendancePercentage =
    stats.total > 0
      ? (((stats.present + stats.late) / stats.total) * 100).toFixed(1)
      : '0';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          My Attendance
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          View your attendance history and statistics
        </p>
      </div>

      {/* Stats Cards (UI unchanged) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Total', value: stats.total },
          { label: 'Present', value: stats.present },
          { label: 'Late', value: stats.late },
          { label: 'Half Day', value: stats.halfDay },
          { label: 'Leave', value: stats.leave },
          { label: 'Absent', value: stats.absent },
        ].map((item, i) => (
          <Card key={i} glassmorphism>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-100 dark:bg-gray-900/30">
                  <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {item.label}
                  </p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {item.value}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Attendance Percentage (UI unchanged) */}
      <Card glassmorphism>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Attendance Percentage</CardTitle>
            <span className="text-2xl font-bold text-green-600 dark:text-green-400">
              {attendancePercentage}%
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
            <div
              className="bg-gradient-to-r from-green-500 to-emerald-500 h-4 rounded-full transition-all duration-500"
              style={{ width: `${attendancePercentage}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Attendance History (UI unchanged) */}
      <Card glassmorphism>
        <CardHeader>
          <CardTitle>Attendance History</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-2">
            {attendance.map((att, idx) => (
              <motion.div
                key={att.id || idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  {getStatusIcon(att.status)}
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {safeFormatDate(att.date, 'EEEE, MMMM dd, yyyy')}
                    </p>

                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {att.loginTime && att.logoutTime
                        ? `${att.loginTime} - ${att.logoutTime}`
                        : att.loginTime
                          ? `In: ${att.loginTime}`
                          : 'No clock in'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium uppercase ${getStatusColor(
                      att.status
                    )}`}
                  >
                    {(att.status || 'absent').replace('_', ' ')}
                  </span>

                  {/* ⭐ SHOW REASON / REMARKS */}
                  {att.remarks && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs">
                      {att.remarks}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
