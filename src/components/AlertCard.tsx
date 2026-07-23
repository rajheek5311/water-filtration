import { CheckCircle2, AlertTriangle, AlertOctagon } from 'lucide-react';
import type { AlertItem } from '@/lib/types';

const LEVEL_STYLES = {
  green: {
    wrap: 'border-emerald-300/60 dark:border-emerald-500/30 bg-emerald-50/70 dark:bg-emerald-900/20',
    icon: 'text-emerald-600 dark:text-emerald-400',
    title: 'text-emerald-800 dark:text-emerald-200',
    body: 'text-emerald-700/80 dark:text-emerald-300/80',
    Icon: CheckCircle2,
  },
  yellow: {
    wrap: 'border-amber-300/60 dark:border-amber-500/30 bg-amber-50/70 dark:bg-amber-900/20',
    icon: 'text-amber-600 dark:text-amber-400',
    title: 'text-amber-800 dark:text-amber-200',
    body: 'text-amber-700/80 dark:text-amber-300/80',
    Icon: AlertTriangle,
  },
  red: {
    wrap: 'border-rose-300/60 dark:border-rose-500/30 bg-rose-50/70 dark:bg-rose-900/20',
    icon: 'text-rose-600 dark:text-rose-400',
    title: 'text-rose-800 dark:text-rose-200',
    body: 'text-rose-700/80 dark:text-rose-300/80',
    Icon: AlertOctagon,
  },
} as const;

export default function AlertCard({ alert }: { alert: AlertItem }) {
  const s = LEVEL_STYLES[alert.level];
  const { Icon } = s;
  return (
    <div className={`flex gap-3 rounded-xl border px-4 py-3 animate-fade-in ${s.wrap}`}>
      <Icon className={`h-5 w-5 shrink-0 mt-0.5 ${s.icon}`} />
      <div className="min-w-0">
        <p className={`text-sm font-semibold ${s.title}`}>{alert.title}</p>
        <p className={`text-xs mt-0.5 leading-relaxed ${s.body}`}>{alert.message}</p>
      </div>
    </div>
  );
}
