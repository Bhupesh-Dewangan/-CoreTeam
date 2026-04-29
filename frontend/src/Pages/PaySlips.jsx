import { useCallback, useEffect, useState } from "react"
import Loading from "../Components/Loading";
import PaySlipList from "../Components/PaySlips/PaySlipList";
import GeneratePaySlipForm from "../Components/PaySlips/GeneratePaySlipForm";
import axiosInstance from "../api/axios";
import { useAuth } from "../context/authContext";
import { toast } from "react-toastify";

function PaySlips() {
  const [payslips, setPayslips] = useState([])
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const isAdmin = user?.role === "Admin";

  const fetchPayslips = useCallback(async () => {
    try {
      const res = await axiosInstance.get('/payslips')
      setPayslips(res.data.data || [])
    } catch (error) {
      toast.error(error?.response?.data?.error || error?.message);
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPayslips();
  }, [fetchPayslips]);

  useEffect(() => {
    if (isAdmin) axiosInstance.get('/employees').then(res => setEmployees(res.data.filter((e) => !e.isDeleted))).catch(err => toast.error(err?.response?.data?.error || err?.message))
  }, [isAdmin])

  if (loading) return <Loading />

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="page-title">Payslips</h1>
          <p className="page-subtitle">{isAdmin ? "Generate and manage employee payslips" : "Your payslip history"}</p>
        </div>
        {isAdmin && <GeneratePaySlipForm employees={employees} onSuccess={fetchPayslips} />}
      </div>
      <PaySlipList payslips={payslips} isAdmin={isAdmin} />
    </div>
  )
}

export default PaySlips