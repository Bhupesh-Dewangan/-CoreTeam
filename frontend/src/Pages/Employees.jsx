import { Plus, SearchIcon, X } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react'
import EmployeeCard from '../Components/EmployeeCard';
import EmployeeForm from '../Components/EmployeeForm';
import axiosInstance from '../api/axios';
import { toast } from 'react-toastify';
import Loading from '../Components/Loading'
import { DEPARTMENTS } from '../assets/dummyData';


function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [editEmployee, setEditEmployee] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);


  const fetchData = useCallback(async () => {
    try {
      const url = selectedDepartment ? `/employees?department=${selectedDepartment}` : `/employees`;
      setLoading(true);
      const res = await axiosInstance.get(url);
      setEmployees(res.data);
    } catch (error) {
      console.log(error);
      toast.error("Error fetching data");
    } finally {
      setLoading(false);
    }

  }, [selectedDepartment]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredEmployees = employees.filter((employee) => `${employee.firstName} ${employee.lastName} ${employee.position}`.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className='animate-fade-in'>

      {/* -----------header--------- */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="page-title">Employees</h1>
          <p className="page-subtitle">
            Manage your team members </p>
        </div>

        <button className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center"
          onClick={() => setShowCreateModal(true)}>
          <Plus size={16} />
          <span>Add Employee</span>
        </button>

      </div>

      {/* -----------search bar--------- */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className='relative flex-1'>
          <SearchIcon className="absolute left-3.5 top-3 text-slate-400 transform w-4 h-4" />
          <input type="text" placeholder='Search employee...' className='pl-10 w-full' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <select className="max-w-40" value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)}>
          <option value="">All Departments</option>
          {DEPARTMENTS.map((department) => (
            <option key={department} value={department}>
              {department}
            </option>
          ))}
        </select>
      </div>

      {/* ----------- employee cards--------- */}
      {loading ? (
        <div className='flex justify-center py-12'>
          <div className='animate-spin rounded-full border-2 border-t-transparent border-indigo-600 w-12 h-12 mx-auto' />
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6' >
          {
            filteredEmployees.length === 0 ? (
              <div className='col-span-full text-center py-16 text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200'>
                No employees found
              </div>
            ) : (
              filteredEmployees.map((employee) => (
                <EmployeeCard key={employee.id} employee={employee} onDelete={fetchData} onEdit={(e) => setEditEmployee(e)} />
              ))
            )
          }
        </div>
      )}

      {/* ----------- Create Employee Model ----------- */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-auto"
          onClick={() => setShowCreateModal(false)}>
          <div className='fixed inset-0' />
          <div className='relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8 animate-fade-in'
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 pb-0">
              <div>
                <h2 className='text-lg font-semibold text-slate-900'>Add New Employee</h2>
                <p className='text-slate-500 text-sm mt-0.5'>Create a user account and employee profile</p>
              </div>
              <button onClick={() => setShowCreateModal(false)} className='p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600'>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className='p-6'>
              <EmployeeForm
                onSuccess={() => {
                  fetchData()
                  setShowCreateModal(false)
                }}
                onCancel={() => setShowCreateModal(false)} />

            </div>

          </div>

        </div>
      )}

      {/* Edit Employee Model  */}
      {editEmployee && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto"
          onClick={() => setEditEmployee(null)}>

          <div className='relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8 animate-fade-in'
            onClick={(e) => e.stopPropagation()}>
            <div className='flex items-center justify-between p-6 pb-0'>
              <div>
                <h2 className='text-lg font-semibold text-slate-900'>Edit Employee</h2>
                <p className='text-slate-500 text-sm mt-0.5'>Update employee information</p>
              </div>
              <button onClick={() => setEditEmployee(null)} className='p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600'>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className='p-6'>
              <EmployeeForm
                initialData={editEmployee}
                onSuccess={() => {
                  fetchData()
                  setEditEmployee(null)
                }}
                onCancel={() => setEditEmployee(null)} />
            </div>

          </div>
        </div>

      )}

    </div>

  )
}

export default Employees