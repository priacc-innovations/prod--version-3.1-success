import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Download, DollarSign, TrendingDown, Plus } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import toast from "react-hot-toast";


interface Employee {
  id: number;
  employee_id: string;
  full_name: string;
  department: string;
  monthly_salary: number;
  total_deductions: number;
  net_salary: number;
  days_present: number;
  days_absent: number;
}

export default function SalaryManagement() {
  const [showAddDeduction, setShowAddDeduction] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [employees, setEmployees] = useState<Employee[]>([]);

  const [deductionForm, setDeductionForm] = useState({
    amount: '',
    reason: '',
  });

  // ---------------------------------------------------------------------
  // 🚀 VENKATASAGAR — LOAD REAL BACKEND SALARY DATA
  // ---------------------------------------------------------------------
  useEffect(() => {
    loadAllEmployees();
  }, []);

  const loadAllEmployees = async () => {
    try {
      const salaryRes = await fetch("/salary/all");
      const wallets = await salaryRes.json();

      const loaded = wallets.map((w: { user: { id: any; fullName: any; domain: any; }; empid: any; monthlySalary: any; deduction: any; currentMonthEarned: any; daysPresent: any; daysAbsent: any; }) => ({
        id: w.user.id,
        employee_id: w.empid,
        full_name: w.user.fullName,
        department: w.user.domain,
        monthly_salary: w.monthlySalary,
        total_deductions: w.deduction,
        net_salary: w.currentMonthEarned,
        days_present: w.daysPresent || 0,
        days_absent: w.daysAbsent || 0,
      }));

      setEmployees(loaded);

    } catch (e) {
      console.error("ERROR loading salary:", e);
      toast.error("ERROR loading salary:");

    }
  };


  // Calculations
  const totalSalaries = employees.reduce((sum, emp) => sum + emp.monthly_salary, 0);
  const totalDeductions = employees.reduce((sum, emp) => sum + emp.total_deductions, 0);
  const totalNetSalaries = employees.reduce((sum, emp) => sum + emp.net_salary, 0);

  const downloadCSV = () => {
    const headers = [
      'Employee ID',
      'Full Name',
      'Department',
      'Monthly Salary',
      'Total Deductions',
      'Net Salary',
      'Days Present',
      'Days Absent',
      'Attendance %',
    ];

    const rows = employees.map((emp) => [
      emp.employee_id,
      emp.full_name,
      emp.department,
      emp.monthly_salary,
      emp.total_deductions,
      emp.net_salary,
      emp.days_present,
      emp.days_absent,
      ((emp.days_present / (emp.days_present + emp.days_absent)) * 100 || 0).toFixed(2) + '%',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.join(',')),
      '',
      `Total Salaries,,,${totalSalaries}`,
      `Total Deductions,,,${totalDeductions}`,
      `Total Net Salaries,,,${totalNetSalaries}`,
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `salary_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const handleAddDeduction = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const empObj = employees.find(emp => emp.id === Number(selectedEmployee));

      if (!empObj) {
        toast.error("Employee not found!");
        return;
      }

      const empid = empObj.employee_id;

      const res = await fetch(
        `/salary/add/deduction/${empid}/${deductionForm.amount}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" }
        }
      );

      const msg = await res.text();

      toast.success(msg);  // 🎉 Replaced alert()

      loadAllEmployees(); // reload updated salary list

    } catch (err) {
      toast.error("Failed to add deduction"); // ❌ alert → ✅ toast
    }

    setShowAddDeduction(false);
    setDeductionForm({ amount: '', reason: '' });
    setSelectedEmployee('');
  };



  // =====================================================================
  // 🚀 FULL UI (UNTOUCHED) — YOU ASKED NOT TO MODIFY UI
  // =====================================================================
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Salary Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage employee salaries, deductions, and export reports
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => setShowAddDeduction(true)} variant="outline" className="gap-2">
            <Plus className="w-5 h-5" />
            Add Deduction
          </Button>
          <Button onClick={downloadCSV} className="gap-2">
            <Download className="w-5 h-5" />
            Download CSV Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card glassmorphism>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Salaries</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${totalSalaries.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card glassmorphism>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Deductions</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  ${totalDeductions.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card glassmorphism>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Net Payable</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  ${totalNetSalaries.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <Wallet className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Deduction Popup */}
      {showAddDeduction && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowAddDeduction(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6"
          >
            <h2 className="text-2xl font-bold mb-6">Add Salary Deduction</h2>
            <form onSubmit={handleAddDeduction} className="space-y-4">
              <div>
                <label>Select Employee *</label>
                <select
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                  required
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="">Select Employee</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.employee_id} - {emp.full_name}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="Deduction Amount *"
                type="number"
                value={deductionForm.amount}
                onChange={(e) =>
                  setDeductionForm({ ...deductionForm, amount: e.target.value })
                }
                required
              />

              <textarea
                className="w-full p-2 border rounded-lg"
                rows={3}
                required
                placeholder="Reason"
                value={deductionForm.reason}
                onChange={(e) =>
                  setDeductionForm({ ...deductionForm, reason: e.target.value })
                }
              ></textarea>

              <div className="flex gap-3 mt-6">
                <Button type="submit" className="flex-1">
                  Add Deduction
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddDeduction(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* Salary Table */}
      <Card glassmorphism>
        <CardHeader>
          <CardTitle>Employee Salary Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">EMP ID</th>
                  <th className="text-left py-3 px-4">Name</th>
                  <th className="text-left py-3 px-4">Department</th>
                  <th className="text-right py-3 px-4">Monthly Salary</th>
                  <th className="text-right py-3 px-4">Deductions</th>
                  <th className="text-right py-3 px-4">Net Salary</th>
                  <th className="text-center py-3 px-4">Attendance</th>
                </tr>
              </thead>

              <tbody>
                {employees.map((employee, index) => (
                  <motion.tr
                    key={employee.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="py-3 px-4">{employee.employee_id}</td>
                    <td className="py-3 px-4">{employee.full_name}</td>
                    <td className="py-3 px-4">{employee.department}</td>
                    <td className="py-3 px-4 text-right">${employee.monthly_salary.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right text-red-600">${employee.total_deductions.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right text-green-600">${employee.net_salary.toLocaleString()}</td>
                    <td className="py-3 px-4 text-center">
                      {employee.days_present}/{employee.days_present + employee.days_absent}
                    </td>
                  </motion.tr>
                ))}
              </tbody>

              <tfoot>
                <tr className="bg-gray-50 font-semibold">
                  <td colSpan={3} className="py-3 px-4">TOTAL</td>
                  <td className="py-3 px-4 text-right">${totalSalaries.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right text-red-600">${totalDeductions.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right text-green-600">${totalNetSalaries.toLocaleString()}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
