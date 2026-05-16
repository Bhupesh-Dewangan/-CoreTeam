import LoginLeftSide from "../Components/LoginLeftSide";
import { ShieldIcon, UserIcon, ArrowRightIcon } from "lucide-react";

import { Link } from "react-router-dom";
import { useAuth } from "../context/authContext";
import Loading from "../Components/Loading";
import { Navigate } from "react-router-dom";

function LoginLoading() {

  const { user, loading } = useAuth();
  if (loading) return <Loading />;
  if (user) return <Navigate to="/" />;

  const portalOptions = [
    {
      to: "/login/admin",
      title: "Admin Portal",
      discription:
        "Manage employees, departments, attendance, leave, payroll  and system configurations with ease",
      icon: ShieldIcon,
    },
    {
      to: "/login/employee",
      title: "Employee Portal",
      discription:
        "Access your personal information, view attendance records, apply for leave, and check payslips securely",
      icon: UserIcon,
    },
  ];
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <LoginLeftSide />
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 lg:p-16 relative overflow-y-auto min-h-screen bg-white dark:bg-slate-950">
        <div className="w-full max-w-md animate-fade-in relative z-10">
          {/* Header */}
          <div className="mb-10 text-center md-text-left">
            <h2 className="text-3xl font-semibold text-slate-900 dark:text-white tracking-tight">
              Welcome Back
            </h2>
            <p className="text-slate-900 dark:text-white">Select your portal to securely access the system</p>
          </div>

          {/* Portal Options */}
          <div className="space-y-6">
            {portalOptions.map((portal) => {
              const Icon = portal.icon;
              return (
              <Link
                key={portal.to}
                to={portal.to}
                className="group block bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-5 sm:p-6 transition-all duration-300 hover:border-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10"
              >
                <div className="relative z-10 flex items-center justify-between gap-4 sm:gap-5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-brand-100 dark:bg-brand-500/15 text-brand-600 dark:text-brand-400 group-hover:bg-brand-500 group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-slate-800 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                        {portal.title}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{portal.discription}</p>
                    </div>
                  </div>
                  <ArrowRightIcon className="w-5 h-5 text-slate-400 group-hover:text-brand-500 shrink-0 transition-all duration-300 group-hover:translate-x-0.5" />
                </div>
              </Link>
            );
            })}
          </div>

          {/* Footer */}
          <div className="mt-12 text-center md:text-left text-sm text-slate-400">
            <p>© {new Date().getFullYear()} CoreTeam. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginLoading;
