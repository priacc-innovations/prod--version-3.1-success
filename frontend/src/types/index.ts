export type UserRole = 'admin' | 'hr' | 'trainer' | 'employee';

export type AttendanceStatus = 'present' | 'absent' | 'half_day' | 'leave' | 'late' | 'early_logout';

export type LeaveStatus = 'pending' | 'approved' | 'rejected';

export type TaskStatus = 'pending' | 'in_progress' | 'completed';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  employee_id?: string;
  department?: string;
  designation?: string;
  domain?: string;
  date_of_birth?: string;
  joining_date?: string;
  salary?: number;
  avatar_url?: string;
  created_by?: string;
  created_at?: string;
}

export interface Trainer {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  domain: string;
  created_by?: string;
  created_at?: string;
}

export interface HRStaff {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  created_by?: string;
  created_at?: string;
}

export interface DailyTask {
  id: string;
  employee_id: string;
  assigned_by: string;
  task_title: string;
  task_description?: string;
  assigned_date: string;
  due_date?: string;
  status: TaskStatus;
  completion_percentage: number;
  created_at?: string;
}

export interface SalaryDeduction {
  id: string;
  user_id: string;
  month: number;
  year: number;
  deduction_amount: number;
  reason?: string;
  added_by?: string;
  created_at?: string;
}

export interface Payslip {
  id: string;
  user_id: string;
  month: number;
  year: number;
  file_url: string;
  file_name: string;
  uploaded_by?: string;
  uploaded_at?: string;
}

export interface Attendance {
  id: string;
  user_id: string;
  date: string;
  login_time?: string;
  logout_time?: string;
  status: AttendanceStatus;
  remarks?: string;
  marked_by?: string;
  created_at?: string;
}

export interface Performance {
  id: string;
  user_id: string;
  week_number?: number;
  month: number;
  year: number;
  rating?: number;
  feedback?: string;
  task_completion?: number;
  behavior_score?: number;
  reviewed_by?: string;
  created_at?: string;
}

export interface LeaveRequest {
  id: string;
  user_id: string;
  start_date: string;
  end_date: string;
  reason: string;
  attachment_url?: string;
  status: LeaveStatus;
  approved_by?: string;
  approval_date?: string;
  created_at?: string;
}

export interface Wallet {
  id: string;
  user_id: string;
  monthly_salary: number;
  daily_rate: number;
  current_month_earned: number;
  last_updated?: string;
}

export interface Holiday {
  id: string;
  date: string;
  name: string;
  description?: string;
  created_at?: string;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  created_by: string;
  target_role: 'all' | UserRole;
  created_at?: string;
}
