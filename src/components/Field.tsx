import type { InputHTMLAttributes, ReactNode } from 'react';

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: ReactNode;
  unit?: string;
  hint?: string;
}

export default function Field({ label, icon, unit, hint, className = '', ...rest }: FieldProps) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">{label}</span>
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
            {icon}
          </span>
        )}
        <input
          className={`w-full rounded-xl bg-white/70 dark:bg-white/5 border border-slate-200/70 dark:border-white/10 px-3.5 py-2.5 text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-400/60 focus:border-brand-400 transition-all ${
            icon ? 'pl-10' : ''
          } ${unit ? 'pr-12' : ''} ${className}`}
          {...rest}
        />
        {unit && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
            {unit}
          </span>
        )}
      </div>
      {hint && <span className="block mt-1 text-xs text-slate-400">{hint}</span>}
    </label>
  );
}
