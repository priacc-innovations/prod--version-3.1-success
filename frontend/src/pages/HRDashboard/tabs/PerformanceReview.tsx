import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';

export default function PerformanceReview() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Performance Review</h1>
      <Card glassmorphism>
        <CardHeader><CardTitle>Performance Reviews</CardTitle></CardHeader>
        <CardContent><p className="text-gray-500">Performance review view coming soon...</p></CardContent>
      </Card>
    </div>
  );
}
