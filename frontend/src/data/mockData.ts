import { User, Attendance, Performance, LeaveRequest, Wallet } from '../types';

export const mockEmployees: User[] = [
  {
    id: 'emp-001',
    email: 'employee@mama.com',
    full_name: 'John Doe',
    role: 'employee',
    employee_id: 'EMP001',
    department: 'Engineering',
    designation: 'Software Developer',
    salary: 60000,
    joining_date: '2024-01-15',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
  },
  {
    id: 'emp-002',
    email: 'sarah.johnson@company.com',
    full_name: 'Sarah Johnson',
    role: 'employee',
    employee_id: 'EMP002',
    department: 'Engineering',
    designation: 'Senior Developer',
    salary: 80000,
    joining_date: '2023-05-10',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
  },
  {
    id: 'emp-003',
    email: 'michael.chen@company.com',
    full_name: 'Michael Chen',
    role: 'employee',
    employee_id: 'EMP003',
    department: 'Sales',
    designation: 'Sales Executive',
    salary: 55000,
    joining_date: '2024-03-20',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=michael',
  },
  {
    id: 'emp-004',
    email: 'emily.davis@company.com',
    full_name: 'Emily Davis',
    role: 'employee',
    employee_id: 'EMP004',
    department: 'Marketing',
    designation: 'Marketing Manager',
    salary: 70000,
    joining_date: '2023-08-15',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emily',
  },
  {
    id: 'emp-005',
    email: 'david.wilson@company.com',
    full_name: 'David Wilson',
    role: 'employee',
    employee_id: 'EMP005',
    department: 'Engineering',
    designation: 'DevOps Engineer',
    salary: 75000,
    joining_date: '2023-11-01',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david',
  },
  {
    id: 'emp-006',
    email: 'jessica.lee@company.com',
    full_name: 'Jessica Lee',
    role: 'employee',
    employee_id: 'EMP006',
    department: 'Sales',
    designation: 'Sales Manager',
    salary: 65000,
    joining_date: '2024-02-10',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jessica',
  },
  {
    id: 'emp-007',
    email: 'robert.brown@company.com',
    full_name: 'Robert Brown',
    role: 'employee',
    employee_id: 'EMP007',
    department: 'Marketing',
    designation: 'Content Strategist',
    salary: 58000,
    joining_date: '2024-01-05',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=robert',
  },
  {
    id: 'emp-008',
    email: 'amanda.garcia@company.com',
    full_name: 'Amanda Garcia',
    role: 'employee',
    employee_id: 'EMP008',
    department: 'Engineering',
    designation: 'QA Engineer',
    salary: 62000,
    joining_date: '2023-09-20',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=amanda',
  },
  {
    id: 'emp-009',
    email: 'james.martinez@company.com',
    full_name: 'James Martinez',
    role: 'employee',
    employee_id: 'EMP009',
    department: 'Sales',
    designation: 'Business Development',
    salary: 60000,
    joining_date: '2024-04-01',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=james',
  },
  {
    id: 'emp-010',
    email: 'linda.taylor@company.com',
    full_name: 'Linda Taylor',
    role: 'employee',
    employee_id: 'EMP010',
    department: 'Marketing',
    designation: 'Digital Marketing Specialist',
    salary: 56000,
    joining_date: '2024-02-28',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=linda',
  },
];

const generateAttendanceForMonth = (employeeId: string): Attendance[] => {
  const attendance: Attendance[] = [];
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const currentDay = today.getDate();

  for (let day = 1; day <= currentDay; day++) {
    const date = new Date(today.getFullYear(), today.getMonth(), day);
    const dayOfWeek = date.getDay();

    if (dayOfWeek === 0 || dayOfWeek === 6) continue;

    const random = Math.random();
    let status: Attendance['status'] = 'present';
    let loginTime = '09:00:00';
    let logoutTime = '18:00:00';
    let remarks = '';

    if (random < 0.05) {
      status = 'absent';
      loginTime = undefined as any;
      logoutTime = undefined as any;
      remarks = 'Absent without notice';
    } else if (random < 0.10) {
      status = 'leave';
      loginTime = undefined as any;
      logoutTime = undefined as any;
      remarks = 'Approved leave';
    } else if (random < 0.15) {
      status = 'half_day';
      loginTime = '09:30:00';
      logoutTime = '14:00:00';
      remarks = 'Half day - Personal work';
    } else if (random < 0.25) {
      status = 'late';
      loginTime = '09:15:00';
      logoutTime = '18:00:00';
      remarks = 'Late arrival';
    }

    attendance.push({
      id: `att-${employeeId}-${day}`,
      user_id: employeeId,
      date: date.toISOString().split('T')[0],
      login_time: loginTime,
      logout_time: logoutTime,
      status,
      remarks,
      marked_by: 'hr-001',
      created_at: date.toISOString(),
    });
  }

  return attendance;
};

