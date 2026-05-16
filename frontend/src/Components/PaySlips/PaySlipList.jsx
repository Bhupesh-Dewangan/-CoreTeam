import { Download } from 'lucide-react'
import { format } from 'date-fns'


function PaySlipList({ payslips, isAdmin }) {
    return (
        <div className='overflow-x-auto'>
            <table className='table-modern'>
                <thead>
                    <tr>
                        {isAdmin && <th>Employee</th>}
                        <th>Period</th>
                        <th>Basic Salary</th>
                        <th>Net Salary</th>
                        <th className='text-center'>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {payslips.length === 0 ? (
                        <tr>
                            <td colSpan={isAdmin ? 5 : 4}
                                className='py-16 text-center text-slate-400 dark:text-slate-500'>
                                No payslips found
                            </td>
                        </tr>
                    ) : (
                        payslips.map((payslip) => (
                            <tr key={payslip._id || payslip.id}>
                                {isAdmin && (
                                    <td className='font-medium text-slate-900 dark:text-slate-100'>
                                        {payslip.employee?.firstName} {payslip.employee?.lastName}
                                    </td>
                                )}
                                <td>
                                    {format(new Date(payslip.year, payslip.month - 1), 'MMMM yyyy')}
                                </td>
                                <td>
                                    <span>&#8377;</span>{payslip.basicSalary?.toLocaleString()}
                                </td>
                                <td className='font-semibold text-slate-900 dark:text-slate-100'>
                                    <span>&#8377;</span>{payslip.netSalary?.toLocaleString()}
                                </td>
                                <td className='text-center'>
                                    <button
                                        onClick={() => window.open(`/print/payslip/${payslip._id || payslip.id}`)}
                                        className='inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-500/10 hover:bg-brand-100 dark:hover:bg-brand-500/20 transition-colors ring-1 ring-brand-500/20'
                                    >
                                        <Download className='w-3 h-3 mr-1.5' />
                                        Download
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default PaySlipList
