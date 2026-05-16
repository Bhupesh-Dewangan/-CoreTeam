import { format } from "date-fns";

function PageHero({ icon: Icon, title, subtitle, children, badge }) {
  const today = format(new Date(), "EEEE, MMMM d, yyyy");

  return (
    <div className="page-hero mb-8">
      <div className="page-hero-pattern" aria-hidden="true" />
      <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="flex items-center gcentermin-w60 gap-5">
          {Icon && (
            <div className="page-hero-icon shrink-0">
              <Icon className="w-8 h-8" />
            </div>
          )}
          <div className="min-w-0">

            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white tracking-tight inline-block">
                {title}
              </h1>

              {badge && (
                <span className="inline-block text-xs font-medium text-brand-700 dark:text-brand-300 bg-brand-100 dark:bg-brand-500/15 px-2.5 py-1 rounded-md">
                  {badge}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base mt-1.5 max-w-2xl">
                {subtitle}
              </p>
            )}
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
              {today}
            </p>
          </div>
        </div>
        {children && (
          <div className="flex flex-wrap items-center gap-3 shrink-0">{children}</div>
        )}
      </div>
    </div>
  );
}

export default PageHero;
