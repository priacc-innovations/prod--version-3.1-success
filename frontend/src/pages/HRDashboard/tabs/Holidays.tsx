import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';

export default function Holidays() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Holidays</h1>
      <Card glassmorphism>
        <CardHeader><CardTitle>Holiday Calendar</CardTitle></CardHeader>
        <CardContent><p className="text-gray-500">Holiday calendar view coming soon...</p></CardContent>
      </Card>
    </div>
  );
}
