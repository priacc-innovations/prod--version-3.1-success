import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Clock, Calendar, CheckCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import api from '../../../api/axiosInstance';
import { useAuthStore } from '../../../store/authStore';

interface LeaveRequestDTO {
  id: number;
  user: {
    id: number;
    fullName?: string;
    email?: string;
  };
  empid?: string;              // ⭐ NEW → backend returns empid now
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  approvalDate?: string | null;
  approvedBy?: { id?: number; name?: string } | null;
}

interface LeaveRequest {
  id: string;
  employee_id: string;
  employee_name: string;
  from_date: string;
  to_date: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  submitted_date: string;
  days: number;
  raw: LeaveRequestDTO;
}

export default function LeaveManagement() {
  const { user } = useAuthStore();
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [success, setSuccess] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadLeaves();
  }, []);

  const calculateDays = (from: string, to: string) => {
    const start = new Date(from);
    const end = new Date(to);
    const diff = end.getTime() - start.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
  };

  const mapDtoToUI = (dto: LeaveRequestDTO): LeaveRequest => {
    const employeeName =
      dto.user?.fullName || dto.user?.email || `User-${dto.user?.id}`;

    return {
      id: String(dto.id),

      // ⭐ ONLY THIS LINE CHANGED
      employee_id: dto.empid ?? String(dto.user?.id),

      employee_name: employeeName,
      from_date: dto.startDate,
      to_date: dto.endDate,
      reason: dto.reason,
      status: dto.status,
      submitted_date: dto.createdAt?.split?.('T')?.[0] ?? dto.createdAt,
      days: calculateDays(dto.startDate, dto.endDate),
      raw: dto,
    };
  };

  const loadLeaves = async () => {
    setLoading(true);
    try {
      const res = await api.get<LeaveRequestDTO[]>('/leave/all');
      const mapped = res.data.map(mapDtoToUI);
      setLeaveRequests(mapped);
    } catch (err) {
      console.error('Failed to load leaves', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (leaveId: string) => {
    if (!user?.id) return alert('HR user not logged in');
    try {
      await api.put(`/leave/approve/${leaveId}/${user.id}`);
      setSuccess('Leave request approved successfully!');
      await loadLeaves();
      setTimeout(() => setSuccess(''), 3000);
    } catch {
      alert('Failed to approve leave');
    }
  };

  const handleReject = async (leaveId: string) => {
    if (!user?.id) return alert('HR user not logged in');
    try {
      await api.put(`/leave/reject/${leaveId}/${user.id}`);
      setSuccess('Leave request rejected successfully!');
      await loadLeaves();
      setTimeout(() => setSuccess(''), 3000);
    } catch {
      alert('Failed to reject leave');
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: { label: 'Pending', color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300' },
      approved: { label: 'Approved', color: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' },
      rejected: { label: 'Rejected', color: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' },
    };
    return badges[status as keyof typeof badges];
  };

  const pendingRequests = leaveRequests.filter(r => r.status === 'pending');
  const processedRequests = leaveRequests.filter(r => r.status !== 'pending');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Leave Management</h1>
        <p className="text-gray-600 dark:text-gray-400">Review and manage employee leave requests</p>
      </div>

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-3"
        >
          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
          <p className="text-sm font-medium text-green-800 dark:text-green-400">{success}</p>
        </motion.div>
      )}

      {/* dashboard cards UI UNCHANGED */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card glassmorphism>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Pending Requests</p>
                <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                  {pendingRequests.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card glassmorphism>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Approved</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {leaveRequests.filter(r => r.status === 'approved').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <Check className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card glassmorphism>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Rejected</p>
                <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                  {leaveRequests.filter(r => r.status === 'rejected').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                <X className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* PENDING LIST — UI UNCHANGED */}
      <Card glassmorphism>
        <CardHeader>
          <CardTitle>Pending Leave Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">Loading...</div>
          ) : pendingRequests.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">No pending leave requests</div>
          ) : (
            <div className="space-y-4">
              {pendingRequests.map((leave, index) => (
                <motion.div
                  key={leave.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-5 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                        {leave.employee_name.split(' ').map(n => n[0]).join('')}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white">{leave.employee_name}</h3>

                          {/* ⭐ UPDATED — now showing real empid */}
                          <span className="text-sm text-gray-500 dark:text-gray-400">{leave.employee_id}</span>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {new Date(leave.from_date).toLocaleDateString()} -
                              {new Date(leave.to_date).toLocaleDateString()}
                            </span>
                          </div>
                          <span className="font-medium">({leave.days} days)</span>

                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>
                              Submitted {new Date(leave.submitted_date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          <span className="font-medium">Reason:</span> {leave.reason}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleApprove(leave.id)} className="gap-2 bg-green-600 hover:bg-green-700">
                        <Check className="w-4 h-4" /> Approve
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReject(leave.id)}
                        className="gap-2 text-red-600 border-red-300 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                      >
                        <X className="w-4 h-4" /> Reject
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* PROCESSED LIST — UI UNCHANGED */}
      <Card glassmorphism>
        <CardHeader>
          <CardTitle>Processed Leave Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {processedRequests.map((leave, index) => {
              const statusBadge = getStatusBadge(leave.status);
              return (
                <motion.div
                  key={leave.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white font-bold">
                        {leave.employee_name.split(' ').map(n => n[0]).join('')}
                      </div>

                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {leave.employee_name}{' '}
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            ({(leave.employee_id)})
                          </span>
                        </p>

                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(leave.from_date).toLocaleDateString()} -
                          {new Date(leave.to_date).toLocaleDateString()} ({leave.days} days)
                        </p>
                      </div>
                    </div>

                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadge.color}`}>
                      {statusBadge.label}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
