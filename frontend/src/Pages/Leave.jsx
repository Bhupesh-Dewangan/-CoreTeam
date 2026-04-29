import React, { useState, useEffect } from 'react'
import Loading from '../Components/Loading';
import { useCallback } from 'react';
import { PlusIcon, ThermometerIcon, UmbrellaIcon, PalmtreeIcon } from 'lucide-react';
import LeaveHistory from '../Components/Leave/LeaveHistory';
import ApplyLeaveModel from '../Components/Leave/ApplyLeaveModel';
import axiosInstance from '../api/axios';
import { useAuth } from '../context/authContext';
import { toast } from 'react-toastify';

function Leave() {

  const { user } = useAuth();

  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const isAdmin = user?.role === 'Admin';

  const fetchLeaves = useCallback(async () => {
    try {
      const res = await axiosInstance.get('/leaves');
      const data = res.data;
      setLeaves(data);
      if (res.data.employee?.isDeleted) {
        setIsDeleted(true);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || error.message || "Failed to load leave data");
    }
    finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]);

  if (loading) return <Loading />

  const approvedLeaves = leaves.filter((l) => l.status === 'APPROVED');
  const sickCount = leaves.filter((l) => l.status === 'SICK').length;
  const casualCount = leaves.filter((l) => l.status === 'CASUAL').length;
  const annualCount = leaves.filter((l) => l.status === 'ANNUAL').length;

  const leaveStats = [
    { label: 'Sick Leave', value: sickCount, icon: ThermometerIcon },
    { label: 'Casual Leave', value: casualCount, icon: UmbrellaIcon },
    { label: 'Annual Leave', value: annualCount, icon: PalmtreeIcon },
  ];

  return (
    <div className='animate-fade-in'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8'>
        <div>
          <h1 className='page-title'>Leave Management</h1>
          <p className='page-subtitle'>{isAdmin ? "Manage leave applications" : "Track your leave history and submit leave requests"}</p>
        </div>
        {!isAdmin && !isDeleted && (
          <button onClick={() => setShowModal(true)}
            className='btn-primary flex items-center gap-2 w-full sm:w-auto justify-center'>
            <PlusIcon className='w-4 h-4' /> Apply for Leave
          </button>
        )}
      </div>
      {!isAdmin && (
        <div className='grid grid-cols-1 md:grid-cols-3 sm:gap-5 gap-4 mb-8'>
          {leaveStats.map((stat) => (
            <div key={stat.label} className='card card-hover p-5 sm:p-6 flex items-center gap-4 relative overflow-hidden group'>
              <div className='absolute top-0 left-0 bottom-0 w-1 roundeed-r-full bg-slate-500/70 group-hover:bg-indigo-500/70' />
              <div className='p-3 bg-slate-100 rounded-lg group-hover:bg-indigo-50 transition-colors duration-200'>
                <stat.icon className='w-5 h-5 text-slate-500 group-hover:text-indigo-600 transition-colors duration-200' />
              </div>
              <div>
                <p className='text-sm text-slate-500'>{stat.label}</p>
                <p className='text-2xl font-bold text-slate-900 tracking-tight'>{stat.value} <span className='text-sm font-normal text-slate-400'>taken</span></p>
              </div>
            </div>
          ))}
        </div>
      )}
      <LeaveHistory leaves={leaves} isAdmin={isAdmin} onUpdate={fetchLeaves} />
      <ApplyLeaveModel open={showModal} onClose={() => setShowModal(false)} onSuccess={fetchLeaves} />
    </div>
  )
}

export default Leave