import {
  dummyAdminDashboardData,
  dummyEmployeeDashboardData,
} from "../assets/dummyData";
import { useState } from "react";
import { useEffect } from "react";
import Loading from "../Components/Loading";
import EmployeeDashboard from "../Components/EmployeeDashboard";
import AdminDashboard from "../Components/AdminDashboard";

function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // setData(dummyEmployeeDashboardData);
    setData(dummyAdminDashboardData);
    // Simulate fetching data from an API
    setTimeout(() => {
      setLoading(false);
    }, 1000);
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
