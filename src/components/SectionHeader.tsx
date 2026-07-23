import type { ReactNode } from 'react';

interface SectionHeaderProps {
  step?: number;
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export default function SectionHeader({ step, title, description, icon, action }: SectionHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 mb-4">
      <div className="flex items-start gap-3">
        {step != null && (
          <div className="shrink-0 flex items-center justify-center h-9 w-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white font-display font-bold text-sm shadow-glass-sm">
            {step}
          </div>
        )}
        {icon && !step && (
          <div className="shrink-0 p-2.5 rounded-xl bg-brand-100/60 dark:bg-brand-500/15 text-brand-600 dark:text-brand-300">
            {icon}
          </div>
        )}
        <div>
          <h2 className="font-display text-lg font-semibold text-slate-800 dark:text-white">{title}</h2>
          {description && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{description}</p>
          )}
        </div>
      </div>
      {action}
    </div>
  );
}
