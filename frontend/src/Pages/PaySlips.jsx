import { useCallback, useEffect, useState } from "react"
import Loading from "../Components/Loading";
import PaySlipList from "../Components/PaySlips/PaySlipList";
import GeneratePaySlipForm from "../Components/PaySlips/GeneratePaySlipForm";
import PageHero from "../Components/layout/PageHero";
import SummaryPill from "../Components/layout/SummaryPill";
import SectionCard from "../Components/layout/SectionCard";
import axiosInstance from "../api/axios";
import { useAuth } from "../context/authContext";
import { toast } from "react-toastify";
import { Receipt, Wallet } from "lucide-react";
import { format } from "date-fns";

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

  const latest = payslips[0];
  const totalNet = payslips.reduce((sum, p) => sum + (p.netSalary || 0), 0);

  return (
    <div className="animate-fade-in">
      <PageHero
        icon={Receipt}
        title="Payslips"
        subtitle={isAdmin ? "Generate payslips for your team and manage payroll records." : "View and download your salary statements anytime."}
      >
        {isAdmin && <GeneratePaySlipForm employees={employees} onSuccess={fetchPayslips} />}
      </PageHero>

      <div className="flex flex-wrap gap-3 mb-6">
        <SummaryPill icon={Receipt} label="Total records" value={payslips.length} />
        {latest && (
          <SummaryPill
            label="Latest period"
            value={format(new Date(latest.year, latest.month - 1), "MMM yyyy")}
          />
        )}
        {payslips.length > 0 && (
          <SummaryPill icon={Wallet} label="Combined net (listed)" value={`₹${totalNet.toLocaleString()}`} />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {isAdmin && (
          <div className="info-panel lg:col-span-1 order-2 lg:order-1">
            <h3 className="info-panel-title">Payroll tips</h3>
            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <li className="flex gap-2">
                <span className="text-brand-500">•</span>
                Generate payslips at the end of each month for all active employees.
              </li>
              <li className="flex gap-2">
                <span className="text-brand-500">•</span>
                Employees can download PDF copies from their portal.
              </li>
              <li className="flex gap-2">
                <span className="text-brand-500">•</span>
                Double-check basic salary before confirming generation.
              </li>
            </ul>
          </div>
        )}
        <div className={isAdmin ? "lg:col-span-2 order-1 lg:order-2" : "col-span-full"}>
          <SectionCard
            title={isAdmin ? "All payslips" : "Your payslips"}
            description={`${payslips.length} document${payslips.length !== 1 ? "s" : ""} available`}
          >
            <PaySlipList payslips={payslips} isAdmin={isAdmin} />
          </SectionCard>
        </div>
      </div>
    </div>
  )
}

export default PaySlips
