import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../../components/shared/Navbar';
import Sidebar from '../../components/shared/Sidebar';
import AIAssistant from '../../components/shared/AIAssistant';
import DashboardOverview from './tabs/DashboardOverview';
import EmployeeList from './tabs/EmployeeList';
import AddEmployee from './tabs/AddEmployee';
import MarkAttendance from './tabs/MarkAttendance';
import BulkAttendance from './tabs/BulkAttendance';
import PerformanceReview from './tabs/PerformanceReview';
import SalaryManagement from './tabs/SalaryManagement';
import Holidays from './tabs/Holidays';
import NotificationBroadcast from './tabs/NotificationBroadcast';
import PayslipManagement from './tabs/PayslipManagement';
import LeaveManagement from './tabs/LeaveManagement';
import HRAttendance from "./tabs/HRAttendance";

export const hrRenderContent = (activeTab: string) => {
  switch (activeTab) {
    case 'dashboard':
      return <DashboardOverview />;
    case 'employees':
      return <EmployeeList />;
    case 'add-employee':
      return <AddEmployee />;
    case 'mark-attendance':
      return <MarkAttendance />;
    case 'bulk-attendance':
      return <BulkAttendance />;
    case 'performance':
      return <PerformanceReview />;
    case 'wallet':
      return <SalaryManagement />;
    case 'holidays':
      return <Holidays />;
    case 'notifications':
      return <NotificationBroadcast />;
    case 'payslips':
      return <PayslipManagement />;
    case 'leaves':
      return <LeaveManagement />;
    case "attendance":
      return <HRAttendance />;
    default:
      return <DashboardOverview />;

  }
};

export default function HRDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Navbar />
      <div className="flex">
        <Sidebar role="hr" activeTab={activeTab} onTabChange={setActiveTab} />
        <motion.main
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="flex-1 p-6 overflow-y-auto"
        >
          {hrRenderContent(activeTab)}
        </motion.main>
      </div>
      <AIAssistant userRole="hr" />
    </div>
  );
}
