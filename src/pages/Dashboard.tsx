import { useEffect, useMemo, useState } from 'react';
import {
  LayoutDashboard,
  TestTube2,
  CalendarDays,
  Droplets,
  Thermometer,
  Waves,
  Gauge,
  FlaskRound,
  Wind,
  TrendingUp,
  Bell,
  History,
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import StatCard from '@/components/StatCard';
import Spinner from '@/components/Spinner';
import DoughnutChart from '@/components/charts/DoughnutChart';
import { Link } from 'react-router-dom';
import { useToast } from '@/context/ToastContext';
import { listRecords } from '@/lib/recordsService';
import { computeDashboardStats, recentAlerts, recentActivity } from '@/lib/stats';
import type { FiltrationRecord } from '@/lib/types';

function fmt(v: number | null, digits = 1): string {
  if (v == null) return '—';
  return v.toFixed(digits);
}

const ALERT_ICON = { red: AlertOctagon, yellow: AlertTriangle, green: CheckCircle2 };
const ALERT_COLOR = {
  red: 'text-rose-600 dark:text-rose-400',
  yellow: 'text-amber-600 dark:text-amber-400',
  green: 'text-emerald-600 dark:text-emerald-400',
};

export default function Dashboard() {
  const { showToast } = useToast();
  const [records, setRecords] = useState<FiltrationRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        setRecords(await listRecords());
      } catch (e: any) {
        showToast('error', e?.message ?? 'Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    })();
  }, [showToast]);

  const stats = useMemo(() => computeDashboardStats(records), [records]);
  const alerts = useMemo(() => recentAlerts(records, 6), [records]);
  const activity = useMemo(() => recentActivity(records, 8), [records]);

  const typeSplit = useMemo(() => {
    const before = records.filter((r) => r.sample_type === 'before').length;
    const after = records.filter((r) => r.sample_type === 'after').length;
    return { before, after };
  }, [records]);

  const qualitySplit = useMemo(() => {
    const counts: Record<string, number> = { Good: 0, Moderate: 0, Poor: 0, Critical: 0 };
    records.forEach((r) => {
      if (r.overall_quality && counts[r.overall_quality] != null) counts[r.overall_quality] += 1;
    });
    return counts;
  }, [records]);

  if (loading) {
    return (
      <div className="py-20 flex items-center justify-center">
        <Spinner size="lg" label="Loading dashboard…" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2.5">
          <LayoutDashboard className="h-6 w-6 text-brand-500" /> Dashboard
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Live overview of all filtration monitoring data.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger">
        <StatCard label="Total Samples" value={stats.totalSamples} icon={<TestTube2 className="h-5 w-5" />} accent="brand" />
        <StatCard label="Today's Tests" value={stats.todayTests} icon={<CalendarDays className="h-5 w-5" />} accent="aqua" trend={new Date().toLocaleDateString()} />
        <StatCard label="Average pH" value={fmt(stats.avgPH, 2)} icon={<Droplets className="h-5 w-5" />} accent="aqua" />
        <StatCard label="Avg Temperature" value={fmt(stats.avgTemperature)} unit="°C" icon={<Thermometer className="h-5 w-5" />} accent="amber" />
        <StatCard label="Avg Turbidity" value={fmt(stats.avgTurbidity)} unit="NTU" icon={<Waves className="h-5 w-5" />} accent="emerald" />
        <StatCard label="Avg Microfiber" value={fmt(stats.avgMicrofiber, 0)} icon={<Gauge className="h-5 w-5" />} accent="violet" />
        <StatCard label="Avg Est. COD" value={fmt(stats.avgCOD, 0)} unit="mg/L" icon={<FlaskRound className="h-5 w-5" />} accent="rose" />
        <StatCard label="Avg Est. BOD" value={fmt(stats.avgBOD, 0)} unit="mg/L" icon={<Wind className="h-5 w-5" />} accent="rose" />
      </div>

      {/* Efficiency banner */}
      <GlassCard strong className="p-6 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-400/15 blur-3xl" />
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-glow">
              <TrendingUp className="h-7 w-7" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400 font-medium">Average Filtration Efficiency</p>
              <p className="font-display text-3xl font-bold text-slate-800 dark:text-white">
                {fmt(stats.avgEfficiency, 1)}<span className="text-lg text-slate-400">%</span>
              </p>
            </div>
          </div>
          <Link
            to="/analytics"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 dark:text-brand-300 hover:gap-2.5 transition-all"
          >
            View Analytics <TrendingUp className="h-4 w-4" />
          </Link>
        </div>
      </GlassCard>

      {/* Charts + alerts */}
      <div className="grid lg:grid-cols-3 gap-6">
        <GlassCard className="p-5 lg:col-span-1">
          <h2 className="font-display text-lg font-semibold text-slate-800 dark:text-white mb-1">Sample Distribution</h2>
          <p className="text-xs text-slate-400 mb-3">Before vs After filtration</p>
          <DoughnutChart
            labels={['Before Filtration', 'After Filtration']}
            data={[typeSplit.before, typeSplit.after]}
            colors={['#f59e0b', '#10b981']}
            height={220}
          />
        </GlassCard>
        <GlassCard className="p-5 lg:col-span-1">
          <h2 className="font-display text-lg font-semibold text-slate-800 dark:text-white mb-1">Quality Distribution</h2>
          <p className="text-xs text-slate-400 mb-3">By overall quality rating</p>
          <DoughnutChart
            labels={['Good', 'Moderate', 'Poor', 'Critical']}
            data={[qualitySplit.Good, qualitySplit.Moderate, qualitySplit.Poor, qualitySplit.Critical]}
            colors={['#10b981', '#f59e0b', '#f97316', '#ef4444']}
            height={220}
          />
        </GlassCard>

        {/* Recent alerts */}
        <GlassCard className="p-5 lg:col-span-1">
          <h2 className="font-display text-lg font-semibold text-slate-800 dark:text-white mb-1 flex items-center gap-2">
            <Bell className="h-4 w-4 text-brand-500" /> Recent Alerts
          </h2>
          <p className="text-xs text-slate-400 mb-3">Latest generated alerts</p>
          <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1">
            {alerts.length === 0 ? (
              <p className="text-sm text-slate-400 py-6 text-center">No alerts yet.</p>
            ) : (
              alerts.map((a) => {
                const Icon = ALERT_ICON[a.level];
                return (
                  <div key={a.id} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-white/50 dark:bg-white/5">
                    <Icon className={`h-4 w-4 shrink-0 mt-0.5 ${ALERT_COLOR[a.level]}`} />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">{a.title}</p>
                      <p className="text-[11px] text-slate-400">{a.sampleId} · {a.date}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </GlassCard>
      </div>

      {/* Recent activity */}
      <GlassCard className="p-5">
        <h2 className="font-display text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
          <History className="h-4 w-4 text-brand-500" /> Recent Activity
        </h2>
        {activity.length === 0 ? (
          <p className="text-sm text-slate-400 py-6 text-center">No activity yet.</p>
        ) : (
          <div className="space-y-2">
            {activity.map((a) => (
              <div
                key={a.id}
                className="flex items-center justify-between gap-3 p-3 rounded-lg bg-white/40 dark:bg-white/5 hover:bg-brand-50/40 dark:hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0 ${
                      a.type === 'before'
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300'
                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'
                    }`}
                  >
                    {a.type === 'before' ? 'Before' : 'After'}
                  </span>
                  <div className="min-w-0">
                    <p className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">{a.sampleId}</p>
                    <p className="text-[11px] text-slate-400">{a.date} · {a.time}</p>
                  </div>
                </div>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{a.quality ?? '—'}</span>
              </div>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
}
