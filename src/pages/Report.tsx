import { useEffect, useMemo, useState } from 'react';
import {
  FileText,
  Download,
  FileDown,
  Building2,
  Calendar,
  Clock,
  Image as ImageIcon,
  BarChart3,
  Bell,
  Hash,
  ArrowRightLeft,
} from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import Button from '@/components/Button';
import Spinner from '@/components/Spinner';
import AlertCard from '@/components/AlertCard';
import QualityBadge from '@/components/QualityBadge';
import { useToast } from '@/context/ToastContext';
import { listRecords } from '@/lib/recordsService';
import { generateRecordReport, generateComparisonReport } from '@/lib/pdfReport';
import type { FiltrationRecord } from '@/lib/types';

function fmt(v: number | null | undefined, digits = 1): string {
  if (v == null) return '—';
  return v.toFixed(digits);
}

export default function Report() {
  const { showToast } = useToast();
  const [records, setRecords] = useState<FiltrationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState('');
  const [beforeId, setBeforeId] = useState('');
  const [afterId, setAfterId] = useState('');

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        setRecords(await listRecords());
      } catch (e: any) {
        showToast('error', e?.message ?? 'Failed to load records.');
      } finally {
        setLoading(false);
      }
    })();
  }, [showToast]);

  const selected = useMemo(() => records.find((r) => r.id === selectedId) ?? null, [records, selectedId]);
  const beforeRecords = useMemo(() => records.filter((r) => r.sample_type === 'before'), [records]);
  const afterRecords = useMemo(() => records.filter((r) => r.sample_type === 'after'), [records]);
  const before = useMemo(() => records.find((r) => r.id === beforeId) ?? null, [records, beforeId]);
  const after = useMemo(() => records.find((r) => r.id === afterId) ?? null, [records, afterId]);

  const handleSingle = () => {
    if (!selected) {
      showToast('error', 'Select a record first.');
      return;
    }
    try {
      generateRecordReport(selected);
      showToast('success', 'PDF report generated.');
    } catch (e: any) {
      showToast('error', e?.message ?? 'Failed to generate PDF.');
    }
  };

  const handleComparison = () => {
    if (!before || !after) {
      showToast('error', 'Select both a Before and After record.');
      return;
    }
    try {
      generateComparisonReport(before, after);
      showToast('success', 'Comparison PDF generated.');
    } catch (e: any) {
      showToast('error', e?.message ?? 'Failed to generate PDF.');
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex items-center justify-center">
        <Spinner size="lg" label="Loading records…" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2.5">
          <FileText className="h-6 w-6 text-brand-500" /> Report
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Generate downloadable PDF reports including sample details, images, results, charts, alerts, date and time.
        </p>
      </div>

      {/* Report builder preview */}
      <GlassCard strong className="p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-glass-sm">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-display text-lg font-semibold text-slate-800 dark:text-white">Single Record Report</h2>
            <p className="text-xs text-slate-400">Complete PDF for one sample.</p>
          </div>
        </div>

        <label className="block mb-4">
          <span className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Select Record</span>
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="w-full rounded-xl bg-white/70 dark:bg-white/5 border border-slate-200/70 dark:border-white/10 px-4 py-2.5 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-400/60 transition-all"
          >
            <option value="">— Choose a record —</option>
            {records.map((r) => (
              <option key={r.id} value={r.id}>
                {r.sample_id} · {r.sample_type} · {r.test_date}
              </option>
            ))}
          </select>
        </label>

        {selected ? (
          <div className="rounded-xl bg-white/50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 p-5 mb-4 animate-fade-in">
            <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Hash className="h-4 w-4 text-slate-400" /> Sample ID: <span className="font-semibold text-slate-800 dark:text-white">{selected.sample_id}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Building2 className="h-4 w-4 text-slate-400" /> Type: <span className="font-semibold capitalize">{selected.sample_type}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Calendar className="h-4 w-4 text-slate-400" /> Date: <span className="font-semibold">{selected.test_date}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Clock className="h-4 w-4 text-slate-400" /> Time: <span className="font-semibold">{selected.test_time}</span>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
              <Mini label="pH" value={fmt(selected.ph_value, 2)} />
              <Mini label="COD" value={fmt(selected.estimated_cod, 0)} unit="mg/L" />
              <Mini label="BOD" value={fmt(selected.estimated_bod, 0)} unit="mg/L" />
              <Mini label="Eff." value={selected.filtration_efficiency != null ? `${selected.filtration_efficiency}%` : '—'} />
            </div>
            {selected.alerts.length > 0 && (
              <div className="mt-4">
                <p className="text-[11px] uppercase tracking-wider text-slate-400 font-medium mb-2 flex items-center gap-1.5">
                  <Bell className="h-3.5 w-3.5" /> Alerts included
                </p>
                <div className="grid sm:grid-cols-2 gap-2">
                  {selected.alerts.slice(0, 4).map((a) => <AlertCard key={a.id} alert={a} />)}
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-slate-400 py-6 text-center">Select a record to preview the report contents.</p>
        )}

        <div className="flex justify-end">
          <Button onClick={handleSingle} disabled={!selected} leftIcon={<Download className="h-4 w-4" />}>
            Generate PDF
          </Button>
        </div>
      </GlassCard>

      {/* What's included */}
      <GlassCard className="p-6">
        <h2 className="font-display text-base font-semibold text-slate-800 dark:text-white mb-3">Report Includes</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { icon: Building2, label: 'Institution Logo Placeholder' },
            { icon: Hash, label: 'Sample Details' },
            { icon: ImageIcon, label: 'Uploaded Images' },
            { icon: BarChart3, label: 'Results & Charts' },
            { icon: ArrowRightLeft, label: 'Comparison (optional)' },
            { icon: Bell, label: 'Generated Alerts' },
            { icon: Calendar, label: 'Date' },
            { icon: Clock, label: 'Time' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-center gap-2.5 rounded-lg bg-white/40 dark:bg-white/5 px-3 py-2.5">
                <Icon className="h-4 w-4 text-brand-500" />
                <span className="text-sm text-slate-600 dark:text-slate-300">{item.label}</span>
              </div>
            );
          })}
        </div>
      </GlassCard>

      {/* Comparison report */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-aqua-500 to-aqua-700 text-white shadow-glass-sm">
            <ArrowRightLeft className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-display text-lg font-semibold text-slate-800 dark:text-white">Comparison Report</h2>
            <p className="text-xs text-slate-400">Before vs After PDF with table and improvement metrics.</p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <label className="block">
            <span className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Before Record</span>
            <select
              value={beforeId}
              onChange={(e) => setBeforeId(e.target.value)}
              className="w-full rounded-xl bg-white/70 dark:bg-white/5 border border-slate-200/70 dark:border-white/10 px-4 py-2.5 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-400/60"
            >
              <option value="">— Select —</option>
              {beforeRecords.map((r) => (
                <option key={r.id} value={r.id}>{r.sample_id} · {r.test_date}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">After Record</span>
            <select
              value={afterId}
              onChange={(e) => setAfterId(e.target.value)}
              className="w-full rounded-xl bg-white/70 dark:bg-white/5 border border-slate-200/70 dark:border-white/10 px-4 py-2.5 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-400/60"
            >
              <option value="">— Select —</option>
              {afterRecords.map((r) => (
                <option key={r.id} value={r.id}>{r.sample_id} · {r.test_date}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="flex justify-end">
          <Button
            variant="secondary"
            onClick={handleComparison}
            disabled={!before || !after}
            leftIcon={<FileDown className="h-4 w-4" />}
          >
            Generate Comparison PDF
          </Button>
        </div>
      </GlassCard>
    </div>
  );
}

function Mini({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div className="rounded-lg bg-white/60 dark:bg-white/5 py-2">
      <p className="text-[10px] uppercase tracking-wider text-slate-400">{label}</p>
      <p className="text-sm font-bold text-slate-800 dark:text-white">
        {value}
        {unit && <span className="ml-0.5 text-[10px] text-slate-400">{unit}</span>}
      </p>
    </div>
  );
}
