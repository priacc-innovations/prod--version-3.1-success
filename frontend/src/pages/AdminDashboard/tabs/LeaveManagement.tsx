import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Clock, Calendar } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { LeaveRequest, User } from '../../../types';
import { useAuthStore } from '../../../store/authStore';
import { mockLeaveRequests, mockEmployees } from '../../../data/mockData';

export default function LeaveManagement() {
  const [leaveRequests, setLeaveRequests] = useState<(LeaveRequest & { user: User })[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    loadLeaveRequests();
  }, []);

  const loadLeaveRequests = async () => {
    setLoading(true);

    const leavesWithUsers = mockLeaveRequests.map((leave) => ({
      ...leave,
      user: mockEmployees.find((emp) => emp.id === leave.user_id) || {} as User,
    }));

    setLeaveRequests(leavesWithUsers as any);
    setLoading(false);
  };

  const handleApprove = async (leaveId: string) => {
    setLeaveRequests((prev) =>
      prev.map((leave) =>
        leave.id === leaveId ? { ...leave, status: 'approved' as const } : leave
      )
    );
  };

  const handleReject = async (leaveId: string) => {
    setLeaveRequests((prev) =>
      prev.map((leave) =>
        leave.id === leaveId ? { ...leave, status: 'rejected' as const } : leave
      )
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'rejected':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Leave Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Review and manage employee leave requests
        </p>
      </div>

      <Card glassmorphism>
        <CardHeader>
          <CardTitle>Leave Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading leave requests...</div>
          ) : leaveRequests.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No leave requests found</div>
          ) : (
            <div className="space-y-4">
              {leaveRequests.map((leave, index) => (
                <motion.div
                  key={leave.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <img
                        src={(leave.user as any).avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${(leave.user as any).email}`}
                        alt={(leave.user as any).full_name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {(leave.user as any).full_name}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(leave.status)}`}>
                            {leave.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{leave.start_date} to {leave.end_date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{new Date(leave.created_at!).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          <span className="font-medium">Reason:</span> {leave.reason}
                        </p>
                      </div>
                    </div>

                    {leave.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => handleApprove(leave.id)}
                          className="gap-2"
                        >
                          <Check className="w-4 h-4" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleReject(leave.id)}
                          className="gap-2"
                        >
                          <X className="w-4 h-4" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
