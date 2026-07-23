import { CheckCircle2, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useToast, type ToastType } from '@/context/ToastContext';

const ICONS: Record<ToastType, typeof CheckCircle2> = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
};

const STYLES: Record<ToastType, string> = {
  success:
    'bg-emerald-50/95 dark:bg-emerald-900/40 border-emerald-300/60 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-200',
  error:
    'bg-rose-50/95 dark:bg-rose-900/40 border-rose-300/60 dark:border-rose-500/40 text-rose-800 dark:text-rose-200',
  info: 'bg-brand-50/95 dark:bg-brand-900/40 border-brand-300/60 dark:border-brand-500/40 text-brand-800 dark:text-brand-200',
  warning:
    'bg-amber-50/95 dark:bg-amber-900/40 border-amber-300/60 dark:border-amber-500/40 text-amber-800 dark:text-amber-200',
};

export default function Toaster() {
  const { toasts, dismissToast } = useToast();
  return (
    <div className="fixed top-4 right-4 z-[60] flex flex-col gap-2.5 w-[calc(100vw-2rem)] max-w-sm">
      {toasts.map((t) => {
        const Icon = ICONS[t.type];
        return (
          <div
            key={t.id}
            className={`glass-strong border ${STYLES[t.type]} rounded-xl px-4 py-3 flex items-start gap-3 animate-slide-in-right shadow-glass`}
          >
            <Icon className="h-5 w-5 shrink-0 mt-0.5" />
            <p className="text-sm font-medium flex-1 leading-relaxed">{t.message}</p>
            <button
              onClick={() => dismissToast(t.id)}
              className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
