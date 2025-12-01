/*
  # Add Trainer, Deduction, Payslip and Task Management Tables
  
  ## New Tables
  
  ### 1. trainers
    - Domain-specific trainers who can manage employee performance
    - Domain field to match with employees
  
  ### 2. salary_deductions
    - Track deductions (Promise to Pay)
    - Monthly deduction amounts per employee
  
  ### 3. payslips
    - PDF payslip storage references
    - Monthly payslips per employee
  
  ### 4. daily_tasks
    - Task assignment and tracking
    - Trainers assign, employees complete
  
  ## Updates
    - Add domain and date_of_birth fields to users table
    - Update role enum to include trainer
*/

-- Update role check constraint on users table to include trainer
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'domain'
  ) THEN
    ALTER TABLE users ADD COLUMN domain text;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'date_of_birth'
  ) THEN
    ALTER TABLE users ADD COLUMN date_of_birth date;
  END IF;
END $$;

DO $$
BEGIN
  ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
  ALTER TABLE users ADD CONSTRAINT users_role_check 
    CHECK (role = ANY (ARRAY['admin'::text, 'hr'::text, 'trainer'::text, 'employee'::text]));
EXCEPTION
  WHEN others THEN NULL;
END $$;

-- Create trainers table
CREATE TABLE IF NOT EXISTS trainers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text UNIQUE NOT NULL,
  domain text NOT NULL,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE trainers ENABLE ROW LEVEL SECURITY;

-- Create salary_deductions table
CREATE TABLE IF NOT EXISTS salary_deductions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  month integer NOT NULL CHECK (month >= 1 AND month <= 12),
  year integer NOT NULL,
  deduction_amount numeric NOT NULL DEFAULT 0,
  reason text,
  added_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE salary_deductions ENABLE ROW LEVEL SECURITY;

-- Create payslips table
CREATE TABLE IF NOT EXISTS payslips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  month integer NOT NULL CHECK (month >= 1 AND month <= 12),
  year integer NOT NULL,
  file_url text NOT NULL,
  file_name text NOT NULL,
  uploaded_by uuid REFERENCES users(id),
  uploaded_at timestamptz DEFAULT now(),
  UNIQUE(user_id, month, year)
);

ALTER TABLE payslips ENABLE ROW LEVEL SECURITY;

-- Create daily_tasks table
CREATE TABLE IF NOT EXISTS daily_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid REFERENCES users(id) ON DELETE CASCADE,
  assigned_by uuid REFERENCES users(id),
  task_title text NOT NULL,
  task_description text,
  assigned_date date NOT NULL DEFAULT CURRENT_DATE,
  due_date date,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  completion_percentage numeric NOT NULL DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE daily_tasks ENABLE ROW LEVEL SECURITY;

-- Create admin_otps table for OTP-based authentication
CREATE TABLE IF NOT EXISTS admin_otps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  otp_code text NOT NULL,
  expires_at timestamptz NOT NULL,
  used boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admin_otps ENABLE ROW LEVEL SECURITY;

-- RLS Policies for trainers table
CREATE POLICY "Trainers can view own profile"
  ON trainers FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admin and HR can view all trainers"
  ON trainers FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role IN ('admin', 'hr')
    )
  );

CREATE POLICY "Admin can manage trainers"
  ON trainers FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- RLS Policies for salary_deductions table
CREATE POLICY "Employees can view own deductions"
  ON salary_deductions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "HR can view all deductions"
  ON salary_deductions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role IN ('hr', 'admin')
    )
  );

CREATE POLICY "HR can manage deductions"
  ON salary_deductions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role IN ('hr', 'admin')
    )
  );

-- RLS Policies for payslips table
CREATE POLICY "Employees can view own payslips"
  ON payslips FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "HR can view all payslips"
  ON payslips FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role IN ('hr', 'admin')
    )
  );

CREATE POLICY "HR can manage payslips"
  ON payslips FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role IN ('hr', 'admin')
    )
  );

-- RLS Policies for daily_tasks table
CREATE POLICY "Employees can view own tasks"
  ON daily_tasks FOR SELECT
  TO authenticated
  USING (employee_id = auth.uid());

CREATE POLICY "Employees can update own task status"
  ON daily_tasks FOR UPDATE
  TO authenticated
  USING (employee_id = auth.uid())
  WITH CHECK (employee_id = auth.uid());

CREATE POLICY "Trainers can view domain employee tasks"
  ON daily_tasks FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM trainers
      JOIN users AS employees ON employees.domain = trainers.domain
      WHERE trainers.user_id = auth.uid() AND employees.id = daily_tasks.employee_id
    )
  );

CREATE POLICY "Trainers can manage domain employee tasks"
  ON daily_tasks FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM trainers
      JOIN users AS employees ON employees.domain = trainers.domain
      WHERE trainers.user_id = auth.uid() AND employees.id = daily_tasks.employee_id
    )
  );

CREATE POLICY "HR can view all tasks"
  ON daily_tasks FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role IN ('hr', 'admin')
    )
  );

-- RLS Policies for admin_otps table (allow anon access for OTP generation)
CREATE POLICY "Anyone can create OTP"
  ON admin_otps FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can view OTP for verification"
  ON admin_otps FOR SELECT
  TO anon, authenticated
  USING (true);

-- Update performance table policies for trainers
CREATE POLICY "Trainers can view domain employee performance"
  ON performance FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM trainers
      JOIN users AS employees ON employees.domain = trainers.domain
      WHERE trainers.user_id = auth.uid() AND employees.id = performance.user_id
    )
  );

CREATE POLICY "Trainers can manage domain employee performance"
  ON performance FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM trainers
      JOIN users AS employees ON employees.domain = trainers.domain
      WHERE trainers.user_id = auth.uid() AND employees.id = performance.user_id
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_trainers_user_id ON trainers(user_id);
CREATE INDEX IF NOT EXISTS idx_trainers_domain ON trainers(domain);
CREATE INDEX IF NOT EXISTS idx_users_domain ON users(domain);
CREATE INDEX IF NOT EXISTS idx_deductions_user_month ON salary_deductions(user_id, month, year);
CREATE INDEX IF NOT EXISTS idx_payslips_user_month ON payslips(user_id, month, year);
CREATE INDEX IF NOT EXISTS idx_tasks_employee ON daily_tasks(employee_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_by ON daily_tasks(assigned_by);
