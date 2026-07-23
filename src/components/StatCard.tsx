import type { ReactNode } from 'react';
import GlassCard from './GlassCard';

interface StatCardProps {
  label: string;
  value: ReactNode;
  unit?: string;
  icon: ReactNode;
  accent?: 'brand' | 'aqua' | 'emerald' | 'amber' | 'rose' | 'violet';
  trend?: string;
}

const ACCENTS: Record<NonNullable<StatCardProps['accent']>, string> = {
  brand: 'from-brand-500/20 to-brand-500/5 text-brand-600 dark:text-brand-300',
  aqua: 'from-aqua-500/20 to-aqua-500/5 text-aqua-600 dark:text-aqua-300',
  emerald: 'from-emerald-500/20 to-emerald-500/5 text-emerald-600 dark:text-emerald-300',
  amber: 'from-amber-500/20 to-amber-500/5 text-amber-600 dark:text-amber-300',
  rose: 'from-rose-500/20 to-rose-500/5 text-rose-600 dark:text-rose-300',
  violet: 'from-violet-500/20 to-violet-500/5 text-violet-600 dark:text-violet-300',
};

export default function StatCard({ label, value, unit, icon, accent = 'brand', trend }: StatCardProps) {
  return (
    <GlassCard className="p-5" hover>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {label}
          </p>
          <p className="mt-2 font-display text-2xl font-bold text-slate-800 dark:text-white truncate">
            {value}
            {unit && <span className="ml-1 text-sm font-medium text-slate-400">{unit}</span>}
          </p>
          {trend && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{trend}</p>}
        </div>
        <div className={`shrink-0 p-3 rounded-xl bg-gradient-to-br ${ACCENTS[accent]}`}>{icon}</div>
      </div>
    </GlassCard>
  );
}
