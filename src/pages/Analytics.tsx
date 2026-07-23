import { useEffect, useMemo, useState } from 'react';
import {
  BarChart3,
  Droplets,
  Thermometer,
  Waves,
  Gauge,
  FlaskRound,
  Wind,
  TrendingUp,
  Filter as FilterIcon,
} from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import Spinner from '@/components/Spinner';
import LineTrend from '@/components/charts/LineTrend';
import { useToast } from '@/context/ToastContext';
import { listRecords } from '@/lib/recordsService';
import { buildTrend } from '@/lib/stats';
import type { FiltrationRecord } from '@/lib/types';

type TrendType = 'all' | 'before' | 'after';

const TRENDS: {
  key: keyof FiltrationRecord;
  label: string;
  color: string;
  icon: typeof Droplets;
  unit: string;
}[] = [
  { key: 'ph_value', label: 'pH Trend', color: '#06b6d4', icon: Droplets, unit: '' },
  { key: 'temperature', label: 'Temperature Trend', color: '#f59e0b', icon: Thermometer, unit: '°C' },
  { key: 'turbidity', label: 'Turbidity Trend', color: '#8b5cf6', icon: Waves, unit: 'NTU' },
  { key: 'microfiber_count', label: 'Microfiber Trend', color: '#ec4899', icon: Gauge, unit: '' },
  { key: 'estimated_cod', label: 'Estimated COD Trend', color: '#ef4444', icon: FlaskRound, unit: 'mg/L' },
  { key: 'estimated_bod', label: 'Estimated BOD Trend', color: '#f97316', icon: Wind, unit: 'mg/L' },
  { key: 'flow_rate', label: 'Flow Rate Trend', color: '#10b981', icon: TrendingUp, unit: 'L/min' },
  { key: 'filtration_efficiency', label: 'Filter Efficiency Trend', color: '#3389fc', icon: TrendingUp, unit: '%' },
];

export default function Analytics() {
  const { showToast } = useToast();
  const [records, setRecords] = useState<FiltrationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [trendType, setTrendType] = useState<TrendType>('all');

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        setRecords(await listRecords());
      } catch (e: any) {
        showToast('error', e?.message ?? 'Failed to load analytics data.');
      } finally {
        setLoading(false);
      }
    })();
  }, [showToast]);

  const filteredRecords = useMemo(() => {
    if (trendType === 'all') return records;
    return records.filter((r) => r.sample_type === trendType);
  }, [records, trendType]);

  const trends = useMemo(
    () => TRENDS.map((t) => ({ ...t, data: buildTrend(filteredRecords, t.key) })),
    [filteredRecords]
  );

  if (loading) {
    return (
      <div className="py-20 flex items-center justify-center">
        <Spinner size="lg" label="Loading analytics…" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2.5">
            <BarChart3 className="h-6 w-6 text-brand-500" /> Analytics
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Trend analysis across all measured and estimated parameters.
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-400 mr-1">
            <FilterIcon className="h-3.5 w-3.5" /> Series:
          </span>
          {(['all', 'before', 'after'] as TrendType[]).map((t) => (
            <button
              key={t}
              onClick={() => setTrendType(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                trendType === t
                  ? 'bg-brand-500 text-white shadow-glass-sm'
                  : 'bg-white/60 dark:bg-white/5 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-white/10 hover:bg-brand-50/60'
              }`}
            >
              {t === 'all' ? 'All' : t}
            </button>
          ))}
        </div>
      </div>

      {filteredRecords.length === 0 ? (
        <GlassCard className="p-12 text-center">
          <BarChart3 className="h-10 w-10 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {records.length === 0 ? 'No records yet. Run a new test to see trends.' : 'No records for this filter.'}
          </p>
        </GlassCard>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6 stagger">
          {trends.map((t) => {
            const Icon = t.icon;
            const labels = t.data.map((d) => d.label);
            const values = t.data.map((d) => d.value);
            return (
              <GlassCard key={t.key} className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: t.color + '22', color: t.color }}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <h2 className="font-display text-base font-semibold text-slate-800 dark:text-white">{t.label}</h2>
                  </div>
                  {t.unit && <span className="text-xs text-slate-400">{t.unit}</span>}
                </div>
                <LineTrend
                  labels={labels}
                  datasets={[{ label: t.label.replace(' Trend', ''), data: values, color: t.color }]}
                  yLabel={t.unit || undefined}
                  height={220}
                />
              </GlassCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
