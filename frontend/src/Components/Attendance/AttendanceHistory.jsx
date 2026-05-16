import React from 'react'
import { getDayTypeDisplay, getWorkingHoursDisplay } from '../../assets/dummyData'
import { format } from 'date-fns'

function AttendanceHistory({ history }) {
    return (
        <div className='overflow-x-auto'>
            <table className='table-modern'>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Check In</th>
                        <th>Check Out</th>
                        <th>Working Hours</th>
                        <th>Day Type</th>
                        <th>Status</th>
                    </tr>
                </thead>

                <tbody>
                    {history.length === 0 ? (
                        <tr>
                            <td colSpan="6" className='py-16 text-center text-slate-500 dark:text-slate-400'>
                                No attendance records found
                            </td>
                        </tr>
                    ) : (
                        history.map((record) => {
                            const dayType = getDayTypeDisplay(record)
                            return (
                                <tr key={record._id || record.id}>
                                    <td className='font-medium text-slate-900 dark:text-slate-100'>
                                        {format(new Date(record.date), 'MMM dd, yyyy')}
                                    </td>
                                    <td>
                                        {record.checkIn
                                            ? format(new Date(record.checkIn), 'hh:mm a')
                                            : '-'}
                                    </td>
                                    <td>
                                        {record.checkOut
                                            ? format(new Date(record.checkOut), 'hh:mm a')
                                            : '-'}
                                    </td>
                                    <td className='font-medium'>
                                        {getWorkingHoursDisplay(record)}
                                    </td>
                                    <td>
                                        {dayType.label !== "-"
                                            ? <span className={`badge ${dayType.className}`}>{dayType.label}</span>
                                            : "-"}
                                    </td>
                                    <td>
                                        <span className={`badge ${record.status === 'Present' ? 'badge-success' : record.status === 'Late' ? 'badge-warning' : 'badge-danger'}`}>
                                            {record.status}
                                        </span>
                                    </td>
                                </tr>
                            )
                        })
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default AttendanceHistory
