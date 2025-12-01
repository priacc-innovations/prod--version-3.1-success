import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Users, Trash2, Mail } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';

interface HRMember {
  id: string;
  full_name: string;
  email: string;
  created_at: string;
}

interface TrainerMember {
  id: string;
  full_name: string;
  email: string;
  domain: string;
  created_at: string;
}

export default function HRManagement() {
  const [activeView, setActiveView] = useState<'hr' | 'trainer'>('hr');
  const [showAddForm, setShowAddForm] = useState(false);

  const [hrMembers] = useState<HRMember[]>([
    {
      id: '1',
      full_name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      created_at: '2025-01-15',
    },
    {
      id: '2',
      full_name: 'Michael Chen',
      email: 'michael.chen@company.com',
      created_at: '2025-02-20',
    },
  ]);

  const [trainers] = useState<TrainerMember[]>([
    {
      id: '1',
      full_name: 'Dr. Emily Carter',
      email: 'emily.carter@company.com',
      domain: 'Data Science',
      created_at: '2025-01-10',
    },
    {
      id: '2',
      full_name: 'James Wilson',
      email: 'james.wilson@company.com',
      domain: 'Engineering',
      created_at: '2025-01-12',
    },
    {
      id: '3',
      full_name: 'Maria Garcia',
      email: 'maria.garcia@company.com',
      domain: 'Sales',
      created_at: '2025-02-05',
    },
  ]);

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    domain: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating new member:', formData);
    setShowAddForm(false);
    setFormData({ full_name: '', email: '', domain: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            HR & Trainer Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Create and manage HR staff and domain trainers
          </p>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="gap-2">
          <UserPlus className="w-5 h-5" />
          Add New {activeView === 'hr' ? 'HR' : 'Trainer'}
        </Button>
      </div>

      <div className="flex gap-4 bg-white dark:bg-gray-800 p-2 rounded-xl border border-gray-200 dark:border-gray-700 w-fit">
        <button
          onClick={() => setActiveView('hr')}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${
            activeView === 'hr'
              ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          HR Staff ({hrMembers.length})
        </button>
        <button
          onClick={() => setActiveView('trainer')}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${
            activeView === 'trainer'
              ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          Trainers ({trainers.length})
        </button>
      </div>

      {showAddForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowAddForm(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Add New {activeView === 'hr' ? 'HR Staff' : 'Trainer'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <Input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john.doe@company.com"
                  required
                />
              </div>
              {activeView === 'trainer' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Domain
                  </label>
                  <select
                    value={formData.domain}
                    onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Domain</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Sales">Sales</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Design">Design</option>
                  </select>
                </div>
              )}
              <div className="flex gap-3 mt-6">
                <Button type="submit" className="flex-1">
                  Create Account
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
              A temporary password will be sent to the email address provided.
            </p>
          </motion.div>
        </motion.div>
      )}

      {activeView === 'hr' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {hrMembers.map((member) => (
            <Card key={member.id} glassmorphism>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {member.full_name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mt-1">
                        <Mail className="w-4 h-4" />
                        {member.email}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                        Joined: {new Date(member.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors group">
                    <Trash2 className="w-5 h-5 text-gray-400 group-hover:text-red-500" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeView === 'trainer' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {trainers.map((trainer) => (
            <Card key={trainer.id} glassmorphism>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {trainer.full_name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mt-1">
                        <Mail className="w-4 h-4" />
                        {trainer.email}
                      </div>
                      <div className="mt-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                          {trainer.domain}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                        Joined: {new Date(trainer.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors group">
                    <Trash2 className="w-5 h-5 text-gray-400 group-hover:text-red-500" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