const generatePerformanceReviews = (employeeId: string): Performance[] => {
  const reviews: Performance[] = [];
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  for (let month = 0; month <= currentMonth; month++) {
    const rating = 3.5 + Math.random() * 1.5;
    const taskCompletion = 75 + Math.random() * 20;
    const behaviorScore = 3.5 + Math.random() * 1.5;

    reviews.push({
      id: `perf-${employeeId}-${month}`,
      user_id: employeeId,
      month: month + 1,
      year: currentYear,
      rating: parseFloat(rating.toFixed(1)),
      feedback: 'Good performance overall. Keep up the good work!',
      task_completion: parseFloat(taskCompletion.toFixed(1)),
      behavior_score: parseFloat(behaviorScore.toFixed(1)),
      reviewed_by: 'hr-001',
      created_at: new Date(currentYear, month, 15).toISOString(),
    });
  }

  return reviews;
};

export const mockAttendance: Attendance[] = mockEmployees.flatMap((emp) =>
  generateAttendanceForMonth(emp.id)
);

export const mockPerformance: Performance[] = mockEmployees.flatMap((emp) =>
  generatePerformanceReviews(emp.id)
);

export const mockLeaveRequests: LeaveRequest[] = [
  {
    id: 'leave-001',
    user_id: 'emp-001',
    start_date: '2025-11-20',
    end_date: '2025-11-22',
    reason: 'Family vacation',
    status: 'pending',
    created_at: '2025-11-05T10:00:00Z',
  },
  {
    id: 'leave-002',
    user_id: 'emp-003',
    start_date: '2025-11-15',
    end_date: '2025-11-15',
    reason: 'Medical appointment',
    status: 'approved',
    approved_by: 'admin-001',
    approval_date: '2025-11-06T14:30:00Z',
    created_at: '2025-11-04T09:00:00Z',
  },
  {
    id: 'leave-003',
    user_id: 'emp-005',
    start_date: '2025-11-25',
    end_date: '2025-11-27',
    reason: 'Personal work',
    status: 'pending',
    created_at: '2025-11-06T11:00:00Z',
  },
];

export const mockWallets: Wallet[] = mockEmployees.map((emp) => ({
  id: `wallet-Rupees{emp.id}`,
  user_id: emp.id,
  monthly_salary: emp.salary || 60000,
  daily_rate: (emp.salary || 60000) / 30,
  current_month_earned: ((emp.salary || 60000) / 30) * 18,
  last_updated: new Date().toISOString(),
}));

export const getTodayAttendance = (userId: string): Attendance | null => {
  const today = new Date().toISOString().split('T')[0];
  return (
    mockAttendance.find((att) => att.user_id === userId && att.date === today) ||
    null
  );
};

export const getMonthAttendance = (userId: string): Attendance[] => {
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    .toISOString()
    .split('T')[0];

  return mockAttendance.filter(
    (att) => att.user_id === userId && att.date >= startOfMonth
  );
};

export const getUserPerformance = (userId: string): Performance[] => {
  return mockPerformance.filter((perf) => perf.user_id === userId);
};

export const getUserWallet = (userId: string): Wallet | null => {
  return mockWallets.find((wallet) => wallet.user_id === userId) || null;
};

export const organizationHolidays = [
  {
    id: 'hol-001',
    date: '2025-01-01',
    name: "New Year's Day",
    description: 'Public Holiday',
    type: 'public' as const,
  },
  {
    id: 'hol-002',
    date: '2025-01-26',
    name: 'Republic Day',
    description: 'National Holiday',
    type: 'public' as const,
  },
  {
    id: 'hol-003',
    date: '2025-03-14',
    name: 'Holi',
    description: 'Festival of Colors',
    type: 'public' as const,
  },
  {
    id: 'hol-004',
    date: '2025-04-10',
    name: 'Mahavir Jayanti',
    description: 'Religious Holiday',
    type: 'optional' as const,
  },
  {
    id: 'hol-005',
    date: '2025-04-18',
    name: 'Good Friday',
    description: 'Christian Holiday',
    type: 'public' as const,
  },
  {
    id: 'hol-006',
    date: '2025-05-01',
    name: 'Labor Day',
    description: 'International Workers Day',
    type: 'public' as const,
  },
  {
    id: 'hol-007',
    date: '2025-08-15',
    name: 'Independence Day',
    description: 'National Holiday',
    type: 'public' as const,
  },
  {
    id: 'hol-008',
    date: '2025-08-16',
    name: 'Raksha Bandhan',
    description: 'Festival celebrating sibling bond',
    type: 'optional' as const,
  },
  {
    id: 'hol-009',
    date: '2025-10-02',
    name: 'Gandhi Jayanti',
    description: 'Birthday of Mahatma Gandhi',
    type: 'public' as const,
  },
  {
    id: 'hol-010',
    date: '2025-10-22',
    name: 'Dussehra',
    description: 'Victory of good over evil',
    type: 'public' as const,
  },
  {
    id: 'hol-011',
    date: '2025-11-12',
    name: 'Diwali',
    description: 'Festival of Lights',
    type: 'public' as const,
  },
  {
    id: 'hol-012',
    date: '2025-12-25',
    name: 'Christmas',
    description: 'Christian Holiday',
    type: 'public' as const,
  },
];
