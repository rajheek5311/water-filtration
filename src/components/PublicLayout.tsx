import { useState, type ReactNode } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Home,
  FlaskConical,
  LayoutDashboard,
  Table2,
  Info,
  Phone,
  LogIn,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  Droplets,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import Footer from './Footer';

interface NavItem {
  to: string;
  label: string;
  icon: typeof Home;
  public?: boolean;
}

const NAV: NavItem[] = [
  { to: '/home', label: 'Home', icon: Home, public: true },
  { to: '/new-test', label: 'New Test', icon: FlaskConical, public: true },
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, public: true },
  { to: '/records', label: 'Records', icon: Table2, public: true },
  { to: '/about', label: 'About', icon: Info, public: true },
  { to: '/contact', label: 'Contact', icon: Phone, public: true },
];

export default function PublicLayout({ children }: { children: ReactNode }) {
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

  const Brand = () => (
    <Link to="/home" className="flex items-center gap-2.5 group">
      <div className="relative">
        <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-brand-500 to-aqua-500 text-white shadow-glow transition-transform group-hover:scale-105">
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
    </Link>
  );

  const NavLinks = ({ onClick }: { onClick?: () => void }) => (
    <nav className="flex flex-col md:flex-row gap-1 md:gap-1 w-full md:w-auto">
      {NAV.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onClick}
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'text-brand-700 dark:text-brand-200 bg-brand-50/70 dark:bg-brand-500/15'
                  : 'text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-300 hover:bg-white/60 dark:hover:bg-white/5'
              }`
            }
          >
            <Icon className="h-[18px] w-[18px] shrink-0" />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );

  return (
    <div className="app-bg app-grid min-h-screen flex flex-col">
      {/* Sticky navbar */}
      <header className="sticky top-0 z-40 glass border-b border-white/40 dark:border-white/10">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 h-16 flex items-center justify-between gap-4">
          <Brand />

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'text-brand-700 dark:text-brand-200 bg-brand-50/70 dark:bg-brand-500/15'
                        : 'text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-300 hover:bg-white/60 dark:hover:bg-white/5'
                    }`
                  }
                >
                  <Icon className="h-[18px] w-[18px]" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-white/10 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon className="h-[18px] w-[18px]" /> : <Sun className="h-[18px] w-[18px]" />}
            </button>
            {user ? (
              <button
                onClick={handleSignOut}
                className="hidden sm:inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-rose-50/70 dark:hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
              >
                <LogOut className="h-[18px] w-[18px]" /> Sign Out
              </button>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-semibold bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-glass-sm hover:shadow-glow transition-all"
              >
                <LogIn className="h-[18px] w-[18px]" /> Login
              </Link>
            )}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-white/10"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute inset-y-0 right-0 w-72 glass-strong p-4 flex flex-col animate-slide-in-right">
            <div className="flex items-center justify-between mb-4">
              <Brand />
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <NavLinks onClick={() => setMobileOpen(false)} />
            <div className="mt-auto pt-4 border-t border-slate-200/50 dark:border-white/10">
              {user ? (
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    handleSignOut();
                  }}
                  className="w-full flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-rose-50/70 dark:hover:bg-rose-500/10 hover:text-rose-600 transition-colors"
                >
                  <LogOut className="h-[18px] w-[18px]" /> Sign Out
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-semibold bg-gradient-to-br from-brand-500 to-brand-700 text-white"
                >
                  <LogIn className="h-[18px] w-[18px]" /> Login
                </Link>
              )}
            </div>
          </aside>
        </div>
      )}

      {/* Main content */}
      <main className="relative z-10 flex-1 w-full max-w-[1400px] mx-auto px-4 lg:px-8 py-6 lg:py-10">
        {children}
      </main>

      <Footer />
    </div>
  );
}
