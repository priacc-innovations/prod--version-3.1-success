import React, { useEffect, useState } from "react";
import { Upload, FileText, Trash2, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/Card";

interface UploadedPayslip {
  employee_id: string;
  employee_name: string;
  file: File;
  month: number;
  year: number;
}

export default function PayslipManagement() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedPayslip[]>([]);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" | null }>({
    text: "",
    type: null,
  });
  const [employees, setEmployees] = useState<any[]>([]);

  // ---------------- GET EMPLOYEES ----------------
  useEffect(() => {
    fetch("/api/user/all")
      .then((res) => res.json())
      .then((data) => {
        setEmployees(
          data.map((u: any) => ({
            id: u.id,
            employee_id: u.empid,
            name: u.fullName,
          }))
        );
      })
      .catch(() => { });
  }, []);

  // ---------------- FILE SELECTION ----------------
  const handlePayslipUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const matched: UploadedPayslip[] = [];

    files.forEach((file) => {
      if (file.type !== "application/pdf") {
        setMessage({ text: "Only PDF files allowed.", type: "error" });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setMessage({ text: "Maximum file size is 5MB.", type: "error" });
        return;
      }

      const raw = file.name.replace(/\.pdf$/i, "");
      const parts = raw.split(" - "); // exact format required

      if (parts.length !== 2) return;

      const empid = parts[0].trim();
      const employee = employees.find((e) => e.employee_id === empid);

      if (employee) {
        matched.push({
          employee_id: employee.employee_id,
          employee_name: employee.name,
          file,
          month,
          year,
        });
      }
    });

    if (matched.length === 0) {
      setMessage({ text: "No matching employees found in filenames.", type: "error" });
      return;
    }

    setUploadedFiles((prev) => {
      const filtered = prev.filter(
        (p) =>
          !(p.month === month && p.year === year && matched.some((m) => m.employee_id === p.employee_id))
      );
      return [...filtered, ...matched];
    });

    setMessage({
      text: `File(s) selected: ${matched.map((m) => m.file.name).join(", ")}`,
      type: "success",
    });
  };

  // ---------------- UPLOAD TO BACKEND ----------------
  const handleUploadToBackend = async () => {
    const monthFiles = uploadedFiles.filter((f) => f.month === month && f.year === year);

    if (monthFiles.length === 0) {
      setMessage({ text: "Please select at least one payslip.", type: "error" });
      return;
    }

    const formData = new FormData();
    monthFiles.forEach((item) => {
      formData.append("files", item.file);
      formData.append("empids", item.employee_id);
    });

    formData.append("month", month.toString());
    formData.append("year", year.toString());

    try {
      const resp = await fetch("/api/payslips/upload/bulk", {
        method: "POST",
        body: formData,
      });

      const msg = await resp.text();

      if (!resp.ok) {
        setMessage({ text: "Upload failed: " + msg, type: "error" });
        return;
      }

      setUploadSuccess(true);
      setUploadedFiles((prev) => prev.filter((f) => !(f.month === month && f.year === year)));
      setMessage({ text: "Payslips uploaded successfully.", type: "success" });

      setTimeout(() => {
        setUploadSuccess(false);
        setMessage({ text: "", type: null });
      }, 3000);
    } catch {
      setMessage({ text: "Upload failed. Please try again.", type: "error" });
    }
  };

  // ---------------- REMOVE FILE ----------------
  const removeFile = (employee_id: string) => {
    setUploadedFiles((prev) =>
      prev.filter((f) => !(f.employee_id === employee_id && f.month === month && f.year === year))
    );
  };

  const getMonthName = (m: number) =>
    new Date(2000, m - 1).toLocaleString("default", { month: "long" });

  // ---------------- UI ----------------
  return (
    <div className="space-y-6">

      {/* Guidelines */}
      <div className="border border-orange-200 bg-orange-50 rounded-xl p-6 shadow-sm">
        <div className="flex gap-4">
          <div className="bg-orange-100 rounded-lg p-2">
            <FileText className="w-7 h-7 text-orange-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Important Guidelines</h2>
            <p className="mt-2"><b>File Format:</b> PDF only</p>
            <p><b>Max Size:</b> 5MB</p>
            <p><b>Format:</b> PIPLXXXX - Name.pdf</p>
          </div>
        </div>
      </div>

      <h1 className="text-3xl font-bold mb-2">Payslip Management</h1>

      {/* Month-Year Selector */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">Select Month & Year</h3>
          <div className="grid grid-cols-2 gap-4">
            <select value={month} onChange={(e) => setMonth(parseInt(e.target.value))} className="border p-2 rounded">
              {Array.from({ length: 12 }).map((_, i) => (
                <option key={i + 1} value={i + 1}>{getMonthName(i + 1)}</option>
              ))}
            </select>

            <select value={year} onChange={(e) => setYear(parseInt(e.target.value))} className="border p-2 rounded">
              {[2024, 2025, 2026].map((y) => (
                <option key={y}>{y}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Message */}
      {message.type && (
        <div
          className={`p-4 rounded-md flex items-center gap-2 ${message.type === "success"
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-700"
            }`}
        >
          {message.type === "success" && <CheckCircle className="w-5 h-5" />}
          {message.type === "error" && <AlertCircle className="w-5 h-5" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* File Upload UI */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Payslip PDFs for {getMonthName(month)} {year}</CardTitle>
        </CardHeader>

        <CardContent>
          <label className="border-2 border-dashed border-blue-300 rounded-lg p-8 cursor-pointer hover:bg-blue-50 block text-center">
            <input type="file" accept=".pdf" multiple className="hidden" onChange={handlePayslipUpload} />
            <Upload className="w-12 h-12 text-blue-500 mx-auto mb-2" />
            <p className="font-semibold text-blue-700">Click to upload files</p>
            <p className="text-gray-400 text-sm">or drag and drop</p>
          </label>

          {/* Selected Files */}
          {uploadedFiles.filter((f) => f.month === month && f.year === year).length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium mb-2">Payslips to Upload:</h4>

              <ul className="space-y-2">
                {uploadedFiles
                  .filter((f) => f.month === month && f.year === year)
                  .map((u) => (
                    <li key={u.employee_id} className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-500" />
                      {u.employee_id} - {u.employee_name} ({u.file.name})

                      <button onClick={() => removeFile(u.employee_id)} className="ml-2 p-1 hover:bg-red-100 rounded">
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </li>
                  ))}
              </ul>

              <Button onClick={handleUploadToBackend} className="gap-2 mt-4">
                <Upload className="w-5 h-5" /> Upload{" "}
                {uploadedFiles.filter((f) => f.month === month && f.year === year).length} Payslip(s)
              </Button>
            </div>
          )}

          {uploadSuccess && (
            <div className="flex items-center gap-2 mt-4 text-green-700">
              <CheckCircle className="w-5 h-5" />
              Upload Successful!
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
