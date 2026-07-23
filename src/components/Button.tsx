import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router-dom';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
type Size = 'sm' | 'md' | 'lg';

interface CommonProps {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

interface ButtonAsButton extends CommonProps, Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  to?: undefined;
}
interface ButtonAsLink extends CommonProps {
  to: string;
  onClick?: () => void;
}

type ButtonProps = ButtonAsButton | ButtonAsLink;

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    'bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-glass hover:shadow-glow hover:from-brand-400 hover:to-brand-600 border border-brand-400/40',
  secondary:
    'bg-white/70 dark:bg-white/10 text-brand-700 dark:text-brand-200 border border-brand-200/60 dark:border-white/15 hover:bg-white dark:hover:bg-white/20',
  ghost:
    'bg-transparent text-slate-700 dark:text-slate-200 hover:bg-brand-50/70 dark:hover:bg-white/10 border border-transparent',
  outline:
    'bg-transparent text-brand-600 dark:text-brand-300 border border-brand-300/70 dark:border-brand-400/40 hover:bg-brand-50/60 dark:hover:bg-brand-500/10',
  danger:
    'bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-glass hover:shadow-glow border border-rose-400/40',
};

const SIZE_CLASSES: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-lg gap-1.5',
  md: 'px-5 py-2.5 text-sm rounded-xl gap-2',
  lg: 'px-7 py-3.5 text-base rounded-xl gap-2.5',
};

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}

export default function Button(props: ButtonProps) {
  const {
    variant = 'primary',
    size = 'md',
    children,
    className = '',
    loading = false,
    leftIcon,
    rightIcon,
  } = props;

  const classes = `inline-flex items-center justify-center font-semibold tracking-wide transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`;

  const content = (
    <>
      {loading && <Spinner />}
      {!loading && leftIcon}
      <span>{children}</span>
      {!loading && rightIcon}
    </>
  );

  if ('to' in props && props.to) {
    return (
      <Link to={props.to} onClick={props.onClick} className={classes}>
        {content}
      </Link>
    );
  }

  const { to: _to, onClick, ...rest } = props as ButtonAsButton;
  void _to;
  return (
    <button onClick={onClick} className={classes} disabled={loading || rest.disabled} {...rest}>
      {content}
    </button>
  );
}
