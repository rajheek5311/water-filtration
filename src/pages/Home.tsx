import { Link } from 'react-router-dom';
import {
  FlaskConical,
  LayoutDashboard,
  Table2,
  Droplets,
  ShieldCheck,
  Activity,
  Gauge,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import { useAuth } from '@/context/AuthContext';

const ACTIONS = [
  {
    to: '/new-test',
    title: 'New Test',
    desc: 'Run a new before or after filtration analysis with image uploads.',
    icon: FlaskConical,
    accent: 'from-brand-500 to-brand-700',
  },
  {
    to: '/dashboard',
    title: 'Dashboard',
    desc: 'Live overview of averages, recent alerts and system activity.',
    icon: LayoutDashboard,
    accent: 'from-aqua-500 to-aqua-700',
  },
  {
    to: '/records',
    title: 'Records',
    desc: 'Browse, search, edit, export or delete all stored test records.',
    icon: Table2,
    accent: 'from-emerald-500 to-emerald-700',
  },
];

const FEATURES = [
  { icon: Droplets, title: 'pH Strip Analysis', desc: 'Image-based pH estimation with confidence scoring.' },
  { icon: Activity, title: 'Dye Detection', desc: 'Water colour, dye category and intensity prediction.' },
  { icon: Gauge, title: 'Microfiber Estimation', desc: 'Fiber count, density and length from filter paper.' },
  { icon: ShieldCheck, title: 'Alert Engine', desc: 'Automatic coloured alerts across all parameters.' },
  { icon: TrendingUp, title: 'Trend Analytics', desc: 'Track pH, turbidity, COD, BOD and efficiency over time.' },
  { icon: FlaskConical, title: 'Before / After Compare', desc: 'Side-by-side comparison with charts and PDF reports.' },
];

export default function Home() {
  const { user } = useAuth();
  const firstName = user?.email?.split('@')[0] ?? 'there';

  return (
    <div className="space-y-8">
      {/* Hero */}
      <GlassCard strong className="relative overflow-hidden p-8 lg:p-12">
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-brand-400/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-10 h-64 w-64 rounded-full bg-aqua-400/20 blur-3xl" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-300/30 text-brand-700 dark:text-brand-300 text-xs font-semibold mb-5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Intelligent Wastewater Monitoring
          </div>
          <h1 className="font-display text-3xl lg:text-5xl font-bold text-slate-800 dark:text-white leading-tight max-w-3xl">
            Smart Textile Water Filtration{' '}
            <span className="bg-gradient-to-r from-brand-500 to-aqua-500 bg-clip-text text-transparent">
              Monitoring System
            </span>
          </h1>
          <p className="mt-4 text-base lg:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
            Low-cost intelligent monitoring platform for textile wastewater filtration. Capture, analyse,
            and record every sample — before and after treatment.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/new-test"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white font-semibold shadow-glass hover:shadow-glow transition-all hover:-translate-y-0.5"
            >
              <FlaskConical className="h-5 w-5" /> New Test
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/70 dark:bg-white/10 text-brand-700 dark:text-brand-200 font-semibold border border-brand-200/60 dark:border-white/15 hover:bg-white dark:hover:bg-white/20 transition-all hover:-translate-y-0.5"
            >
              <LayoutDashboard className="h-5 w-5" /> Dashboard
            </Link>
            <Link
              to="/records"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/70 dark:bg-white/10 text-brand-700 dark:text-brand-200 font-semibold border border-brand-200/60 dark:border-white/15 hover:bg-white dark:hover:bg-white/20 transition-all hover:-translate-y-0.5"
            >
              <Table2 className="h-5 w-5" /> Records
            </Link>
          </div>
        </div>
      </GlassCard>

      {/* Greeting + quick actions */}
      <div>
        <div className="flex items-end justify-between mb-4">
          <div>
            <h2 className="font-display text-xl font-semibold text-slate-800 dark:text-white">
              Welcome back, {firstName}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Choose where to start.</p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
          {ACTIONS.map((a) => {
            const Icon = a.icon;
            return (
              <Link key={a.to} to={a.to}>
                <GlassCard className="p-6 h-full group" hover>
                  <div
                    className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${a.accent} text-white shadow-glass-sm mb-4`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-slate-800 dark:text-white">{a.title}</h3>
                  <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{a.desc}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-600 dark:text-brand-300 group-hover:gap-2 transition-all">
                    Open <ArrowRight className="h-4 w-4" />
                  </span>
                </GlassCard>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Feature grid */}
      <div>
        <h2 className="font-display text-xl font-semibold text-slate-800 dark:text-white mb-4">
          Platform Capabilities
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <GlassCard key={f.title} className="p-5">
                <div className="flex items-start gap-3">
                  <div className="shrink-0 p-2.5 rounded-xl bg-brand-100/60 dark:bg-brand-500/15 text-brand-600 dark:text-brand-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 dark:text-white text-sm">{f.title}</h3>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </div>
  );
}
