import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';

interface Task {
  id: string;
  employee_name: string;
  task_title: string;
  task_description: string;
  assigned_date: string;
  due_date: string;
  status: 'pending' | 'in_progress' | 'completed';
  completion_percentage: number;
}

export default function TaskManagement() {
  const [showAddTask, setShowAddTask] = useState(false);
  const [taskForm, setTaskForm] = useState({
    employee_id: '',
    title: '',
    description: '',
    due_date: '',
  });

  const [tasks] = useState<Task[]>([
    {
      id: '1',
      employee_name: 'John Doe',
      task_title: 'Complete ML Model Training',
      task_description: 'Train and validate the customer churn prediction model',
      assigned_date: '2025-03-01',
      due_date: '2025-03-10',
      status: 'in_progress',
      completion_percentage: 75,
    },
    {
      id: '2',
      employee_name: 'Sarah Williams',
      task_title: 'Data Pipeline Setup',
      task_description: 'Set up ETL pipeline for new data source',
      assigned_date: '2025-02-28',
      due_date: '2025-03-05',
      status: 'completed',
      completion_percentage: 100,
    },
    {
      id: '3',
      employee_name: 'Mike Johnson',
      task_title: 'Report Generation',
      task_description: 'Create quarterly analytics report',
      assigned_date: '2025-03-05',
      due_date: '2025-03-15',
      status: 'pending',
      completion_percentage: 0,
    },
  ]);

  const employees = [
    { id: '1', name: 'John Doe', employee_id: 'EMP001' },
    { id: '2', name: 'Sarah Williams', employee_id: 'EMP004' },
    { id: '3', name: 'Mike Johnson', employee_id: 'EMP003' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Adding task:', taskForm);
    setShowAddTask(false);
    setTaskForm({ employee_id: '', title: '', description: '', due_date: '' });
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: { label: 'Pending', color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300' },
      in_progress: { label: 'In Progress', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' },
      completed: { label: 'Completed', color: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' },
    };
    return badges[status as keyof typeof badges] || badges.pending;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-blue-600" />;
      default:
        return <XCircle className="w-5 h-5 text-orange-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Task Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Assign and track daily tasks for your domain employees
          </p>
        </div>
        <Button onClick={() => setShowAddTask(true)} className="gap-2">
          <Plus className="w-5 h-5" />
          Assign New Task
        </Button>
      </div>

      {showAddTask && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowAddTask(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Assign New Task
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Employee *
                </label>
                <select
                  value={taskForm.employee_id}
                  onChange={(e) => setTaskForm({ ...taskForm, employee_id: e.target.value })}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Employee</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.employee_id} - {emp.name}
                    </option>
                  ))}
                </select>
              </div>
              <Input
                label="Task Title *"
                value={taskForm.title}
                onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                placeholder="Enter task title"
                required
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Task Description *
                </label>
                <textarea
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                  placeholder="Enter task description"
                  required
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              <Input
                label="Due Date *"
                type="date"
                value={taskForm.due_date}
                onChange={(e) => setTaskForm({ ...taskForm, due_date: e.target.value })}
                required
              />
              <div className="flex gap-3 mt-6">
                <Button type="submit" className="flex-1">
                  Assign Task
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddTask(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      <div className="space-y-4">
        {tasks.map((task, index) => {
          const statusBadge = getStatusBadge(task.status);
          return (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card glassmorphism>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="mt-1">{getStatusIcon(task.status)}</div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                          {task.task_title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {task.task_description}
                        </p>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Assigned to: {task.employee_name}
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadge.color}`}>
                      {statusBadge.label}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Progress</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {task.completion_percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all"
                        style={{ width: `${task.completion_percentage}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-500 mt-2">
                      <span>Assigned: {new Date(task.assigned_date).toLocaleDateString()}</span>
                      <span>Due: {new Date(task.due_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
