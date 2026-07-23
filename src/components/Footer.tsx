import { Droplets } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="shrink-0 border-t border-slate-200/60 dark:border-white/10 bg-white/40 dark:bg-[#0b1430]/60">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-gradient-to-br from-brand-500 to-aqua-500 text-white shadow-glass-sm">
              <Droplets className="h-4 w-4" />
            </div>
            <div>
              <p className="font-display font-bold text-sm text-slate-800 dark:text-white leading-tight">
                Smart Textile Water Filtration
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">Monitoring System</p>
            </div>
          </div>
          <div className="flex items-center gap-5 text-xs font-medium text-slate-500 dark:text-slate-400">
            <Link to="/about" className="hover:text-brand-600 dark:hover:text-brand-300 transition-colors">About</Link>
            <Link to="/contact" className="hover:text-brand-600 dark:hover:text-brand-300 transition-colors">Contact</Link>
            <Link to="/home" className="hover:text-brand-600 dark:hover:text-brand-300 transition-colors">Home</Link>
          </div>
        </div>
        <div className="mt-6 pt-5 border-t border-slate-200/50 dark:border-white/10 text-center space-y-1">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            &copy; 2026 Smart Textile Water Filtration Monitoring System
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Designed for Sustainable Textile Water Monitoring
          </p>
        </div>
      </div>
    </footer>
  );
}
