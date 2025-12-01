import { useState } from "react";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";

import {
  LayoutDashboard,
  Users,
  Calendar,
  TrendingUp,
  Wallet,
  Settings,
  FileText,
  UserPlus,
  ClipboardCheck,
  MessageSquare,
  CalendarDays,
  Bell
} from "lucide-react";
import { cn } from "../../utils/cn";
import { UserRole } from "../../types";

interface SidebarProps {
  role: UserRole;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

// ------------ MENU ITEMS (NO CHANGE) ----------------
const adminMenuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "employees", label: "All Employees", icon: Users },
  { id: "attendance", label: "Attendance", icon: ClipboardCheck },
  { id: "performance", label: "Performance", icon: TrendingUp },
  { id: "leaves", label: "Leave Requests", icon: Calendar },
  { id: "holidays", label: "Holidays", icon: CalendarDays },
  { id: "announcements", label: "Announcements", icon: MessageSquare },
  { id: "hr-management", label: "HR Management", icon: UserPlus }
];

const hrMenuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "employees", label: "Employees", icon: Users },
  { id: "add-employee", label: "Add Employee", icon: UserPlus },
  { id: "mark-attendance", label: "Mark Attendance", icon: ClipboardCheck },
  { id: "attendance", label: "Attendance Report", icon: Calendar },   // ⭐ FIXED ICON
  { id: "bulk-attendance", label: "Bulk Attendance (CSV)", icon: FileText },
  { id: "performance", label: "Performance", icon: TrendingUp },
  { id: "leaves", label: "Leave Requests", icon: Calendar },
  { id: "wallet", label: "Salary Management", icon: Wallet },
  { id: "payslips", label: "Payslip Upload", icon: FileText },
  { id: "notifications", label: "Send Notifications", icon: Bell },
  { id: "holidays", label: "Holidays", icon: CalendarDays }
];


const employeeMenuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "clock", label: "Clock In/Out", icon: ClipboardCheck },
  { id: "attendance", label: "My Attendance", icon: Calendar },
  { id: "performance", label: "My Performance", icon: TrendingUp },
  { id: "wallet", label: "My Wallet", icon: Wallet },
  { id: "payslips", label: "My Payslips", icon: FileText },
  { id: "leave-request", label: "Request Leave", icon: FileText },
  { id: "holidays", label: "Holidays", icon: CalendarDays }
];

const trainerMenuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "employees", label: "My Domain Employees", icon: Users },
  { id: "tasks", label: "Task Management", icon: ClipboardCheck },
  { id: "performance", label: "Performance Reviews", icon: TrendingUp }
];

// ------------ FINAL SIDEBAR COMPONENT ----------------
export default function Sidebar({ role, activeTab, onTabChange }: SidebarProps) {
  const menuItems =
    role === "admin"
      ? adminMenuItems
      : role === "hr"
        ? hrMenuItems
        : role === "trainer"
          ? trainerMenuItems
          : employeeMenuItems;

  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      animate={{ width: collapsed ? 80 : 260 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 
        h-[calc(100vh-4rem)] sticky top-16 shadow-xl overflow-hidden"
    >
      {/* Collapse / Expand Button */}
      <div className="flex justify-end p-2">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        </button>
      </div>

      {/* MENU ITEMS */}
      <nav className="p-3 space-y-2">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.04 }}
              onClick={() => {
                onTabChange(item.id);
                setCollapsed(false);
              }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl group transition-all",
                isActive
                  ? "bg-blue-600 text-white shadow-md"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              )}
            >
              <Icon
                className={cn(
                  "w-5 h-5 transition-transform group-hover:scale-110",
                  isActive ? "text-white" : "text-gray-500 dark:text-gray-400"
                )}
              />

              {!collapsed && (
                <span className="font-medium text-sm">{item.label}</span>
              )}

              {isActive && !collapsed && (
                <motion.div
                  layoutId="active-dot"
                  className="ml-auto w-2 h-2 bg-white rounded-full"
                />
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* SETTINGS ROW */}
      {/* <div className="p-4 border-t border-gray-200 dark:border-gray-700 mt-4">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl 
            hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
        >
          <Settings className="w-5 h-5" />
          {!collapsed && <span>Settings</span>}
        </motion.button>
      </div> */}
    </motion.aside>
  );
}
