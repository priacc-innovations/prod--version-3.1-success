import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X, Bell } from 'lucide-react';

interface Notification {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'success';
  timestamp: Date;
}

export default function NotificationRibbon() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [dismissed, setDismissed] = useState<string[]>([]);

  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: 'notif-001',
        message: 'HR has updated your attendance for Nov 7, 2025 - Marked as Present for standup call',
        type: 'success',
        timestamp: new Date(),
      },
      {
        id: 'notif-002',
        message: 'Leave approved for Nov 20-22, 2025. Your wallet has been updated accordingly.',
        type: 'info',
        timestamp: new Date(Date.now() - 3600000),
      },
    ];

    const savedDismissed = localStorage.getItem('dismissed_notifications');
    if (savedDismissed) {
      setDismissed(JSON.parse(savedDismissed));
    }

    setNotifications(mockNotifications);
  }, []);

  const handleDismiss = (id: string) => {
    const newDismissed = [...dismissed, id];
    setDismissed(newDismissed);
    localStorage.setItem('dismissed_notifications', JSON.stringify(newDismissed));
  };

  const activeNotifications = notifications.filter((n) => !dismissed.includes(n.id));

  if (activeNotifications.length === 0) return null;

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-500 dark:bg-green-600';
      case 'warning':
        return 'bg-orange-500 dark:bg-orange-600';
      case 'info':
        return 'bg-blue-500 dark:bg-blue-600';
      default:
        return 'bg-gray-500 dark:bg-gray-600';
    }
  };

  return (
    <div className="fixed top-16 left-0 right-0 z-40 px-4 pt-2">
      <AnimatePresence>
        {activeNotifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="mb-2"
          >
            <div
              className={`${getNotificationColor(
                notification.type
              )} text-white px-6 py-3 rounded-lg shadow-lg backdrop-blur-sm bg-opacity-95 flex items-center justify-between gap-4 max-w-4xl mx-auto`}
            >
              <div className="flex items-center gap-3 flex-1">
                <Bell className="w-5 h-5 flex-shrink-0 animate-pulse" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{notification.message}</p>
                  <p className="text-xs opacity-90 mt-0.5">
                    {notification.timestamp.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleDismiss(notification.id)}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0"
                aria-label="Dismiss notification"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
