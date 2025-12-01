import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Send, Users, CheckCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import axios from 'axios';

interface Notification {
  id: number;
  title: string;
  message: string;
  target_role: string;
  created_at: string;
}

export default function NotificationBroadcast() {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    target_role: 'all',
  });

  const [success, setSuccess] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const USER_ID = 2; // ⬅️ logged-in user ID (change based on your auth)

  // 📌 Fetch recent notifications from backend
  const loadNotifications = async () => {
    try {
      const res = await axios.get('/api/announcements/recent');
      setNotifications(res.data);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  // 📌 Submit notification to backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        title: formData.title,
        message: formData.message,
        target_role: formData.target_role,
      };

      await axios.post(
        `/api/announcements/create/${USER_ID}`,
        payload
      );

      setSuccess(true);
      loadNotifications(); // reload notifications

      setTimeout(() => {
        setSuccess(false);
        setFormData({ title: '', message: '', target_role: 'all' });
      }, 2000);

    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const getRoleDisplay = (role: string) => {
    const roleMap: Record<string, { label: string; color: string }> = {
      all: { label: 'All Users', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' },
      employee: { label: 'Employees', color: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' },
      hr: { label: 'HR Staff', color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300' },
      trainer: { label: 'Trainers', color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300' },
    };
    return roleMap[role] || roleMap.all;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Notification Broadcast
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Send notifications to employees and staff members
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card glassmorphism>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <Bell className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Create Notification</CardTitle>
              </div>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  label="Notification Title *"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter notification title"
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Enter notification message"
                    required
                    rows={5}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Target Audience *
                  </label>
                  <select
                    name="target_role"
                    value={formData.target_role}
                    onChange={handleChange}
                    required
                    className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                  >
                    <option value="all">All Users</option>
                    <option value="employee">Employees Only</option>
                    <option value="hr">HR Staff Only</option>
                    <option value="trainer">Trainers Only</option>
                  </select>
                </div>

                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-3"
                  >
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <p className="text-sm font-medium text-green-800 dark:text-green-400">
                      Notification sent successfully!
                    </p>
                  </motion.div>
                )}

                <Button type="submit" size="lg" className="w-full gap-2">
                  <Send className="w-5 h-5" />
                  Send Notification
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card glassmorphism>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Employees</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">10</p>
              </div>

              <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <Bell className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Active Notifications</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{notifications.length}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card glassmorphism>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {notifications.map((notification) => {
              const roleInfo = getRoleDisplay(notification.target_role);
              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{notification.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${roleInfo.color}`}>
                      {roleInfo.label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    Sent on {new Date(notification.created_at).toLocaleString()}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
