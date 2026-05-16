import {
  Building2Icon,
  CalendarIcon,
  FileTextIcon,
  UserIcon,
  LayoutGridIcon,
  DollarSignIcon,
  Sparkles,
} from "lucide-react";
import PageHero from "./layout/PageHero";
import QuickLinkCard from "./layout/QuickLinkCard";

function AdminDashboard({ data }) {
  const stats = [
    {
      icon: UserIcon,
      value: data.totalEmployees,
      label: "Total Employees",
      description: "Active workforce",
    },
    {
      icon: Building2Icon,
      value: data.totalDepartments,
      label: "Departments",
      description: "Organization units",
    },
    {
      icon: CalendarIcon,
      value: data.todayAttendance,
      label: "Today's Attendance",
      description: "Checked in today",
    },
    {
      icon: FileTextIcon,
      value: data.pendingLeaves,
      label: "Pending Leaves",
      description: "Awaiting approval",
    },
  ];

  const quickLinks = [
    {
      to: "/employees",
      icon: UserIcon,
      title: "Employees",
      description: "Add, edit, and manage team members",
      count: data.totalEmployees,
    },
    {
      to: "/leave",
      icon: FileTextIcon,
      title: "Leave requests",
      description: "Review and approve pending applications",
      count: data.pendingLeaves,
    },
    {
      to: "/payslips",
      icon: DollarSignIcon,
      title: "Payslips",
      description: "Generate and distribute monthly payslips",
    },
  ];

  return (
    <div className="animate-fade-in">
      <PageHero
        icon={LayoutGridIcon}
        title="Dashboard"
        badge="Admin overview"
        subtitle="Welcome back! Here's a snapshot of your organization and quick access to key areas."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 mb-8">
        {stats.map((s) => (
          <div
            key={s.label}
            className="card card-hover p-5 sm:p-6 relative overflow-hidden group"
          >
            <div className="stat-accent" />
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{s.label}</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-slate-50 mt-2 tabular-nums">
                  {s.value}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{s.description}</p>
              </div>
              <div className="stat-icon-wrap">
                <s.icon className="size-5 stat-icon" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1">
            Quick actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickLinks.map((link) => (
              <QuickLinkCard key={link.to} {...link} />
            ))}
          </div>
        </div>

        <div className="info-panel">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-brand-500" />
            <h3 className="info-panel-title mb-0">Workspace tips</h3>
          </div>
          <ul className="space-y-4 flex-1 text-sm text-slate-600 dark:text-slate-400">
            <li className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-brand-100 dark:bg-brand-500/15 text-brand-600 dark:text-brand-400 text-xs font-bold flex items-center justify-center shrink-0">1</span>
              <span>Review pending leave requests daily to keep teams informed.</span>
            </li>
            <li className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-brand-100 dark:bg-brand-500/15 text-brand-600 dark:text-brand-400 text-xs font-bold flex items-center justify-center shrink-0">2</span>
              <span>Generate payslips at month-end from the Payslips section.</span>
            </li>
            <li className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-brand-100 dark:bg-brand-500/15 text-brand-600 dark:text-brand-400 text-xs font-bold flex items-center justify-center shrink-0">3</span>
              <span>Use department filters on Employees to manage larger teams.</span>
            </li>
          </ul>
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-500">
              {data.todayAttendance} of {data.totalEmployees} employees checked in today
            </p>
            <div className="mt-2 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-brand-500 rounded-full transition-all"
                style={{
                  width: `${data.totalEmployees ? Math.min(100, (data.todayAttendance / data.totalEmployees) * 100) : 0}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
