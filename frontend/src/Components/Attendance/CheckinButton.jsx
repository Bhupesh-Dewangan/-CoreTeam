import { Loader2Icon, LogInIcon, LogOutIcon, CheckCircle2 } from 'lucide-react'
import { useState } from 'react';
import { format } from 'date-fns';
import axiosInstance from '../../api/axios';
import { toast } from 'react-toastify';


function CheckinButton({ todayRecord, onAction }) {
    const [loading, setLoading] = useState(false)

    const handleAttendance = async () => {
        setLoading(true)
        try {
            await axiosInstance.post("/attendance")
            onAction()
        } catch (error) {
            toast.error(error?.response?.data?.error || error?.message);
        } finally {
            setLoading(false);
        }
    }

    const isCheckedIn = !!todayRecord?.checkIn;
    const isComplete = !!todayRecord?.checkOut;
    const now = format(new Date(), "hh:mm a");

    if (isComplete) {
        return (
            <div className="card p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 border-brand-200 dark:border-brand-800/50 bg-brand-50/50 dark:bg-brand-500/5">
                <div className="flex items-center gap-4 text-center sm:text-left">
                    <div className="p-4 rounded-2xl bg-brand-500 text-white">
                        <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Work day completed</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Great job today — see you tomorrow!</p>
                    </div>
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                    {todayRecord.checkIn && (
                        <p>Checked in: {format(new Date(todayRecord.checkIn), "hh:mm a")}</p>
                    )}
                    {todayRecord.checkOut && (
                        <p>Checked out: {format(new Date(todayRecord.checkOut), "hh:mm a")}</p>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className="card overflow-hidden">
            <div className="p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-brand-600 dark:text-brand-400 mb-2">
                        Today · {format(new Date(), "EEEE, MMM d")}
                    </p>
                    <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-slate-50">
                        {isCheckedIn ? "You're on the clock" : "Ready to start your day?"}
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-md">
                        {isCheckedIn
                            ? "Don't forget to clock out when you finish your shift."
                            : "Tap the button to record your check-in time."}
                    </p>
                    <p className="text-sm text-slate-400 mt-4">Current time: {now}</p>
                    {isCheckedIn && todayRecord.checkIn && (
                        <p className="text-sm text-brand-600 dark:text-brand-400 mt-1 font-medium">
                            Checked in at {format(new Date(todayRecord.checkIn), "hh:mm a")}
                        </p>
                    )}
                </div>

                <button
                    onClick={handleAttendance}
                    disabled={loading}
                    className={`flex items-center justify-center gap-4 px-8 py-5 rounded-2xl text-white font-medium text-lg shadow-lg transition-all active:scale-[0.98] min-w-[220px] ${
                        isCheckedIn
                            ? "bg-slate-700 hover:bg-slate-800"
                            : "bg-brand-500 hover:bg-brand-600 shadow-brand-500/25"
                    }`}
                >
                    {loading ? (
                        <Loader2Icon className="size-8 animate-spin" />
                    ) : isCheckedIn ? (
                        <LogOutIcon className="size-8" />
                    ) : (
                        <LogInIcon className="size-8" />
                    )}
                    <div className="text-left">
                        <span className="block">{loading ? "Processing…" : isCheckedIn ? "Clock out" : "Clock in"}</span>
                        <span className="block text-xs font-normal opacity-80 mt-0.5">
                            {isCheckedIn ? "End your shift" : "Start your shift"}
                        </span>
                    </div>
                </button>
            </div>
        </div>
    )
}

export default CheckinButton;
