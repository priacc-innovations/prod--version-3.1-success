import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Calendar as CalIcon, Clock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";
import API from "../../../api/axiosInstance";

interface Attendance {
    id: number;
    userId: number;
    empid: string;
    fullName: string;
    date: string;
    clockIn: string | null;
    clockOut: string | null;
    status: string;
}

export default function HRAttendance() {
    const [records, setRecords] = useState<Attendance[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [dateFilter, setDateFilter] = useState("");

    const loadAttendance = async () => {
        setLoading(true);
        try {
            const params: any = {};
            if (search) params.search = search;
            if (dateFilter) params.date = dateFilter;

            const res = await API.get("/attendance/all", { params });

            // ⭐ FIX – Map backend fields to frontend fields
            const mapped = res.data.map((item: any) => ({
                id: item.id,
                userId: item.userId || item.user?.id,
                fullName: item.fullName || item.user?.fullName,
                empid: item.empid,
                date: item.date,

                // Clock-in/out mapping from loginTime & logoutTime
                clockIn: item.loginTime ? item.loginTime.substring(0, 5) : null,
                clockOut: item.logoutTime ? item.logoutTime.substring(0, 5) : null,

                status: item.status,
            }));

            setRecords(mapped);
        } catch (err) {
            console.error("Failed to load attendance", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAttendance();
    }, []);

    const handleFilter = () => {
        loadAttendance();
    };

    return (
        <div className="space-y-6">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Attendance Overview
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        View employees&apos; Clock-In and Clock-Out details
                    </p>
                </div>
            </div>

            <Card glassmorphism>
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <CardTitle>Daily Attendance</CardTitle>

                        <div className="flex flex-col md:flex-row gap-3">
                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    placeholder="Search by name or EmpID..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-10 w-64"
                                />
                            </div>

                            {/* Date */}
                            <div className="relative">
                                <CalIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    type="date"
                                    value={dateFilter}
                                    onChange={(e) => setDateFilter(e.target.value)}
                                    className="pl-10 w-48"
                                />
                            </div>

                            <button
                                onClick={handleFilter}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </div>
                </CardHeader>

                <CardContent>
                    {loading ? (
                        <div className="text-center py-12 text-gray-500">Loading attendance...</div>
                    ) : records.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">No attendance records found</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full border-collapse">
                                <thead>
                                    <tr className="bg-gray-100 dark:bg-gray-800/60 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                        <th className="px-4 py-3">Employee</th>
                                        <th className="px-4 py-3">Emp ID</th>
                                        <th className="px-4 py-3">Date</th>
                                        <th className="px-4 py-3">Clock In</th>
                                        <th className="px-4 py-3">Clock Out</th>
                                        <th className="px-4 py-3">Status</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {records.map((r, index) => (
                                        <motion.tr
                                            key={r.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.03 }}
                                            className="border-b border-gray-200 dark:border-gray-700 text-sm"
                                        >
                                            <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                                                {r.fullName}
                                            </td>
                                            <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                                                {r.empid}
                                            </td>
                                            <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                                                {r.date}
                                            </td>

                                            {/* Clock In */}
                                            <td className="px-4 py-3 flex items-center gap-1 text-green-600 dark:text-green-400">
                                                <Clock className="w-4 h-4" />
                                                {r.clockIn || "-"}
                                            </td>

                                            {/* Clock Out */}
                                            <td className="px-4 py-3 flex items-center gap-1 text-red-600 dark:text-red-400">
                                                <Clock className="w-4 h-4" />
                                                {r.clockOut || "-"}
                                            </td>

                                            <td className="px-4 py-3">
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs font-medium
                                                        ${r.status === "PRESENT"
                                                            ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                                                            : r.status === "ABSENT"
                                                                ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                                                                : "bg-gray-100 text-gray-700 dark:bg-gray-800/60 dark:text-gray-300"
                                                        }`}
                                                >
                                                    {r.status || "N/A"}
                                                </span>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
