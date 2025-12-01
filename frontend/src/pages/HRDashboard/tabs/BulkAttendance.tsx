import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Download, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { mockEmployees, mockAttendance } from '../../../data/mockData';

export default function BulkAttendance() {
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [uploadMessage, setUploadMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [records, setRecords] = useState<any[]>([]);

  // ✅ ACCEPT CSV + GOOGLE SHEET .xlsx
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const isCSV = file.name.endsWith(".csv");
    const isExcel = file.name.endsWith(".xlsx");

    if (!isCSV && !isExcel) {
      setUploadStatus('error');
      setUploadMessage('Please upload a CSV or Google Sheet (.xlsx) file');
      return;
    }

    setSelectedFile(file);

    try {
      let parsedRecords: any[] = [];

      if (isCSV) {
        const text = await file.text();
        const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
        const dataLines = lines.slice(1);

        parsedRecords = dataLines.map((line) => {
          const [empid, name, date, domain, remark] = line.split(',').map((s) => s.trim());
          return { employeeId: empid, name, date, domain, remark };
        });
      }

      if (isExcel) {
        const XLSX = await import("xlsx");
        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet);

        parsedRecords = json.map((row: any) => ({
          employeeId: row.empid || row.EmployeeID || row["Employee ID"] || row["Emp ID"],
          name: row.name || row.Name,
          date: row.date || row.Date,
          domain: row.domain || row.Domain,
          remark: row.remark || row.Remark
        }));
      }

      setRecords(parsedRecords);

      setUploadStatus("success");
      setUploadMessage("File uploaded successfully! Click Submit to save attendance.");

    } catch (err) {
      setUploadStatus("error");
      setUploadMessage("Failed to read file");
    }
  };

  // ✅ SUBMIT ATTENDANCE ONLY AFTER FILE UPLOADED
  const handleSubmit = async () => {
    if (!records.length) return;

    console.log(records);

    try {
      const response = await fetch("/api/csv/save-bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(records),
      });

      const message = await response.text();

      if (message.includes("already exists")) {
        setUploadStatus('error');
        setUploadMessage("Attendance for this date already exists!");
      } else if (message.toLowerCase().includes("success")) {
        setUploadStatus('success');
        setUploadMessage("Attendance uploaded successfully!");
      } else {
        setUploadStatus('error');
        setUploadMessage(message);
      }

    } catch (error) {
      setUploadStatus('error');
      setUploadMessage("Failed to submit to backend.");
    }

    setTimeout(() => {
      setUploadStatus("idle");
      setUploadMessage("");
    }, 5000);
  };

  const generateCSVTemplate = () => {
    const headers = ['empid', 'name', 'date', 'domain', 'remark'];
    const sampleData = [
      ['EMP001', 'John Doe', '2025-11-22', 'IT'],
      ['EMP002', 'Maya Rao', '2025-11-22', 'HR'],
    ];

    const csv = [headers, ...sampleData].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'attendance_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const downloadMonthlyAttendance = () => {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), 24);
    startDate.setMonth(startDate.getMonth() - 1);
    const endDate = new Date(today.getFullYear(), today.getMonth(), 23);

    const headers = ['Employee ID', 'Employee Name', 'Date', 'Status', 'Login Time', 'Logout Time', 'Remarks'];

    const filteredAttendance = mockAttendance.filter((att) => {
      const attDate = new Date(att.date);
      return attDate >= startDate && attDate <= endDate;
    });

    const rows = filteredAttendance.map((att) => {
      const employee = mockEmployees.find((emp) => emp.id === att.user_id);
      return [
        employee?.employee_id || 'N/A',
        employee?.full_name || 'N/A',
        att.date,
        att.status,
        att.login_time || 'N/A',
        att.logout_time || 'N/A',
        att.remarks || '',
      ];
    });

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_${startDate.toISOString().split('T')[0]}_to_${endDate.toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* --- UI remains 100% unchanged --- */}

      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Bulk Attendance Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Upload CSV files to update attendance or download monthly reports
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card glassmorphism>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Upload className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Upload Attendance CSV</CardTitle>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 text-center hover:border-blue-500 dark:hover:border-blue-500 transition-colors">
              <label htmlFor="csv-upload" className="cursor-pointer block">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto">
                    <Upload className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      Click to upload CSV file
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      or drag and drop
                    </p>
                  </div>
                </div>
                <input
                  id="csv-upload"
                  type="file"
                  accept=".csv, .xlsx"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Result Message */}
            {uploadStatus !== 'idle' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg border-2 ${uploadStatus === 'success'
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                  : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                  }`}
              >
                <div className="flex items-start gap-3">
                  {uploadStatus === 'success' ? (
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  )}
                  <p
                    className={`text-sm ${uploadStatus === 'success'
                      ? 'text-green-800 dark:text-green-300'
                      : 'text-red-800 dark:text-red-300'
                      }`}
                  >
                    {uploadMessage}
                  </p>
                </div>
              </motion.div>
            )}

            <Button
              onClick={handleSubmit}
              disabled={!selectedFile}
              className="w-full"
            >
              Submit Attendance
            </Button>

            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 dark:text-white">
                CSV Format Requirements:
              </h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Column 1: Employee ID</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Column 2: Name</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Column 3: Date</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Column 4: Domain</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Column 5: Remark</span>
                </li>
              </ul>
            </div>

            <Button onClick={generateCSVTemplate} variant="outline" className="w-full">
              <FileText className="w-4 h-4 mr-2" />
              Download CSV Template
            </Button>
          </CardContent>
        </Card>

        {/* RIGHT SIDE -- unchanged */}
        <Card glassmorphism>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <Download className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Download Attendance Report</CardTitle>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      Monthly Attendance Report
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      24th of last month to 23rd of current month
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <p>
                    <span className="font-medium">Includes:</span> All employees, dates, status, clock times, and remarks
                  </p>
                  <p>
                    <span className="font-medium">Format:</span> CSV (Compatible with Excel, Google Sheets)
                  </p>
                  <p>
                    <span className="font-medium">Data Range:</span> Salary period (24th to 23rd)
                  </p>
                </div>
              </div>
            </div>

            <Button onClick={downloadMonthlyAttendance} className="w-full gap-2" size="lg">
              <Download className="w-5 h-5" />
              Download Monthly Report (24th-23rd)
            </Button>

            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 text-sm">
                Automatic Wallet Updates
              </h4>
              <p className="text-xs text-blue-800 dark:text-blue-300">
                When you upload attendance data, employee wallets are automatically updated.
                Absent days reduce monthly earning by daily rate.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rest UI unchanged */}
      <Card glassmorphism>
        <CardHeader>
          <CardTitle>Important Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Absent Day Policy
              </h4>
              <p className="text-sm text-yellow-800 dark:text-yellow-300">
                If an employee is marked absent, their daily rate amount will not be credited.
              </p>
            </div>

            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
              <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Weekend Leave Rule
              </h4>
              <p className="text-sm text-orange-800 dark:text-orange-300">
                If an employee is absent on Friday or Monday, weekend days may count as leave.
              </p>
            </div>

            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
              <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Salary Period
              </h4>
              <p className="text-sm text-purple-800 dark:text-purple-300">
                Covers 24th of previous month to 23rd of current month.
              </p>
            </div>

            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Notifications
              </h4>
              <p className="text-sm text-green-800 dark:text-green-300">
                Employees receive notification ribbons when attendance updates.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
