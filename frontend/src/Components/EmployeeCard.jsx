import { PencilIcon, Trash2Icon } from 'lucide-react'
import axiosInstance from '../api/axios';
import { toast } from 'react-toastify';

function EmployeeCard({ employee, onDelete, onEdit }) {
    const handleDelete = async () => {
        if (!confirm(`Are you sure you want to delete ${employee.firstName} ${employee.lastName}`)) {
            return;
        }
        try {
            await axiosInstance.delete(`/employees/${employee.id}`);
            onDelete();
            toast.success('Employee deleted successfully');
        } catch (err) {
            toast.error(err?.response?.data?.error || 'Failed to delete employee');
        }
    }

    return (
        <div className='group relative card card-hover overflow-hidden'>
            <div className='relative aspect-4/3 w-full overflow-hidden bg-slate-100 dark:bg-slate-800'>
                <div className='w-full h-full flex items-center justify-center'>
                    <div className='w-20 h-20 rounded-full bg-brand-100 dark:bg-brand-500/20 flex items-center justify-center'>
                        <span className="text-xl font-semibold text-brand-700 dark:text-brand-300">
                            {employee.firstName.charAt(0)}{employee.lastName.charAt(0)}
                        </span>
                    </div>
                </div>
            </div>

            <div className='absolute top-1 left-0 m-2 flex gap-2'>
                <span className='bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm px-2.5 py-1 text-xs font-semibold text-slate-600 dark:text-slate-300 rounded-lg shadow-sm'>
                    {employee.department || "Remote"}
                </span>

                {employee.isDeleted && (
                    <span className='bg-rose-500 font-medium text-white px-2.5 py-1 text-xs rounded-lg'>
                        DELETED
                    </span>
                )}
            </div>

            {!employee.isDeleted && (
                <div className='absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/5 dark:group-hover:bg-black/20 transition-colors flex items-end justify-end pb-6 gap-2.5 px-2.5 opacity-0 group-hover:opacity-100'>
                    <button onClick={() => onEdit(employee)} className='p-2.5 bg-white dark:bg-slate-800 rounded-xl hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-all text-slate-700 dark:text-slate-200 hover:text-brand-600 shadow-lg hover:scale-105'>
                        <PencilIcon className='w-4 h-4' />
                    </button>
                    <button onClick={handleDelete} className='p-2.5 bg-white dark:bg-slate-800 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all text-slate-700 dark:text-slate-200 hover:text-rose-600 shadow-lg hover:scale-105 disabled:opacity-50'>
                        <Trash2Icon className='w-4 h-4' />
                    </button>
                </div>
            )}

            <div className='p-5'>
                <h3 className='text-slate-900 dark:text-slate-100 font-medium'>{employee.firstName} {employee.lastName}</h3>
                <p className='text-xs text-slate-500 dark:text-slate-400 mt-0.5'>{employee.position}</p>
            </div>
        </div>
    )
}

export default EmployeeCard
