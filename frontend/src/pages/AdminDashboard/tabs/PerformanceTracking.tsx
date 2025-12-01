import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';

export default function PerformanceTracking() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Performance Tracking
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track performance trends of each employee
        </p>
      </div>
      <Card glassmorphism>
        <CardHeader>
          <CardTitle>Performance Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Performance tracking view coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}
