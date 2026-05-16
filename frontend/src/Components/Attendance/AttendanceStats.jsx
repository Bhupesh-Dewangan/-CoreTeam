import { AlertCircleIcon, ClockIcon, CalendarIcon } from 'lucide-react';


function AttendanceStats({ history }) {
    // Backend returns status values as "Present" and "Late"
    const totalPresent = history.filter(
        (h) => h.status === "Present" || h.status === "Late"
    ).length;
    const totalLate = history.filter((h) => h.status === "Late").length;
    const stats = [
        { label: "Total Present", value: totalPresent, icon: CalendarIcon },
        { label: "Late Arrivals", value: totalLate, icon: AlertCircleIcon },
        { label: "Avg. Work Hrs", value: "8.5 Hrs", icon: ClockIcon },
    ]
    return (
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-8'>
            {stats.map((s) => (
                <div key={s.label} className='card card-hover p-5 sm:p-6 flex items-center gap-4 relative overflow-hidden group'>
                    <div className="stat-accent" />
                    <div className="stat-icon-wrap">
                        <s.icon className="stat-icon" />
                    </div>
                    <div className='flex-1'>
                        <p className="text-sm text-slate-500">{s.label}</p>
                        <p className="text-2xl font-medium text-slate-900 dark:text-slate-50 tracking-tight">{s.value}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default AttendanceStats