/*
  # MAMA - Modern Attendance Management Application Database Schema

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `password` (text, hashed)
      - `full_name` (text)
      - `role` (text: admin, hr, employee)
      - `employee_id` (text, unique for employees)
      - `department` (text)
      - `designation` (text)
      - `joining_date` (date)
      - `salary` (numeric)
      - `avatar_url` (text)
      - `created_by` (uuid, foreign key)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `attendance`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `date` (date)
      - `login_time` (time)
      - `logout_time` (time)
      - `status` (text: present, absent, half_day, leave, late, early_logout)
      - `remarks` (text)
      - `marked_by` (uuid, foreign key to HR)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `performance`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `week_number` (integer)
      - `month` (integer)
      - `year` (integer)
      - `rating` (numeric 1-5)
      - `feedback` (text)
      - `task_completion` (numeric percentage)
      - `behavior_score` (numeric 1-5)
      - `reviewed_by` (uuid, foreign key to HR)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `leave_requests`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `start_date` (date)
      - `end_date` (date)
      - `reason` (text)
      - `attachment_url` (text)
      - `status` (text: pending, approved, rejected)
      - `approved_by` (uuid, foreign key)
      - `approval_date` (timestamptz)
      - `created_at` (timestamptz)
    
    - `wallet`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key, unique)
      - `monthly_salary` (numeric)
      - `daily_rate` (numeric)
      - `current_month_earned` (numeric)
      - `last_updated` (timestamptz)
    
    - `holidays`
      - `id` (uuid, primary key)
      - `date` (date, unique)
      - `name` (text)
      - `description` (text)
      - `created_at` (timestamptz)
    
    - `announcements`
      - `id` (uuid, primary key)
      - `title` (text)
      - `message` (text)
      - `created_by` (uuid, foreign key)
      - `target_role` (text: all, admin, hr, employee)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access control
    - Admins can access everything
    - HR can access employee and attendance data
    - Employees can only access their own data

  3. Important Notes
    - All timestamps use timestamptz for accurate timezone handling
    - Attendance logic will be handled in application layer
    - Wallet calculations will be automated based on attendance
    - Performance reviews support both weekly and monthly tracking
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password text NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'hr', 'employee')),
  employee_id text UNIQUE,
  department text,
  designation text,
  joining_date date DEFAULT CURRENT_DATE,
  salary numeric DEFAULT 0,
  avatar_url text,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create attendance table
CREATE TABLE IF NOT EXISTS attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL,
  login_time time,
  logout_time time,
  status text NOT NULL CHECK (status IN ('present', 'absent', 'half_day', 'leave', 'late', 'early_logout')),
  remarks text DEFAULT '',
  marked_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, date)
);

ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

-- Create performance table
CREATE TABLE IF NOT EXISTS performance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  week_number integer,
  month integer NOT NULL,
  year integer NOT NULL,
  rating numeric CHECK (rating >= 1 AND rating <= 5),
  feedback text DEFAULT '',
  task_completion numeric DEFAULT 0,
  behavior_score numeric CHECK (behavior_score >= 1 AND behavior_score <= 5),
  reviewed_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE performance ENABLE ROW LEVEL SECURITY;

-- Create leave_requests table
CREATE TABLE IF NOT EXISTS leave_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  reason text NOT NULL,
  attachment_url text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  approved_by uuid REFERENCES users(id),
  approval_date timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE leave_requests ENABLE ROW LEVEL SECURITY;

-- Create wallet table
CREATE TABLE IF NOT EXISTS wallet (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  monthly_salary numeric DEFAULT 0,
  daily_rate numeric DEFAULT 0,
  current_month_earned numeric DEFAULT 0,
  last_updated timestamptz DEFAULT now()
);

ALTER TABLE wallet ENABLE ROW LEVEL SECURITY;

-- Create holidays table
CREATE TABLE IF NOT EXISTS holidays (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date UNIQUE NOT NULL,
  name text NOT NULL,
  description text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE holidays ENABLE ROW LEVEL SECURITY;

-- Create announcements table
CREATE TABLE IF NOT EXISTS announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  message text NOT NULL,
  created_by uuid REFERENCES users(id) NOT NULL,
  target_role text DEFAULT 'all' CHECK (target_role IN ('all', 'admin', 'hr', 'employee')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Admins can view all users"
  ON users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users AS u
      WHERE u.id = auth.uid() AND u.role = 'admin'
    )
  );

CREATE POLICY "HR can view employees"
  ON users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users AS u
      WHERE u.id = auth.uid() AND u.role IN ('admin', 'hr')
    )
  );

CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Admins can insert HR users"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users AS u
      WHERE u.id = auth.uid() AND u.role = 'admin'
    )
  );

CREATE POLICY "HR can insert employees"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users AS u
      WHERE u.id = auth.uid() AND u.role IN ('admin', 'hr')
    )
  );

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- RLS Policies for attendance table
CREATE POLICY "Users can view own attendance"
  ON attendance FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role IN ('admin', 'hr')
    )
  );

CREATE POLICY "HR and Admin can insert attendance"
  ON attendance FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role IN ('admin', 'hr')
    )
  );

CREATE POLICY "HR and Admin can update attendance"
  ON attendance FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role IN ('admin', 'hr')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role IN ('admin', 'hr')
    )
  );

-- RLS Policies for performance table
CREATE POLICY "Users can view own performance"
  ON performance FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role IN ('admin', 'hr')
    )
  );

CREATE POLICY "HR and Admin can manage performance"
  ON performance FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role IN ('admin', 'hr')
    )
  );

CREATE POLICY "HR and Admin can update performance"
  ON performance FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role IN ('admin', 'hr')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role IN ('admin', 'hr')
    )
  );

-- RLS Policies for leave_requests table
CREATE POLICY "Users can view own leave requests"
  ON leave_requests FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role IN ('admin', 'hr')
    )
  );

CREATE POLICY "Users can create leave requests"
  ON leave_requests FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admin can update leave requests"
  ON leave_requests FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- RLS Policies for wallet table
CREATE POLICY "Users can view own wallet"
  ON wallet FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role IN ('admin', 'hr')
    )
  );

CREATE POLICY "HR and Admin can manage wallet"
  ON wallet FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role IN ('admin', 'hr')
    )
  );

CREATE POLICY "HR and Admin can update wallet"
  ON wallet FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role IN ('admin', 'hr')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role IN ('admin', 'hr')
    )
  );

-- RLS Policies for holidays table
CREATE POLICY "Everyone can view holidays"
  ON holidays FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin can manage holidays"
  ON holidays FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

CREATE POLICY "Admin can update holidays"
  ON holidays FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

CREATE POLICY "Admin can delete holidays"
  ON holidays FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- RLS Policies for announcements table
CREATE POLICY "Users can view relevant announcements"
  ON announcements FOR SELECT
  TO authenticated
  USING (
    target_role = 'all' OR
    target_role = (SELECT role FROM users WHERE id = auth.uid())
  );

CREATE POLICY "Admin can create announcements"
  ON announcements FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_attendance_user_date ON attendance(user_id, date);
CREATE INDEX IF NOT EXISTS idx_performance_user ON performance(user_id, year, month);
CREATE INDEX IF NOT EXISTS idx_leave_requests_user ON leave_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_wallet_user ON wallet(user_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);