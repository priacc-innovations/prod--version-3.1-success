import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';

export default function AnnouncementManagement() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Announcements
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Send announcements to all users
        </p>
      </div>
      <Card glassmorphism>
        <CardHeader>
          <CardTitle>Create Announcement</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Announcement management view coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}
