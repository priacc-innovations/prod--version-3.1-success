import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Calendar, CheckCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';

interface Holiday {
  id: string;
  name: string;
  date: string;
  type: 'public' | 'optional';
}

export default function HolidayManagement() {
  const [holidays, setHolidays] = useState<Holiday[]>([
    { id: '1', name: 'New Year', date: '2025-01-01', type: 'public' },
    { id: '2', name: 'Republic Day', date: '2025-01-26', type: 'public' },
    { id: '3', name: 'Holi', date: '2025-03-14', type: 'optional' },
    { id: '4', name: 'Good Friday', date: '2025-04-18', type: 'public' },
    { id: '5', name: 'Independence Day', date: '2025-08-15', type: 'public' },
    { id: '6', name: 'Gandhi Jayanti', date: '2025-10-02', type: 'public' },
    { id: '7', name: 'Diwali', date: '2025-10-20', type: 'optional' },
    { id: '8', name: 'Christmas', date: '2025-12-25', type: 'public' },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedHoliday, setSelectedHoliday] = useState<Holiday | null>(null);
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    date: '',
    type: 'public' as 'public' | 'optional',
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const newHoliday: Holiday = {
      id: Date.now().toString(),
      ...formData,
    };
    setHolidays([...holidays, newHoliday].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    setFormData({ name: '', date: '', type: 'public' });
    setShowAddModal(false);
    setSuccess('Holiday added successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleEdit = (holiday: Holiday) => {
    setSelectedHoliday(holiday);
    setFormData({ name: holiday.name, date: holiday.date, type: holiday.type });
    setShowEditModal(true);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHoliday) return;
    setHolidays(
      holidays.map((h) =>
        h.id === selectedHoliday.id ? { ...h, ...formData } : h
      ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    );
    setShowEditModal(false);
    setSelectedHoliday(null);
    setFormData({ name: '', date: '', type: 'public' });
    setSuccess('Holiday updated successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this holiday?')) {
      setHolidays(holidays.filter((h) => h.id !== id));
      setSuccess('Holiday deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const publicHolidays = holidays.filter(h => h.type === 'public');
  const optionalHolidays = holidays.filter(h => h.type === 'optional');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Holiday Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage company holidays and optional leaves
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="gap-2">
          <Plus className="w-5 h-5" />
          Add Holiday
        </Button>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card glassmorphism>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Public Holidays</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{publicHolidays.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card glassmorphism>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Optional Holidays</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{optionalHolidays.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {(showAddModal || showEditModal) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => {
            setShowAddModal(false);
            setShowEditModal(false);
            setFormData({ name: '', date: '', type: 'public' });
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {showAddModal ? 'Add New Holiday' : 'Edit Holiday'}
            </h2>
            <form onSubmit={showAddModal ? handleAdd : handleUpdate} className="space-y-4">
              <Input
                label="Holiday Name *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Diwali, Christmas"
                required
              />
              <Input
                label="Date *"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'public' | 'optional' })}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="public">Public Holiday</option>
                  <option value="optional">Optional Holiday</option>
                </select>
              </div>
              <div className="flex gap-3 mt-6">
                <Button type="submit" className="flex-1">
                  {showAddModal ? 'Add Holiday' : 'Update Holiday'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    setFormData({ name: '', date: '', type: 'public' });
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      <Card glassmorphism>
        <CardHeader>
          <CardTitle>Public Holidays ({publicHolidays.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {publicHolidays.map((holiday, index) => (
              <motion.div
                key={holiday.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{holiday.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(holiday.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(holiday)}
                    className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                  >
                    <Edit className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </button>
                  <button
                    onClick={() => handleDelete(holiday.id)}
                    className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card glassmorphism>
        <CardHeader>
          <CardTitle>Optional Holidays ({optionalHolidays.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {optionalHolidays.map((holiday, index) => (
              <motion.div
                key={holiday.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{holiday.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(holiday.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(holiday)}
                    className="p-2 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-colors"
                  >
                    <Edit className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </button>
                  <button
                    onClick={() => handleDelete(holiday.id)}
                    className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
