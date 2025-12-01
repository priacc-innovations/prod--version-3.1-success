import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';

export default function AttendanceSummary() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Attendance Summary
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          View monthly attendance summary for all employees
        </p>
      </div>
      <Card glassmorphism>
        <CardHeader>
          <CardTitle>Monthly Attendance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Attendance summary view coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}
