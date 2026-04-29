import { CalendarDays, X, FileText, AlignJustify, Loader2, Send } from 'lucide-react';
import React, { useState } from 'react'
import axiosInstance from '../../api/axios';
import { toast } from 'react-toastify';

function ApplyLeaveModel({ open, onClose, onSuccess }) {

    const [loading, setLoading] = useState(false);


    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const minDate = tomorrow.toISOString().split('T')[0];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        const formData = new FormData(e.currentTarget)
        const data = Object.fromEntries(formData.entries())

        try {
            await axiosInstance.post('/leave/apply', data)
            onSuccess();
            onClose();
        } catch (err) {
            toast.error(
                err.response?.data?.error ||
                err.response?.data?.message ||
                "Failed to apply for leave"
            )
        }
    }

    if (!open) return null;

    return (
        <div className='fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm'
            onClick={onClose}>
            <div className='relative bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-fade-in' onClick={(e) => e.stopPropagation()}>
                {/* ------------ header ------------ */}
                <div className='flex items-center justify-between p-6 pb-0'>
                    <div>
                        <h2 className='text-1g font-semibold text-slate-800'>Apply for Leave</h2>
                        <p className='text-sm text-slate-400 mt-0.5'>Submit your leave request for approval</p>
                    </div>
                    <button onClick={onClose} className='p-2 rounded-1g hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600' >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* ------------ form ------------ */}
                <form onSubmit={handleSubmit} className='p-6 space-y-5'>
                    {/* ------------ leave type ------------ */}
                    <div>
                        <label className='text-sm font-medium text-slate-700 mb-2 flex items-center gap-2'>
                            <FileText className='w-4 h-4 text-slate-400' />
                            Leave Type
                        </label>
                        <select name='type' required >
                            <option value="CASUAL">Casual Leave</option>
                            <option value="SICK">Sick Leave</option>
                            <option value="ANNUAL">Annual Leave</option>
                        </select>
                    </div>

                    {/* --------------- duration --------------- */}
                    <div>
                        <label className='text-sm font-medium text-slate-700 mb-2 flex items-center gap-2'>
                            <CalendarDays className='w-4 h-4 text-slate-400' />
                            Duration
                        </label>
                        <div className='grid grid-cols-2 gap-4'>
                            <div className='relative'>
                                <span className='text-xs text-slate-400 mb-1 block'>From</span>
                                <input type="date" name="startDate" min={minDate} required placeholder='Start Date' />
                            </div>
                            <div className='relative'>
                                <span className='text-xs text-slate-400 mb-1 block'>To</span>
                                <input type="date" name="endDate" min={minDate} required placeholder='End Date' />
                            </div>

                        </div>

                    </div>

                    {/* ------------ Reason ----------  */}
                    <div>
                        <label className='text-sm font-medium text-slate-700 mb-2 flex items-center gap-2'>
                            <AlignJustify className='w-4 h-4 text-slate-400' />
                            Reason
                        </label>
                        <textarea name='reason' rows={4} required placeholder='Briefly describe why you need this leave...' className='resize-none' />
                    </div>

                    {/* --------- Button ---------- */}
                    <div className='flex justify-end gap-3 pt-2'>
                        <button type='button' disabled={loading} className='btn-secondary'>Cancel</button>
                        <button type='submit' disabled={loading} className='btn-primary flex'>{loading ? <Loader2 className='w-4 h-4 animate-spin' /> : <Send className='w-4 h-4' />}{loading ? <span className='ml-2'>Submitting...</span> : <span className='ml-2'>Submit</span>}</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ApplyLeaveModel