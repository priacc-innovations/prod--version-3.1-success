import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileText, Download, Calendar } from "lucide-react";
import { Card, CardContent } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { useAuthStore } from "../../../store/authStore";

interface Payslip {
  id: number;
  month: number;
  year: number;
  fileName: string;
  uploadedOn: string;
  empid?: string;
  fullName?: string;
}

export default function MyPayslips() {
  const { user } = useAuthStore();

  const empid = user?.empid;
  const [payslips, setPayslips] = useState<Payslip[]>([]);
  const [loading, setLoading] = useState(true);

  // ========================= FETCH PAYSLIPS =========================
  useEffect(() => {
    if (!empid) return;

    setLoading(true);

    fetch(`/api/payslips/empid/${empid}`)
      .then(async (res) => {
        if (!res.ok) {
          console.error("Fetch failed:", res.statusText);
          setPayslips([]);
          setLoading(false);
          return [];
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setPayslips(
            data.map((p: any) => ({
              id: p.id,
              month: p.month,
              year: p.year,
              fileName: p.fileName,
              uploadedOn: p.uploadedOn,
              empid: p.empid,
              fullName: p.fullName,
            }))
          );
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading payslips:", err);
        setLoading(false);
      });
  }, [empid]);

  // ========================= DOWNLOAD PAYSLIP =========================
  // const downloadPayslip = async (p: Payslip) => {
  //   try {
  //     const resp = await fetch(`/api/payslips/download/${p.id}`);

  //     if (!resp.ok) {
  //       alert("Unable to generate download link");
  //       return;
  //     }

  //     const signedUrl = await resp.text();

  //     if (!signedUrl || signedUrl.trim() === "") {
  //       alert("Invalid download link");
  //       return;
  //     }

  //     // OPEN THE CLOUDINARY AUTHENTICATED URL
  //     window.open(signedUrl, "_blank");
  //   } catch (err) {
  //     console.error("Download error:", err);
  //     alert("Failed to download payslip");
  //   }
  // };
  const downloadPayslip = async (p: Payslip) => {
    try {
      const resp = await fetch(`/api/payslips/download/${p.id}`);

      if (!resp.ok) {
        alert("Unable to generate download link");
        return;
      }

      // Backend returns plain text (signed URL string)
      const signedUrl = await resp.text();

      if (!signedUrl || signedUrl.trim() === "") {
        alert("Invalid signed URL from server");
        return;
      }

      // Open in new tab – Cloudinary will start download automatically
      window.open(signedUrl, "_blank", "noopener,noreferrer");

    } catch (err) {
      console.error("Download error:", err);
      alert("Failed to download payslip");
    }
  };


  const getMonthName = (month: number) =>
    new Date(2000, month - 1).toLocaleString("default", { month: "long" });

  // ========================= UI START =========================
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          My Payslips
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Download your monthly salary payslips
        </p>
      </div>

      {/* LOADING */}
      {loading ? (
        <Card glassmorphism>
          <CardContent className="p-12 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Loading payslips…</p>
          </CardContent>
        </Card>
      ) : payslips.length === 0 ? (
        // NO PAYSLIPS
        <Card glassmorphism>
          <CardContent className="p-12 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              No payslips found for your account.
            </p>
            <p className="text-blue-700 dark:text-blue-400 mt-2 font-medium">
              If this seems wrong, please contact HR.
            </p>
          </CardContent>
        </Card>
      ) : (
        // PAYSLIP LIST
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {payslips.map((p, index) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card glassmorphism className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                      <FileText className="w-6 h-6 text-white" />
                    </div>

                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {p.uploadedOn ? new Date(p.uploadedOn).toLocaleDateString() : ""}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                    {getMonthName(p.month)} {p.year}
                  </h3>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Salary Payslip
                  </p>

                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500 mb-4">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Uploaded on{" "}
                      {p.uploadedOn ? new Date(p.uploadedOn).toLocaleDateString() : ""}
                    </span>
                  </div>

                  <Button
                    onClick={() => downloadPayslip(p)}
                    className="w-full gap-2"
                    size="sm"
                  >
                    <Download className="w-4 h-4" />
                    Download PDF
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* INFO BOX */}
      <Card glassmorphism className="border-2 border-blue-200 dark:border-blue-800">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
              <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                About Payslips
              </h3>
              <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <p>Payslips are generated every month by HR.</p>
                <p>They include salary, deductions and net pay.</p>
                <p className="text-blue-700 dark:text-blue-400 font-medium">
                  For missing payslips, please contact HR.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
