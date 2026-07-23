interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
}

export default function Spinner({ size = 'md', label, className = '' }: SpinnerProps) {
  const dims = size === 'sm' ? 'h-5 w-5' : size === 'lg' ? 'h-10 w-10' : 'h-7 w-7';
  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <div className="relative">
        <div className={`${dims} rounded-full border-2 border-brand-200/40`} />
        <div
          className={`${dims} rounded-full border-2 border-transparent border-t-brand-500 animate-spin absolute inset-0`}
        />
      </div>
      {label && <p className="text-sm text-slate-500 dark:text-slate-400 animate-pulse">{label}</p>}
    </div>
  );
}
