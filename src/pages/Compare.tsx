import { useEffect, useMemo, useState } from 'react';
import { GitCompare, ArrowRightLeft, FileDown, AlertCircle } from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import Button from '@/components/Button';
import Spinner from '@/components/Spinner';
import BarChart from '@/components/charts/BarChart';
import RadarChart from '@/components/charts/RadarChart';
import { useToast } from '@/context/ToastContext';
import { listRecords } from '@/lib/recordsService';
import { generateComparisonReport } from '@/lib/pdfReport';
import type { FiltrationRecord } from '@/lib/types';

const PARAM_ROWS: {
  key: keyof FiltrationRecord;
  label: string;
  unit?: string;
  invert?: boolean; // true when lower is better
}[] = [
  { key: 'ph_value', label: 'pH', invert: false },
  { key: 'temperature', label: 'Temperature', unit: '°C', invert: false },
  { key: 'turbidity', label: 'Turbidity', unit: 'NTU', invert: true },
  { key: 'flow_rate', label: 'Flow Rate', unit: 'L/min', invert: false },
  { key: 'pressure_drop', label: 'Pressure Drop', unit: 'kPa', invert: true },
  { key: 'electrical_conductivity', label: 'Electrical Cond.', unit: 'µS/cm', invert: true },
  { key: 'dissolved_oxygen', label: 'Dissolved Oxygen', unit: 'mg/L', invert: false },
  { key: 'microfiber_count', label: 'Microfiber Count', invert: true },
  { key: 'estimated_cod', label: 'Estimated COD', unit: 'mg/L', invert: true },
  { key: 'estimated_bod', label: 'Estimated BOD', unit: 'mg/L', invert: true },
  { key: 'filtration_efficiency', label: 'Filtration Eff.', unit: '%', invert: false },
];

function fmt(v: number | null | undefined, digits = 1): string {
  if (v == null) return '—';
  return v.toFixed(digits);
}

function num(v: number | null | undefined): number | null {
  return v == null ? null : Number(v);
}

