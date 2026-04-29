import { useState } from "react";
import { useEffect } from "react";
import Loading from "../Components/Loading";
import EmployeeDashboard from "../Components/EmployeeDashboard";
import AdminDashboard from "../Components/AdminDashboard";
import axiosInstance from "../api/axios.js";
import { toast } from "react-toastify";

function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get("/dashboard")
      .then((res) => {
        // Backend response shape:
        // { success: true, data: { role, ...counts } }
        setData(res.data?.data || null);
      })
      .catch((err) => {
        toast.error(
          err.response?.data?.error || err.message || "Failed to load dashboard data"
        );
      })
      .finally(() => {
      setLoading(false);
      });
  }, []);


  if (loading) {
    return <Loading />;
  }

  if (!data) {
    return (
      <p className="text-center text-slate-500 py-12">
        Failed to load dashboard data
      </p>
    );
  }

  if (data.role === "Admin") {
    return <AdminDashboard data={data} />;
  } else {
    return <EmployeeDashboard data={data} />;
  }
}

export default Dashboard;
