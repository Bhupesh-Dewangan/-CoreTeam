import Sidebar from "../Components/Sidebar";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import Loading from "../Components/Loading";


function Layout() {
  const { user, loading } = useAuth();
  if (loading) return <Loading />;
  if (!user) return <Navigate to="/login" />;
  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="w-full max-w-[1440px] mx-auto p-4 pt-16 sm:pt-6 lg:p-8 xl:px-10">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default Layout
