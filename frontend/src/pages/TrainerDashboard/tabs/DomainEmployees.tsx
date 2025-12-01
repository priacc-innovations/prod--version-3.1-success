import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Mail, Calendar, TrendingUp } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';

interface DomainEmployee {
  id: string;
  employee_id: string;
  full_name: string;
  email: string;
  designation: string;
  joining_date: string;
  performance_rating: number;
  tasks_completed: number;
  tasks_pending: number;
}

export default function DomainEmployees() {
  const trainerDomain = 'Data Science';

  const [employees] = useState<DomainEmployee[]>([
    {
      id: '1',
      employee_id: 'EMP001',
      full_name: 'John Doe',
      email: 'john.doe@company.com',
      designation: 'Data Analyst',
      joining_date: '2024-01-15',
      performance_rating: 8.5,
      tasks_completed: 45,
      tasks_pending: 3,
    },
    {
      id: '2',
      employee_id: 'EMP004',
      full_name: 'Sarah Williams',
      email: 'sarah.w@company.com',
      designation: 'ML Engineer',
      joining_date: '2023-11-20',
      performance_rating: 9.2,
      tasks_completed: 62,
      tasks_pending: 2,
    },
    {
      id: '3',
      employee_id: 'EMP003',
      full_name: 'Mike Johnson',
      email: 'mike.j@company.com',
      designation: 'Data Scientist',
      joining_date: '2024-03-10',
      performance_rating: 7.8,
      tasks_completed: 38,
      tasks_pending: 5,
    },
    {
      id: '4',
      employee_id: 'EMP007',
      full_name: 'Emily Chen',
      email: 'emily.chen@company.com',
      designation: 'Data Engineer',
      joining_date: '2024-02-01',
      performance_rating: 8.9,
      tasks_completed: 51,
      tasks_pending: 1,
    },
  ]);

  const getPerformanceColor = (rating: number) => {
    if (rating >= 9) return 'text-green-600 dark:text-green-400';
    if (rating >= 7) return 'text-blue-600 dark:text-blue-400';
    return 'text-orange-600 dark:text-orange-400';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {trainerDomain} Domain Employees
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          View and manage employees under your domain
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {employees.map((employee, index) => (
          <motion.div
            key={employee.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card glassmorphism>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                      {employee.full_name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {employee.full_name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {employee.designation}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-500">
                        <span>{employee.employee_id}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          {employee.email}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Joined {new Date(employee.joining_date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <TrendingUp className="w-5 h-5 text-gray-400" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">Performance</p>
                    </div>
                    <p className={`text-2xl font-bold ${getPerformanceColor(employee.performance_rating)}`}>
                      {employee.performance_rating}/10
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Completed</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {employee.tasks_completed}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Pending</p>
                    <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      {employee.tasks_pending}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
