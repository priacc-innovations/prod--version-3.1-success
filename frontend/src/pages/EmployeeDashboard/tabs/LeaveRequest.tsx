import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, FileText, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import api from '../../../api/axiosInstance';
import { useAuthStore } from '../../../store/authStore';

interface LeaveRequest {
  id: number;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export default function LeaveRequestPage() {
  const { user } = useAuthStore();

  const [formData, setFormData] = useState({
    from_date: '',
    to_date: '',
    reason: '',
  });

  const [success, setSuccess] = useState(false);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  /** Load leave requests */
  const loadLeaveRequests = async () => {
    if (!user?.id) return;

    try {
      const res = await api.get(`/leave/user/${user.id}`);
      setLeaveRequests(res.data || []);
    } catch (err) {
      console.error('Error loading leave requests:', err);
    }
  };

  useEffect(() => {
    loadLeaveRequests();
  }, [user]);

  /** Submit leave request */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrorMessage(null);

    if (!user?.id) {
      alert('User not logged in.');
      return;
    }

    if (new Date(formData.to_date) < new Date(formData.from_date)) {
      alert('To date must be after From date');
      return;
    }

    const payload = {
      startDate: formData.from_date,
      endDate: formData.to_date,
      reason: formData.reason,
    };

    try {
      await api.post(`/leave/apply/${user.id}`, payload);

      setSuccess(true);
      loadLeaveRequests();

      setTimeout(() => {
        setSuccess(false);
        setFormData({ from_date: '', to_date: '', reason: '' });
      }, 2000);
    } catch (error: any) {
      console.error('Leave request submission failed:', error);

      if (error?.response?.status === 409) {
        setErrorMessage(error.response.data?.message || 'Leave conflict: not enough balance or invalid request.');
      } else if (error?.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('Failed to submit leave request. Please try again.');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /** Status Badge */
  const getStatusBadge = (status: string) => {
    const badges = {
      pending: {
        icon: Clock,
        label: 'Pending',
        color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300',
      },
      approved: {
        icon: CheckCircle,
        label: 'Approved',
        color: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
      },
      rejected: {
        icon: XCircle,
        label: 'Rejected',
        color: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
      },
    };
    return badges[status as keyof typeof badges];
  };

  /** Days count */
  const calculateDays = (from: string, to: string) => {
    const start = new Date(from);
    const end = new Date(to);
    const diff = end.getTime() - start.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Request Leave</h1>
        <p className="text-gray-600 dark:text-gray-400">Submit your leave requests and track their status</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEAVE REQUEST FORM */}
        <div className="lg:col-span-2">
          <Card glassmorphism>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Submit Leave Request</CardTitle>
              </div>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="From Date *"
                    name="from_date"
                    type="date"
                    value={formData.from_date}
                    onChange={handleChange}
                    required
                  />

                  <Input
                    label="To Date *"
                    name="to_date"
                    type="date"
                    value={formData.to_date}
                    onChange={handleChange}
                    required
                  />
                </div>

                {formData.from_date && formData.to_date && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-sm text-blue-800 dark:text-blue-300">
                      <strong>Total Days:</strong> {calculateDays(formData.from_date, formData.to_date)} day(s)
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Reason *</label>

                  <textarea
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    required
                    rows={4}
                    placeholder="Enter reason for leave request"
                    className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 resize-none"
                  />
                </div>

                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-3"
                  >
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <p className="text-sm font-medium text-green-800 dark:text-green-400">
                      Leave request submitted successfully!
                    </p>
                  </motion.div>
                )}

                {errorMessage && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-300">
                    {errorMessage}
                  </div>
                )}

                <Button type="submit" size="lg" className="w-full gap-2">
                  <FileText className="w-5 h-5" />
                  Submit Leave Request
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* LIST OF LEAVE REQUESTS */}
      <Card glassmorphism>
        <CardHeader>
          <CardTitle>My Leave Requests</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            {leaveRequests.map((req, index) => {
              const badge = getStatusBadge(req.status);
              const Icon = badge.icon;

              return (
                <motion.div
                  key={req.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-gray-400" />

                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {req.startDate} - {req.endDate}
                        </p>

                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {calculateDays(req.startDate, req.endDate)} day(s)
                        </p>
                      </div>
                    </div>

                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${badge.color}`}>
                      {badge.label}
                    </span>
                  </div>

                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    <strong>Reason:</strong> {req.reason}
                  </p>

                  <p className="text-xs text-gray-500">Submitted on {req.createdAt.split('T')[0]}</p>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
