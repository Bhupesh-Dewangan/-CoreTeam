import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

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


        </form>
    )
}

export default EmployeeForm