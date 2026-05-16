import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

function QuickLinkCard({ to, icon: Icon, title, description, count }) {
  return (
    <Link
      to={to}
      className="card card-hover p-5 flex items-center gap-4 group h-full"
    >
      <div className="p-3 rounded-xl bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 group-hover:bg-brand-500 group-hover:text-white transition-colors shrink-0">
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-col items-start justify-between gap-2">
          <div className="flex gap-3">
          <h3 className="font-medium text-slate-900 dark:text-slate-100">{title}</h3>
        {count != null && (
            <span className="text-xs font-semibold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-500/15 px-2 py-1 rounded-full text-center">
              {count}
            </span>
          )}
          </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{description}</p>
          
        </div>
      </div>
      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-brand-500 group-hover:translate-x-0.5 transition-all shrink-0" />
    </Link>
  );
}

export default QuickLinkCard;
