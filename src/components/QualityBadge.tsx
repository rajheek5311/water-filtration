interface QualityBadgeProps {
  quality: string | null;
  size?: 'sm' | 'md';
}

const STYLES: Record<string, string> = {
  Good: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 border-emerald-300/60 dark:border-emerald-500/40',
  Moderate:
    'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 border-amber-300/60 dark:border-amber-500/40',
  Poor: 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300 border-orange-300/60 dark:border-orange-500/40',
  Critical:
    'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300 border-rose-300/60 dark:border-rose-500/40',
};

export default function QualityBadge({ quality, size = 'md' }: QualityBadgeProps) {
  if (!quality) return <span className="text-slate-400 text-sm">—</span>;
  const cls = STYLES[quality] ?? STYLES.Moderate;
  const sizing = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';
  return (
    <span className={`inline-flex items-center rounded-full border font-semibold ${cls} ${sizing}`}>
      {quality}
    </span>
  );
}
