import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, CheckCircle, Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import StatCard from '../../../components/shared/StatCard';

export default function DashboardOverview() {
  const trainerDomain = 'Data Science';

  const stats = [
    {
      title: 'My Domain Employees',
      value: '8',
      icon: Users,
      gradient: 'from-blue-500 to-cyan-500',
      change: '+2 this month',
    },
    {
      title: 'Avg Performance',
      value: '8.2/10',
      icon: TrendingUp,
      gradient: 'from-green-500 to-emerald-500',
      change: '+0.5 from last month',
    },
    {
      title: 'Tasks Completed',
      value: '156',
      icon: CheckCircle,
      gradient: 'from-purple-500 to-pink-500',
      change: '92% completion rate',
    },
    {
      title: 'Pending Reviews',
      value: '3',
      icon: Clock,
      gradient: 'from-orange-500 to-red-500',
      change: 'Due this week',
    },
  ];

  const recentEmployees = [
    { id: '1', name: 'John Doe', performance: 8.5, tasksCompleted: 12, tasksPending: 2 },
    { id: '2', name: 'Sarah Williams', performance: 9.2, tasksCompleted: 15, tasksPending: 1 },
    { id: '3', name: 'Mike Johnson', performance: 7.8, tasksCompleted: 10, tasksPending: 3 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Trainer Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Managing {trainerDomain} domain employees
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <Card glassmorphism>
        <CardHeader>
          <CardTitle>Recent Employee Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentEmployees.map((employee) => (
              <motion.div
                key={employee.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {employee.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Performance: {employee.performance}/10
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                    {employee.tasksCompleted} completed
                  </p>
                  <p className="text-sm text-orange-600 dark:text-orange-400">
                    {employee.tasksPending} pending
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
