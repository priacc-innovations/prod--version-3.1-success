import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, DollarSign, TrendingUp, Calendar, AlertCircle, Info, TrendingDown } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { useAuthStore } from '../../../store/authStore';

export default function MyWallet() {
  const user = useAuthStore((state) => state.user);

  const [monthlySalary, setMonthlySalary] = useState(0);
  const [dailyRate, setDailyRate] = useState(0);
  const [monthlyEarning, setMonthlyEarning] = useState(0);
  const [workingDays, setWorkingDays] = useState(0);
  const [presentDays, setPresentDays] = useState(0);
  const [totalDeductions] = useState(0);

  useEffect(() => {
    if (user) {
      loadWalletData();
    }
  }, [user]);

  // =========================================================
  //  LOAD DATA FROM BACKEND
  // =========================================================
  const loadWalletData = async () => {
    if (!user) return;

    try {
      // -----------------------------------
      // 1️⃣ GET USER MONTHLY SALARY (base_salary)
      // -----------------------------------
      const userRes = await fetch(`/api/user/${user.id}`);
      const userData = await userRes.json();

      const monthlySalaryValue = userData.baseSalary || 0;
      setMonthlySalary(monthlySalaryValue);

      const rate = monthlySalaryValue / 30;
      setDailyRate(rate);

      // -----------------------------------
      // 2️⃣ FETCH ATTENDANCE FOR THIS USER
      // -----------------------------------
      const attRes = await fetch(`/api/attendance/user/${user.id}`);
      const attendance = await attRes.json();

      // Total attendance entries = working days
      setWorkingDays(attendance.length);

      // Present count
      const present = attendance.filter(
        (a: any) =>
          a.status?.toLowerCase() === 'present' ||
          a.status?.toLowerCase() === 'late'
      ).length;

      setPresentDays(present);

      // -----------------------------------
      // 3️⃣ MONTHLY EARNING (present × rate)
      // -----------------------------------
      const calculatedEarning = present * rate;
      setMonthlyEarning(calculatedEarning);

    } catch (err) {
      console.error("Failed to load wallet data:", err);
    }
  };



  const today = new Date().getDate();
  const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
  const salaryPeriod = `24th of last month to 23rd of ${currentMonth}`;

  // =========================================================
  //  UI STARTS — THIS SECTION IS UNTOUCHED
  // =========================================================

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          My Wallet
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track your salary and monthly earnings
        </p>
      </div>

      {/* Earnings Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 rounded-2xl p-8 text-white shadow-2xl"
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-green-100 mb-1">Current Month Earnings</p>
            <p className="text-sm text-green-200">Period: {salaryPeriod}</p>
          </div>
          <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <Wallet className="w-7 h-7" />
          </div>
        </div>

        <div className="mb-6">
          <p className="text-5xl font-bold mb-2">₹{monthlyEarning.toLocaleString()}</p>
          <p className="text-green-100">Based on {presentDays} working days</p>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/20">
          <div>
            <p className="text-green-200 text-sm mb-1">Daily Rate</p>
            <p className="text-2xl font-semibold">₹{dailyRate.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-green-200 text-sm mb-1">Monthly Salary</p>
            <p className="text-2xl font-semibold">₹{monthlySalary.toLocaleString()}</p>
          </div>
        </div>
      </motion.div>

      {/* Deductions Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-red-500 via-orange-500 to-amber-500 rounded-2xl p-8 text-white shadow-2xl"
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-red-100 mb-1">Promise to Pay (Deductions)</p>
            <p className="text-sm text-red-200">Total deducted amount</p>
          </div>
          <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <TrendingDown className="w-7 h-7" />
          </div>
        </div>

        <div className="mb-6">
          <p className="text-5xl font-bold mb-2">₹{totalDeductions.toLocaleString()}</p>
          <p className="text-red-100">Amount to be credited back</p>
        </div>

        <div className="pt-6 border-t border-white/20">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-white/90">
                <strong>Note:</strong> Deducted amount will be credited once your performance
                increases and you are allocated to a project.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* IMPORTANT NOTICE CARD */}
      <Card glassmorphism className="border-2 border-orange-200 dark:border-orange-800">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Important Notice
              </h3>
              <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <p>
                  <strong>This is not your final salary calculation.</strong> The amount shown is a
                  provisional earning based on your attendance from the 24th of last month to the
                  23rd of the current month.
                </p>
                <p>
                  Final salary processing and any applicable deductions or bonuses will be
                  calculated and credited on the <strong>30th of every month</strong>.
                </p>
                <p className="text-orange-700 dark:text-orange-400 font-medium">
                  Note: Absent days reduce your earnings by ₹{dailyRate.toFixed(2)} per day.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Three Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card glassmorphism>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Working Days</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {workingDays}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card glassmorphism>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Present Days</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {presentDays}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card glassmorphism>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Attendance %</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {workingDays > 0 ? ((presentDays / workingDays) * 100).toFixed(1) : 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Salary Calculation Details */}
      <Card glassmorphism>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-500" />
            Salary Calculation Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
              <span className="text-gray-700 dark:text-gray-300">Monthly Salary</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                ₹{monthlySalary.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
              <span className="text-gray-700 dark:text-gray-300">Daily Rate (Monthly ÷ 30)</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                ₹{dailyRate.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
              <span className="text-gray-700 dark:text-gray-300">
                Present Days × Daily Rate
              </span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {presentDays} ×  ₹{dailyRate.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border-2 border-green-200 dark:border-green-800">
              <span className="font-semibold text-green-900 dark:text-green-100">
                Provisional Earnings
              </span>
              <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                ₹{monthlyEarning.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Salary Period: 24th to 23rd
            </h4>
            <p className="text-sm text-blue-800 dark:text-blue-300">
              Your monthly salary is calculated from the 24th of the previous month to the 23rd of
              the current month. This ensures timely processing and payment on the 30th of each month.
            </p>
          </div>

          <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
              Weekend Leave Policy
            </h4>
            <p className="text-sm text-yellow-800 dark:text-yellow-300">
              If you take leave or are absent on Friday or Monday, Saturday and Sunday will also be
              counted as leave days. This policy helps maintain consistent attendance patterns.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
