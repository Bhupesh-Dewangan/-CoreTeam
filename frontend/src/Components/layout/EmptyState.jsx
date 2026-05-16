function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="empty-state col-span-full">
      {Icon && (
        <div className="empty-state-icon">
          <Icon className="w-7 h-7" />
        </div>
      )}
      <h3 className="text-base font-medium text-slate-700 dark:text-slate-200">{title}</h3>
      {description && (
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export default EmptyState;
