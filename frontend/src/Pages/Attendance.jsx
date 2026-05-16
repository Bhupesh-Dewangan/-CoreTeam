import React, { useCallback, useEffect } from 'react'
import { useState } from 'react'
import Loading from '../Components/Loading'
import CheckinButton from '../Components/Attendance/CheckinButton'
import AttendanceStats from '../Components/Attendance/AttendanceStats'
import AttendanceHistory from '../Components/Attendance/AttendanceHistory'
import PageHero from '../Components/layout/PageHero'
import SectionCard from '../Components/layout/SectionCard'
import axiosInstance from '../api/axios'
import { toast } from 'react-toastify'
import { CalendarClock } from 'lucide-react'


function Attendance() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [isDeleted, setIsDeleted] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      const res = await axiosInstance.get('/attendance')
      setHistory(res.data.data)
      if (res.data.employee?.isDeleted) {
        setIsDeleted(true)
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to fetch attendance data")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  if (loading) return <Loading />

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const todayRecord = history.find((r) => new Date(r.date).toDateString() === today.toDateString())

  return (
    <div className='animate-fade-in'>
      <PageHero
        icon={CalendarClock}
        title="Attendance"
        subtitle="Track your work hours, check in daily, and review your attendance history."
      />

      {isDeleted ? (
        <div className='mb-8 p-6 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-800 rounded-2xl text-center'>
          <p className='text-rose-700 dark:text-rose-400 font-medium'>You can no longer clock in or out because your employee records have been marked as deleted.</p>
        </div>
      ) : (
        <div className='mb-8'>
          <CheckinButton todayRecord={todayRecord} onAction={fetchData} />
        </div>
      )}

      <AttendanceStats history={history} />

      <SectionCard
        title="Recent activity"
        description={`${history.length} attendance record${history.length !== 1 ? "s" : ""}`}
        className="mt-6"
      >
        <AttendanceHistory history={history} />
      </SectionCard>
    </div>
  )
}

export default Attendance
