import { useState, type ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FlaskConical,
  Table2,
  GitCompare,
  BarChart3,
  FileText,
  Home,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  Droplets,
  ChevronRight,
  Info,
  Phone,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import Footer from './Footer';

interface NavItem {
  to: string;
  label: string;
  icon: typeof Home;
}

const NAV: NavItem[] = [
  { to: '/home', label: 'Home', icon: Home },
  { to: '/new-test', label: 'New Test', icon: FlaskConical },
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/records', label: 'Records', icon: Table2 },
  { to: '/compare', label: 'Compare', icon: GitCompare },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/report', label: 'Report', icon: FileText },
  { to: '/about', label: 'About', icon: Info },
  { to: '/contact', label: 'Contact', icon: Phone },
];

export default function Layout({ children }: { children: ReactNode }) {
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    showToast('info', 'Signed out successfully.');
    navigate('/login');
  };

  const NavLinks = () => (
    <nav className="flex flex-col gap-1.5">
      {NAV.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-brand-500/20 to-brand-500/5 text-brand-700 dark:text-brand-200 border border-brand-300/40 dark:border-brand-500/30'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-white/5 border border-transparent'
              }`
            }
          >
            <Icon className="h-[18px] w-[18px] shrink-0" />
            <span>{item.label}</span>
            <ChevronRight className="h-3.5 w-3.5 ml-auto opacity-0 group-hover:opacity-60 transition-opacity" />
          </NavLink>
        );
      })}
    </nav>
  );

  const Brand = () => (
    <div className="flex items-center gap-3 px-2">
      <div className="relative">
        <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-brand-500 to-aqua-500 text-white shadow-glow">
          <Droplets className="h-5 w-5" />
        </div>
        <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-white dark:ring-[#0c1730] animate-pulse" />
      </div>
      <div className="min-w-0">
        <p className="font-display font-bold text-sm text-slate-800 dark:text-white leading-tight truncate">
          Smart TWF
        </p>
        <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">Monitoring System</p>
      </div>
    </div>
  );

  return (
    <div className="app-bg app-grid min-h-screen">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col fixed inset-y-0 left-0 w-64 glass border-r border-white/40 dark:border-white/10 z-30 p-4">
        <Brand />
        <div className="mt-6 flex-1 overflow-y-auto">
          <NavLinks />
        </div>
        <div className="pt-3 border-t border-slate-200/50 dark:border-white/10">
          <div className="flex items-center gap-2 px-2 py-2 mb-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-brand-400 to-aqua-500 flex items-center justify-center text-white text-xs font-bold">
              {(user?.email?.[0] ?? 'U').toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">
                {user?.email ?? 'User'}
              </p>
              <p className="text-[10px] text-slate-400">Authenticated</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-rose-50/70 dark:hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
          >
            <LogOut className="h-[18px] w-[18px]" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 glass-strong p-4 flex flex-col animate-slide-in-right">
            <div className="flex items-center justify-between">
              <Brand />
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-6 flex-1 overflow-y-auto">
              <NavLinks />
            </div>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-rose-50/70 dark:hover:bg-rose-500/10 hover:text-rose-600 transition-colors"
            >
              <LogOut className="h-[18px] w-[18px]" /> Sign Out
            </button>
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="lg:pl-64 min-h-screen flex flex-col">
        <header className="sticky top-0 z-20 glass border-b border-white/40 dark:border-white/10">
          <div className="flex items-center justify-between px-4 lg:px-8 h-16">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-white/10"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="hidden lg:block">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-white/10 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? <Moon className="h-[18px] w-[18px]" /> : <Sun className="h-[18px] w-[18px]" />}
              </button>
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-500/10 border border-emerald-300/40 dark:border-emerald-500/30">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">System Online</span>
              </div>
            </div>
          </div>
        </header>
        <main className="relative z-10 flex-1 p-4 lg:p-8 max-w-[1400px] mx-auto w-full">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
