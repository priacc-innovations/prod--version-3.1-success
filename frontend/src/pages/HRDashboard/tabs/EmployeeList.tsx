import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Mail, Calendar, Briefcase, Download, Pencil, Save, X } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import API from '../../../api/axiosInstance';
import * as XLSX from "xlsx";
import { useAuthStore } from '../../../store/authStore';
import { useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";

interface User {
  id: number;
  fullName: string;
  email: string;
  empid: number;
  designation: string;
  domain: string;
  baseSalary: number;
  photoUrl: string | null;
  role: string;
}

export default function AllEmployees() {
  const [employees, setEmployees] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const { user } = useAuthStore();

  // ⭐ Track editing state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({
    fullName: "",
    email: "",
    designation: "",
    domain: "",
    baseSalary: ""
  });

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    setLoading(true);
    try {
      const res = await API.get('/user/all');
      const data = res.data || [];

      const onlyEmployees = data.filter((u: User) => u.role === "employee");

      const updatedEmployees = await Promise.all(
        onlyEmployees.map(async (emp: { id: any }) => {
          try {
            const fullUser = await API.get(`/user/${emp.id}`);
            return { ...emp, photoUrl: fullUser.data.photoUrl };
          } catch {
            return emp;
          }
        })
      );

      setEmployees(updatedEmployees);

    } catch (err) {
      console.error("Failed to load employees", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = employees.filter((emp) => {
    return (
      emp.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(emp.empid)?.includes(searchTerm)
    );
  });

  const downloadXLSX = () => {
    const wsData = employees.map((e) => ({
      EmployeeID: e.empid,
      FullName: e.fullName,
      Email: e.email,
      Designation: e.designation,
      Domain: e.domain,
      BaseSalary: e.baseSalary
    }));

    const worksheet = XLSX.utils.json_to_sheet(wsData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");

    XLSX.writeFile(workbook, "employees.xlsx");
  };

  // ⭐ Start editing
  const startEditing = (emp: User) => {
    setEditingId(emp.id);
    setEditForm({
      fullName: emp.fullName,
      email: emp.email,
      designation: emp.designation,
      domain: emp.domain,
      baseSalary: String(emp.baseSalary)
    });
  };

  // ⭐ Save edit
  // ⭐ Save edit (HR Update)
  const saveEdit = async (id: number) => {
    try {
      await API.put(`/user/hr/update/${id}`, editForm);

      toast.success("Employee updated successfully");

      setEditingId(null);
      loadEmployees();
    } catch (err) {
      toast.error("Update failed. Try again!");
    }
  };


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            All Employees
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and view all employee information
          </p>
        </div>

        <button
          onClick={() => downloadXLSX()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
        >
          <Download className="w-4 h-4" />
          Download Employees
        </button>
      </div>

      <Card glassmorphism>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Employee Directory</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading employees...</div>
          ) : filteredEmployees.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No employees found</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredEmployees.map((employee, index) => (
                <motion.div
                  key={employee.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
                >

                  {/* ⭐ HR EDIT ICON */}
                  {user?.role === "hr" && editingId !== employee.id && (
                    <button
                      onClick={() => startEditing(employee)}
                      className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                      <Pencil className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    </button>
                  )}

                  {/* ⭐ Inline Edit Form */}
                  {editingId === employee.id ? (
                    <div className="space-y-3">

                      <Input
                        label="Full Name"
                        value={editForm.fullName}
                        onChange={(e) =>
                          setEditForm({ ...editForm, fullName: e.target.value })
                        }
                      />

                      <Input
                        label="Email"
                        value={editForm.email}
                        onChange={(e) =>
                          setEditForm({ ...editForm, email: e.target.value })
                        }
                      />

                      <Input
                        label="Designation"
                        value={editForm.designation}
                        onChange={(e) =>
                          setEditForm({ ...editForm, designation: e.target.value })
                        }
                      />

                      <Input
                        label="Domain"
                        value={editForm.domain}
                        onChange={(e) =>
                          setEditForm({ ...editForm, domain: e.target.value })
                        }
                      />

                      <Input
                        label="Salary"
                        type="number"
                        value={editForm.baseSalary}
                        onChange={(e) =>
                          setEditForm({ ...editForm, baseSalary: e.target.value })
                        }
                      />

                      <div className="flex gap-3 mt-3">
                        <button
                          onClick={() => saveEdit(employee.id)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2 hover:bg-green-700 transition"
                        >
                          <Save className="w-4 h-4" />
                          Save
                        </button>

                        <button
                          onClick={() => setEditingId(null)}
                          className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg flex items-center gap-2 hover:bg-gray-400 transition"
                        >
                          <X className="w-4 h-4" />
                          Cancel
                        </button>
                      </div>

                    </div>
                  ) : (
                    <>
                      <div className="flex items-start gap-4">
                        <img
                          src={
                            employee.photoUrl ||
                            `https://api.dicebear.com/7.x/avataaars/svg?seed=${employee.email}`
                          }
                          alt={employee.fullName}
                          className="w-16 h-16 rounded-full ring-4 ring-blue-500/20"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                            {employee.fullName}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            EMP {employee.empid}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Mail className="w-4 h-4" />
                          <span className="truncate">{employee.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Briefcase className="w-4 h-4" />
                          <span>{employee.designation}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Calendar className="w-4 h-4" />
                          <span>{employee.domain}</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500 dark:text-gray-400">
                            Monthly Salary
                          </span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            ₹{employee.baseSalary?.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </>
                  )}

                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
