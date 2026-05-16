import React, { useState, useEffect } from 'react'
import Loading from '../Components/Loading';
import { useCallback } from 'react';
import { PlusIcon, ThermometerIcon, UmbrellaIcon, PalmtreeIcon, CalendarDays } from 'lucide-react';
import LeaveHistory from '../Components/Leave/LeaveHistory';
import ApplyLeaveModel from '../Components/Leave/ApplyLeaveModel';
import PageHero from '../Components/layout/PageHero';
import SectionCard from '../Components/layout/SectionCard';
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
      const res = await axiosInstance.get('/leave');
      setLeaves(res.data.data || []);
      if (res.data.employee?.isDeleted) {
        setIsDeleted(true);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || error.message || "Failed to load leave data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]);

  if (loading) return <Loading />

  const sickCount = leaves.filter((l) => l.type === 'SICK').length;
  const casualCount = leaves.filter((l) => l.type === 'CASUAL').length;
  const annualCount = leaves.filter((l) => l.type === 'ANNUAL').length;
  const pendingCount = leaves.filter((l) => l.status === 'Pending').length;

  const leaveStats = [
    { label: 'Sick Leave', value: sickCount, icon: ThermometerIcon },
    { label: 'Casual Leave', value: casualCount, icon: UmbrellaIcon },
    { label: 'Annual Leave', value: annualCount, icon: PalmtreeIcon },
  ];

  return (
    <div className='animate-fade-in'>
      <PageHero
        icon={CalendarDays}
        title="Leave Management"
        badge={isAdmin ? `${pendingCount} pending` : undefined}
        subtitle={isAdmin ? "Review, approve, or reject team leave applications." : "Track your leave history and submit new requests."}
      >
        {!isAdmin && !isDeleted && (
          <button onClick={() => setShowModal(true)} className='btn-primary flex items-center gap-2 justify-center'>
            <PlusIcon className='w-4 h-4' /> Apply for Leave
          </button>
        )}
      </PageHero>

      {!isAdmin && (
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 mb-8'>
          {leaveStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className='card card-hover p-5 sm:p-6 flex items-center gap-4 relative overflow-hidden group'>
                <div className="stat-accent" />
                <div className="stat-icon-wrap">
                  <Icon className="stat-icon" />
                </div>
                <div>
                  <p className='text-sm text-slate-500 dark:text-slate-400'>{stat.label}</p>
                  <p className='text-2xl font-bold text-slate-900 dark:text-slate-50 tracking-tight'>
                    {stat.value} <span className='text-sm font-normal text-slate-400'>taken</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {isAdmin && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="summary-pill">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Total requests</p>
              <p className="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-0.5">{leaves.length}</p>
            </div>
          </div>
          <div className="summary-pill">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Pending</p>
              <p className="text-lg font-semibold text-amber-600 dark:text-amber-400 mt-0.5">{pendingCount}</p>
            </div>
          </div>
          <div className="summary-pill">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Approved</p>
              <p className="text-lg font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
                {leaves.filter((l) => l.status === 'Approved').length}
              </p>
            </div>
          </div>
          <div className="summary-pill">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Rejected</p>
              <p className="text-lg font-semibold text-rose-600 dark:text-rose-400 mt-0.5">
                {leaves.filter((l) => l.status === 'Rejected').length}
              </p>
            </div>
          </div>
        </div>
      )}

      <SectionCard
        title={isAdmin ? "All leave applications" : "Your leave history"}
        description={`${leaves.length} record${leaves.length !== 1 ? "s" : ""} on file`}
      >
        <LeaveHistory leaves={leaves} isAdmin={isAdmin} onUpdate={fetchLeaves} />
      </SectionCard>

      <ApplyLeaveModel open={showModal} onClose={() => setShowModal(false)} onSuccess={fetchLeaves} />
    </div>
  )
}

export default Leave
