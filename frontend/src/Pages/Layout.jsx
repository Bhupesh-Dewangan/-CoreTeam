import Sidebar from "../Components/Sidebar";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import Loading from "../Components/Loading";


function Layout() {
  const { user, loading } = useAuth();
  if (loading) return <Loading />;
  if (!user) return <Navigate to="/login" />;
  return (
    <div className="flex h-screen bg-linear-to-bg from-slate-50 via-white to-indigo-50/30">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-400 mx-auto p-4 pt-16 sm:pt-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default Layout