import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../../components/shared/Navbar';
import Sidebar from '../../components/shared/Sidebar';
import AIAssistant from '../../components/shared/AIAssistant';
import DashboardOverview from './tabs/DashboardOverview';
import AllEmployees from './tabs/AllEmployees';
import AttendanceSummary from './tabs/AttendanceSummary';
import PerformanceTracking from './tabs/PerformanceTracking';
import LeaveManagement from './tabs/LeaveManagement';
import HolidayManagement from './tabs/HolidayManagement';
import AnnouncementManagement from './tabs/AnnouncementManagement';
import HRManagement from './tabs/HRManagement';

export const adminRenderContent = (activeTab: string) => {
  switch (activeTab) {
    case 'dashboard':
      return <DashboardOverview />;
    case 'employees':
      return <AllEmployees />;
    case 'attendance':
      return <AttendanceSummary />;
    case 'performance':
      return <PerformanceTracking />;
    case 'leaves':
      return <LeaveManagement />;
    case 'holidays':
      return <HolidayManagement />;
    case 'announcements':
      return <AnnouncementManagement />;
    case 'hr-management':
      return <HRManagement />;
    default:
      return <DashboardOverview />;
  }
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Navbar />
      <div className="flex">
        <Sidebar role="admin" activeTab={activeTab} onTabChange={setActiveTab} />
        <motion.main
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="flex-1 p-6 overflow-y-auto"
        >
          {adminRenderContent(activeTab)}
        </motion.main>
      </div>
      <AIAssistant userRole="admin" />
    </div>
  );
}
