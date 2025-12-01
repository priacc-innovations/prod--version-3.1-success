import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Star, Target, Award, Calendar } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar } from 'recharts';

type ViewType = 'daily' | 'weekly' | 'monthly';

export default function MyPerformance() {
  const [activeView, setActiveView] = useState<ViewType>('daily');

  const dailyData = [
    { date: 'Mar 1', rating: 0, tasks: 0, attendance: 0 },
    { date: 'Mar 2', rating: 0, tasks: 0, attendance: 0 },
    { date: 'Mar 3', rating: 0, tasks: 0, attendance: 0 },
    { date: 'Mar 4', rating: 0, tasks: 0, attendance: 0 },
    { date: 'Mar 5', rating: 0, tasks: 0, attendance: 0 },
    { date: 'Mar 6', rating: 0, tasks: 0, attendance: 0 },
    { date: 'Mar 7', rating: 0, tasks: 0, attendance: 0 },
    { date: 'Mar 8', rating: 0, tasks: 0, attendance: 0 },
    { date: 'Mar 9', rating: 0, tasks: 0, attendance: 0 },
    { date: 'Mar 10', rating: 0, tasks: 0, attendance: 0 },
    { date: 'Mar 11', rating: 0, tasks: 0, attendance: 0 },
    { date: 'Mar 12', rating: 0, tasks: 0, attendance: 0 },
    { date: 'Mar 13', rating: 0, tasks: 0, attendance: 0 },
    { date: 'Mar 14', rating: 0, tasks: 0, attendance: 0 },
    { date: 'Mar 15', rating: 0, tasks: 0, attendance: 0 },
  ];

  const weeklyData = [
    { week: 'Week 1', rating: 0, tasks: 0, attendance: 0 },
    { week: 'Week 2', rating: 0, tasks: 0, attendance: 0 },
    { week: 'Week 3', rating: 0, tasks: 0, attendance: 0 },
    { week: 'Week 4', rating: 0, tasks: 0, attendance: 0 },
    { week: 'Week 5', rating: 0, tasks: 0, attendance: 0 },
    { week: 'Week 6', rating: 0, tasks: 0, attendance: 0 },
    { week: 'Week 7', rating: 0, tasks: 0, attendance: 0 },
    { week: 'Week 8', rating: 0, tasks: 0, attendance: 0 },
  ];

  const monthlyData = [
    { month: 'Jan', rating: 0, taskCompletion: 0, behavior: 0 },
    { month: 'Feb', rating: 0, taskCompletion: 0, behavior: 0 },
    { month: 'Mar', rating: 0, taskCompletion: 0, behavior: 0 },
  ];

  const currentPeriodData = {
    daily: { from: '24th Feb', to: '23rd Mar', days: 28 },
    monthly: { current: 'March 2025' },
  };

  const avgRating = 0;
  const avgTaskCompletion = 0;
  const avgBehavior = 0;

  const getCurrentData = () => {
    switch (activeView) {
      case 'daily':
        return dailyData;
      case 'weekly':
        return weeklyData;
      case 'monthly':
        return monthlyData;
      default:
        return dailyData;
    }
  };

  const getChartConfig = () => {
    switch (activeView) {
      case 'daily':
        return { dataKey: 'date', lines: [{ key: 'rating', name: 'Rating', color: '#3b82f6' }, { key: 'tasks', name: 'Tasks', color: '#10b981' }] };
      case 'weekly':
        return { dataKey: 'week', lines: [{ key: 'rating', name: 'Rating', color: '#3b82f6' }, { key: 'tasks', name: 'Tasks', color: '#10b981' }] };
      case 'monthly':
        return { dataKey: 'month', lines: [{ key: 'rating', name: 'Rating', color: '#3b82f6' }, { key: 'taskCompletion', name: 'Task %', color: '#10b981' }, { key: 'behavior', name: 'Behavior', color: '#f59e0b' }] };
      default:
        return { dataKey: 'date', lines: [] };
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          My Performance
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track your performance across daily, weekly, and monthly periods
        </p>
      </div>

      {activeView === 'daily' && (
        <Card glassmorphism className="border-2 border-blue-200 dark:border-blue-800">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Current Performance Period
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Period:</strong> {currentPeriodData.daily.from} to {currentPeriodData.daily.to} ({currentPeriodData.daily.days} days)
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-400 font-medium mt-2">
                  Your performance is tracked from the 24th of last month to the 23rd of the current month
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-4 bg-white dark:bg-gray-800 p-2 rounded-xl border border-gray-200 dark:border-gray-700 w-fit">
        <button
          onClick={() => setActiveView('daily')}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${activeView === 'daily'
            ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
        >
          Daily Performance
        </button>
        <button
          onClick={() => setActiveView('weekly')}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${activeView === 'weekly'
            ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
        >
          Last 8 Weeks
        </button>
        <button
          onClick={() => setActiveView('monthly')}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${activeView === 'monthly'
            ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
        >
          Monthly
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card glassmorphism>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Star className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Average Rating</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {avgRating}<span className="text-lg text-gray-500">/10</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card glassmorphism>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <Target className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Task Completion</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {avgTaskCompletion}<span className="text-lg text-gray-500">%</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card glassmorphism>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Award className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Behavior Score</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {avgBehavior}<span className="text-lg text-gray-500">/100</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card glassmorphism>
        <CardHeader>
          <CardTitle>
            {activeView === 'daily' && 'Daily Performance Trend'}
            {activeView === 'weekly' && 'Last 8 Weeks Performance'}
            {activeView === 'monthly' && 'Monthly Performance Overview'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              {activeView === 'monthly' ? (
                <BarChart data={getCurrentData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                  <XAxis dataKey={getChartConfig().dataKey} stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#F9FAFB',
                    }}
                  />
                  <Legend />
                  {getChartConfig().lines.map((line) => (
                    <Bar key={line.key} dataKey={line.key} name={line.name} fill={line.color} radius={[8, 8, 0, 0]} />
                  ))}
                </BarChart>
              ) : (
                <LineChart data={getCurrentData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                  <XAxis dataKey={getChartConfig().dataKey} stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#F9FAFB',
                    }}
                  />
                  <Legend />
                  {getChartConfig().lines.map((line) => (
                    <Line
                      key={line.key}
                      type="monotone"
                      dataKey={line.key}
                      name={line.name}
                      stroke={line.color}
                      strokeWidth={3}
                      dot={{ fill: line.color, r: 5 }}
                      activeDot={{ r: 7 }}
                    />
                  ))}
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {activeView === 'daily' && (
        <Card glassmorphism>
          <CardHeader>
            <CardTitle>Recent Daily Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dailyData.slice(-5).reverse().map((day, index) => (
                <motion.div
                  key={day.date}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{day.date}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {day.tasks} tasks completed
                    </p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Rating</p>
                      <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {day.rating}/10
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Attendance</p>
                      <p className="text-lg font-bold text-green-600 dark:text-green-400">
                        {day.attendance}%
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
