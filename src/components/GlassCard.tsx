import type { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  strong?: boolean;
  hover?: boolean;
  onClick?: () => void;
}

export default function GlassCard({
  children,
  className = '',
  strong = false,
  hover = false,
  onClick,
}: GlassCardProps) {
  const base = strong ? 'glass-strong' : 'glass';
  const hoverCls = hover
    ? 'transition-all duration-300 hover:-translate-y-1 hover:shadow-glow cursor-pointer'
    : '';
  return (
    <div
      onClick={onClick}
      className={`${base} rounded-2xl ${hoverCls} ${className}`}
    >
      {children}
    </div>
  );
}
