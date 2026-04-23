import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { DEPARTMENTS } from '../assets/dummyData';
import { Loader2Icon } from 'lucide-react';

function EmployeeForm({ initialData, onSuccess, onCancel }) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const isEditMode = !!initialData;

    const handleSubmit = async (e) => {
        e.preventDefault();

    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl animated-fade-in">
            {/* Personal Information */}
            <div className="card p-5 sm:p-6">
                <h3 className='font-medium mb-6 pb-4 border-b border-slate-100'>Personal Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm text-slate-700">
                    {/* First Name */}
                    <div>
                        <label htmlFor="firstName" className="block mb-2">First Name</label>
                        <input type="text" id="firstName" required defaultValue={initialData?.firstName || ''} />
                    </div>
                    {/* Last Name */}
                    <div>
                        <label htmlFor="lastName" className="block mb-2">Last Name</label>
                        <input type="text" id="lastName" required defaultValue={initialData?.lastName || ''} />
                    </div>
                    {/* Phone Number  */}
                    <div>
                        <label htmlFor="phoneNumber" className="block mb-2">Phone Number</label>
                        <input type="text" id="phoneNumber" required defaultValue={initialData?.phoneNumber || ''} />
                    </div>
                    {/* Join Date  */}
                    <div>
                        <label htmlFor="joinDate" className="block mb-2">Join Date</label>
                        <input type="date" id="joinDate" required defaultValue={initialData?.joinDate ? new Date(initialData.joinDate).toISOString().split('T')[0] : ''} />
                    </div>
                    {/* Bio */}
                    <div className="sm:col-span-2">
                        <label htmlFor="bio" className="block mb-2">Bio (optional)</label>
                        <textarea id="bio" rows="3" className="resize-none" defaultValue={initialData?.bio || ''} placeholder="Brief description..."></textarea>
                    </div>
                </div>
            </div>

            {/* Employee Information */}
            <div className="card p-5 sm:p-6">
                <h3 className="text-base font-medium text-slate-900 mb-6 pb-4 border-b border-slate-100">
                    Employee Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm text-slate-700">
                    <div>
                        <label className='block mb-2'>Department</label>
                        <select id="department" defaultValue={initialData?.department || ''}>
                            <option value="">Select Department</option>
                            {DEPARTMENTS.map((department) => (
                                <option key={department} value={department}>
                                    {department}
                                </option>
                            ))}

                        </select>
                    </div>

                    <div>
                        <label htmlFor="position" className='block mb-2'>Position</label>
                        <input type="text" id="position" required defaultValue={initialData?.position || ''} />
                    </div>
                    <div>
                        <label htmlFor="basicSalary" className='block mb-2'>Basic Salary</label>
                        <input type="number" id="basicSalary" required min={0} steps={0.01} defaultValue={initialData?.basicSalary || 0} />
                    </div>
                    <div>
                        <label htmlFor="allowances" className='block mb-2'>Allowances</label>
                        <input type="number" id="allowances" required min={0} steps={0.01} defaultValue={initialData?.allowances || 0} />
                    </div>
                    <div>
                        <label htmlFor="deductions" className='block mb-2'>Deductions</label>
                        <input type="number" id="deductions" required min={0} steps={0.01} defaultValue={initialData?.deductions || 0} />
                    </div>
                    {isEditMode && (
                        <div>
                            <label htmlFor="employmentStatus" className='block mb-2'>Status</label>
                            <select id="employmentStatus" required defaultValue={initialData?.employmentStatus}>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>

                    )}
                </div>
            </div>

            {/* Account Setup */}
            <div className="card p-5 sm:p-6">
                <h3 className='text-base font-medium text-slate-900 mb-6 pb-4 border-b border-slate-100'>Account Setup</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm text-slate-700">
                    {/* Username */}
                    <div className='sm:col-span-2'>
                        <label htmlFor="workEmail" className="block mb-2">Work Email</label>
                        <input type="email" id="workEmail" required defaultValue={initialData?.email} />
                    </div>
                    {!isEditMode && (
                        <div>
                            <label htmlFor="password" className="block mb-2">Temporary Password</label>
                            <input type="password" id="password" required />
                        </div>
                    )}
                    {isEditMode && (
                        <div>
                            <label htmlFor="password" className="block mb-2">Change Password (optional)</label>
                            <input type="password" id="password"
                                placeholder='Leave blank to keep current password' />
                        </div>
                    )}
                    <div>
                        <label htmlFor="password" className="block mb-2">System Role</label>
                        <select name="role" id="systemRole" defaultValue={initialData?.role || 'employee'}>
                            <option value="admin">Admin</option>
                            <option value="employee">Employee</option>
                        </select>
                    </div>

                </div>
            </div>


            {/* Button */}
            <div className='flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2 '>
                <button type='button' onClick={() => (onCancel ? onCancel() : navigate(-1))} className='btn-secondary'>Cancel</button>
                <button type='submit' disabled={loading} className='btn-primary flex items-center justify-center'>{loading && <Loader2Icon className='w-4 h-4 mr-2 animate-spin' />}
                    {isEditMode ? 'Update Employee' : 'Create Employee'}
                </button>
            </div>


        </form >
    )
}

export default EmployeeForm