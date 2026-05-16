function SummaryPill({ label, value, icon: Icon }) {
  return (
    <div className="summary-pill">
      {Icon && (
        <div className="p-2 rounded-lg bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400">
          <Icon className="w-4 h-4" />
        </div>
      )}
      <div>
        <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide font-medium">{label}</p>
        <p className="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-0.5">{value}</p>
      </div>
    </div>
  );
}

export default SummaryPill;
