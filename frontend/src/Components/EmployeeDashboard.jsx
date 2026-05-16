import {
  CalendarIcon,
  FileTextIcon,
  DollarSignIcon,
  ArrowRightIcon,
  Clock,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";
import PageHero from "./layout/PageHero";
import QuickLinkCard from "./layout/QuickLinkCard";

function EmployeeDashboard({ data }) {
  const emp = data?.employee || {};

  const cards = [
    {
      icon: CalendarIcon,
      value: data.currentMonthAttendance,
      title: "Days Present",
      subtitle: "This month",
    },
    {
      icon: FileTextIcon,
      value: data.pendingLeaves,
      title: "Pending Leaves",
      subtitle: "Awaiting approval",
    },
    {
      icon: DollarSignIcon,
      value: data.latestPayslip
        ? `\u20B9${data.latestPayslip.netSalary?.toLocaleString()}`
        : "N/A",
      title: "Latest Payslip",
      subtitle: "Most recent payout",
    },
  ];

  const quickLinks = [
    {
      to: "/attendance",
      icon: Clock,
      title: "Mark attendance",
      description: "Clock in or out for today's shift",
    },
    {
      to: "/leave",
      icon: FileTextIcon,
      title: "Apply for leave",
      description: "Submit sick, casual, or annual leave",
    },
    {
      to: "/payslips",
      icon: DollarSignIcon,
      title: "View payslips",
      description: "Download your salary statements",
    },
    {
      to: "/settings",
      icon: User,
      title: "Profile & settings",
      description: "Update bio and account preferences",
    },
  ];

  const subtitle = emp.position
    ? `${emp.position}${emp.department ? ` \u00B7 ${emp.department}` : ""}`
    : "Here's your activity summary and shortcuts for today.";

  return (
    <div className="animate-fade-in">
      <PageHero
        icon={User}
        title={`Welcome back, ${emp.firstName || "Employee"}!`}
        badge={emp.department || "Team member"}
        subtitle={subtitle}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-8">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="card card-hover p-5 sm:p-6 relative overflow-hidden group"
            >
              <div className="stat-accent" />
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{card.title}</p>
                  <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50 mt-2 tabular-nums">
                    {card.value}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{card.subtitle}</p>
                </div>
                <div className="stat-icon-wrap">
                  <Icon className="size-5 stat-icon" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1">
            Quick shortcuts
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickLinks.map((link) => (
              <QuickLinkCard key={link.to} {...link} />
            ))}
          </div>
        </div>

        <div className="info-panel">
          <h3 className="info-panel-title">Get started</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
            Use the shortcuts on the left, or jump straight into your most common tasks below.
          </p>
          <div className="space-y-3 mt-auto">
            <Link
              to="/attendance"
              className="btn-primary w-full inline-flex items-center justify-center gap-2"
            >
              Mark Attendance <ArrowRightIcon className="size-4" />
            </Link>
            <Link
              to="/leave"
              className="btn-secondary w-full inline-flex items-center justify-center gap-2"
            >
              Apply for Leave
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeDashboard;
