import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, CalendarDays, Gift } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { organizationHolidays } from '../../../data/mockData';
import { format } from 'date-fns';

export default function Holidays() {
  const [selectedYear] = useState(2025);

  const publicHolidays = organizationHolidays.filter((h) => h.type === 'public');
  const optionalHolidays = organizationHolidays.filter((h) => h.type === 'optional');

  const getMonthName = (date: string) => {
    return format(new Date(date), 'MMMM');
  };

  const groupByMonth = (holidays: typeof organizationHolidays) => {
    const grouped: Record<string, typeof organizationHolidays> = {};
    holidays.forEach((holiday) => {
      const month = getMonthName(holiday.date);
      if (!grouped[month]) {
        grouped[month] = [];
      }
      grouped[month].push(holiday);
    });
    return grouped;
  };

  const groupedHolidays = groupByMonth(organizationHolidays);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Organization Holidays
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          View all public and optional holidays for {selectedYear}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card glassmorphism>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Calendar className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Public Holidays</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {publicHolidays.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card glassmorphism>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center">
                <Gift className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Optional Holidays</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {optionalHolidays.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card glassmorphism>
        <CardHeader>
          <CardTitle>Holiday Calendar {selectedYear}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.entries(groupedHolidays).map(([month, holidays], index) => (
              <motion.div
                key={month}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-blue-500" />
                  {month}
                </h3>
                <div className="space-y-2">
                  {holidays.map((holiday) => (
                    <div
                      key={holiday.id}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex flex-col items-center justify-center text-white">
                            <span className="text-xs font-medium">
                              {format(new Date(holiday.date), 'MMM')}
                            </span>
                            <span className="text-xl font-bold">
                              {format(new Date(holiday.date), 'dd')}
                            </span>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {holiday.name}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {holiday.description}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            {format(new Date(holiday.date), 'EEEE')}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium uppercase ${
                          holiday.type === 'public'
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                            : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
                        }`}
                      >
                        {holiday.type}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card glassmorphism className="border-2 border-blue-200 dark:border-blue-800">
        <CardContent className="p-6">
          <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
            <div>
              <span className="font-semibold text-gray-900 dark:text-white">Public Holidays:</span> All employees are entitled to leave on these days with full pay.
            </div>
            <div>
              <span className="font-semibold text-gray-900 dark:text-white">Optional Holidays:</span> Employees can choose to take leave on these days based on personal/religious preferences.
            </div>
            <div>
              <span className="font-semibold text-gray-900 dark:text-white">Note:</span> If a holiday falls on a weekend (Saturday/Sunday), it may be observed on the following Monday.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