export default function Compare() {
  const { showToast } = useToast();
  const [records, setRecords] = useState<FiltrationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [beforeId, setBeforeId] = useState('');
  const [afterId, setAfterId] = useState('');

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await listRecords();
        setRecords(data);
      } catch (e: any) {
        showToast('error', e?.message ?? 'Failed to load records.');
      } finally {
        setLoading(false);
      }
    })();
  }, [showToast]);

  const beforeRecords = useMemo(() => records.filter((r) => r.sample_type === 'before'), [records]);
  const afterRecords = useMemo(() => records.filter((r) => r.sample_type === 'after'), [records]);

  const before = useMemo(() => records.find((r) => r.id === beforeId) ?? null, [records, beforeId]);
  const after = useMemo(() => records.find((r) => r.id === afterId) ?? null, [records, afterId]);

  const tableRows = useMemo(() => {
    if (!before || !after) return [];
    return PARAM_ROWS.filter((row, idx, arr) => arr.findIndex((r) => r.key === row.key) === idx).map((row) => {
      const b = num(before[row.key] as number | null);
      const a = num(after[row.key] as number | null);
      const diff = b != null && a != null ? a - b : null;
      const improvement =
        b != null && a != null && b !== 0 ? ((row.invert ? b - a : a - b) / Math.abs(b)) * 100 : null;
      return { ...row, before: b, after: a, diff, improvement };
    });
  }, [before, after]);

  const barData = useMemo(() => {
    if (!before || !after) return null;
    const labels = tableRows.map((r) => r.label);
    const beforeVals = tableRows.map((r) => (r.before != null ? r.before : 0));
    const afterVals = tableRows.map((r) => (r.after != null ? r.after : 0));
    return { labels, beforeVals, afterVals };
  }, [before, after, tableRows]);

  const radarData = useMemo(() => {
    if (!before || !after) return null;
    // Normalize each parameter to 0..100 for the radar. Lower-is-better params invert.
    const labels = ['pH', 'Turbidity', 'COD', 'BOD', 'Microfiber', 'Efficiency'];
    const norm = (r: FiltrationRecord | null): number[] => {
      if (!r) return [];
      const phScore = r.ph_value != null ? 100 - Math.min(100, Math.abs(r.ph_value - 7) * 12) : 0;
      const turb = r.turbidity != null ? Math.max(0, 100 - r.turbidity * 2) : 0;
      const cod = r.estimated_cod != null ? Math.max(0, 100 - r.estimated_cod / 8) : 0;
      const bod = r.estimated_bod != null ? Math.max(0, 100 - r.estimated_bod / 4) : 0;
      const micro = r.microfiber_count != null ? Math.max(0, 100 - r.microfiber_count / 12) : 0;
      const eff = r.filtration_efficiency ?? 0;
      return [phScore, turb, cod, bod, micro, eff];
    };
    return { labels, before: norm(before), after: norm(after) };
  }, [before, after]);

  if (loading) {
    return (
      <div className="py-20 flex items-center justify-center">
        <Spinner size="lg" label="Loading records…" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2.5">
          <GitCompare className="h-6 w-6 text-brand-500" /> Compare
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Select one Before and one After record to compare filtration performance.
        </p>
      </div>

      {/* Selectors */}
      <GlassCard className="p-5">
        <div className="grid md:grid-cols-2 gap-4">
          <Selector
            label="Before Filtration Record"
            records={beforeRecords}
            value={beforeId}
            onChange={setBeforeId}
            tone="amber"
          />
          <Selector
            label="After Filtration Record"
            records={afterRecords}
            value={afterId}
            onChange={setAfterId}
            tone="emerald"
          />
        </div>
        {before && after && (
          <div className="mt-4 flex justify-end">
            <Button
              variant="secondary"
              onClick={() => generateComparisonReport(before, after)}
              leftIcon={<FileDown className="h-4 w-4" />}
            >
              Download Comparison PDF
            </Button>
          </div>
        )}
      </GlassCard>

      {!before || !after ? (
        <GlassCard className="p-10 text-center">
          <ArrowRightLeft className="h-10 w-10 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Select a Before and an After record to view the comparison.
          </p>
          {(beforeRecords.length === 0 || afterRecords.length === 0) && (
            <p className="mt-2 text-xs text-amber-600 dark:text-amber-400 flex items-center justify-center gap-1.5">
              <AlertCircle className="h-4 w-4" />
              You need at least one Before and one After record to compare.
            </p>
          )}
        </GlassCard>
      ) : (
        <div className="space-y-6 animate-fade-in">
          {/* Comparison table */}
          <GlassCard className="p-0 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200/60 dark:border-white/10">
              <h2 className="font-display text-lg font-semibold text-slate-800 dark:text-white">Comparison Table</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200/60 dark:border-white/10 text-left text-xs uppercase tracking-wider text-slate-400">
                    <th className="px-5 py-3 font-medium">Parameter</th>
                    <th className="px-5 py-3 font-medium text-right">Before</th>
                    <th className="px-5 py-3 font-medium text-right">After</th>
                    <th className="px-5 py-3 font-medium text-right">Difference</th>
                    <th className="px-5 py-3 font-medium text-right">Improvement %</th>
                  </tr>
                </thead>
                <tbody>
                  {tableRows.map((r) => (
                    <tr
                      key={r.key + r.label}
                      className="border-b border-slate-100/60 dark:border-white/5 hover:bg-brand-50/30 dark:hover:bg-white/5"
                    >
                      <td className="px-5 py-3 text-slate-700 dark:text-slate-200 font-medium">
                        {r.label}
                        {r.unit && <span className="ml-1 text-xs text-slate-400">({r.unit})</span>}
                      </td>
                      <td className="px-5 py-3 text-right text-slate-700 dark:text-slate-200">{fmt(r.before, 2)}</td>
                      <td className="px-5 py-3 text-right text-slate-700 dark:text-slate-200">{fmt(r.after, 2)}</td>
                      <td className="px-5 py-3 text-right">
                        {r.diff != null ? (
                          <span className={r.diff < 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
                            {r.diff > 0 ? '+' : ''}{r.diff.toFixed(2)}
                          </span>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="px-5 py-3 text-right">
                        {r.improvement != null ? (
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                              r.improvement > 0
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'
                                : r.improvement < 0
                                ? 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300'
                                : 'bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300'
                            }`}
                          >
                            {r.improvement > 0 ? '+' : ''}{r.improvement.toFixed(1)}%
                          </span>
                        ) : (
                          '—'
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>

          {/* Charts */}
          <div className="grid lg:grid-cols-2 gap-6">
            <GlassCard className="p-5">
              <h2 className="font-display text-lg font-semibold text-slate-800 dark:text-white mb-4">Parameter Bars</h2>
              {barData && (
                <BarChart
                  labels={barData.labels}
                  datasets={[
                    { label: 'Before', data: barData.beforeVals, color: '#f59e0b' },
                    { label: 'After', data: barData.afterVals, color: '#10b981' },
                  ]}
                  height={300}
                />
              )}
            </GlassCard>
            <GlassCard className="p-5">
              <h2 className="font-display text-lg font-semibold text-slate-800 dark:text-white mb-4">
                Quality Radar (0–100, higher is better)
              </h2>
              {radarData && (
                <RadarChart
                  labels={radarData.labels}
                  series={[
                    { label: 'Before', data: radarData.before, color: '#f59e0b' },
                    { label: 'After', data: radarData.after, color: '#10b981' },
                  ]}
                  height={300}
                />
              )}
            </GlassCard>
          </div>
        </div>
      )}
    </div>
  );
}

function Selector({
  label,
  records,
  value,
  onChange,
  tone,
}: {
  label: string;
  records: FiltrationRecord[];
  value: string;
  onChange: (v: string) => void;
  tone: 'amber' | 'emerald';
}) {
  const dot = tone === 'amber' ? 'bg-amber-500' : 'bg-emerald-500';
  return (
    <label className="block">
      <span className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">{label}</span>
      <div className="relative">
        <span className={`absolute left-3 top-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full ${dot}`} />
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl bg-white/70 dark:bg-white/5 border border-slate-200/70 dark:border-white/10 pl-8 pr-4 py-2.5 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-400/60 transition-all appearance-none"
        >
          <option value="">— Select a record —</option>
          {records.map((r) => (
            <option key={r.id} value={r.id}>
              {r.sample_id} · {r.test_date}
            </option>
          ))}
        </select>
      </div>
      {records.length === 0 && (
        <span className="block mt-1 text-xs text-amber-600 dark:text-amber-400">No {tone === 'amber' ? 'before' : 'after'} records available.</span>
      )}
    </label>
  );
}
