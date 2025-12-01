// import { useState } from 'react';
// import { motion } from 'framer-motion';
// import Navbar from '../../components/shared/Navbar';
// import Sidebar from '../../components/shared/Sidebar';
// import AIAssistant from '../../components/shared/AIAssistant';
// import DashboardOverview from './tabs/DashboardOverview';
// import DomainEmployees from './tabs/DomainEmployees';
// import TaskManagement from './tabs/TaskManagement';
// import PerformanceManagement from './tabs/PerformanceManagement';

// export default function TrainerDashboard() {
//   const [activeTab, setActiveTab] = useState('dashboard');

//   const renderContent = () => {
//     switch (activeTab) {
//       case 'employees':
//         return <DomainEmployees />;
//       case 'tasks':
//         return <TaskManagement />;
//       case 'performance':
//         return <PerformanceManagement />;
//       case 'dashboard':
//       default:
//         return <DashboardOverview />;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
//       <Navbar />
//       <div className="flex">
//         <Sidebar role="trainer" activeTab={activeTab} onTabChange={setActiveTab} />
//         <motion.main
//           key={activeTab}
//           initial={{ opacity: 0, x: 20 }}
//           animate={{ opacity: 1, x: 0 }}
//           exit={{ opacity: 0, x: -20 }}
//           transition={{ duration: 0.3 }}
//           className="flex-1 ml-64 mt-16 p-8"
//         >
//           {renderContent()}
//         </motion.main>
//       </div>
//       <AIAssistant />
//     </div>
//   );
// }


import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../../components/shared/Navbar';
import Sidebar from '../../components/shared/Sidebar';
import AIAssistant from '../../components/shared/AIAssistant';
import DashboardOverview from './tabs/DashboardOverview';
import DomainEmployees from './tabs/DomainEmployees';
import TaskManagement from './tabs/TaskManagement';
import PerformanceManagement from './tabs/PerformanceManagement';

export const trainerRenderContent = (activeTab: string) => {
  switch (activeTab) {
    case 'employees':
      return <DomainEmployees />;
    case 'tasks':
      return <TaskManagement />;
    case 'performance':
      return <PerformanceManagement />;
    case 'dashboard':
    default:
      return <DashboardOverview />;
  }
};

export default function TrainerDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Navbar />
      <div className="flex">
        <Sidebar role="trainer" activeTab={activeTab} onTabChange={setActiveTab} />
        <motion.main
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="flex-1 ml-64 mt-16 p-8"
        >
          {trainerRenderContent(activeTab)}
        </motion.main>
      </div>

      {/* ✅ Pass userRole prop */}
      <AIAssistant userRole="trainer" />
    </div>
  );
}
