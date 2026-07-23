import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table2,
  Search,
  Eye,
  Pencil,
  Trash2,
  Download,
  FileText,
  Plus,
  ArrowDownUp,
  X,
  Calendar,
  Hash,
  Filter,
} from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import Button from '@/components/Button';
import Spinner from '@/components/Spinner';
import Modal from '@/components/Modal';
import ConfirmDialog from '@/components/ConfirmDialog';
import QualityBadge from '@/components/QualityBadge';
import AlertCard from '@/components/AlertCard';
import { useToast } from '@/context/ToastContext';
import { listRecords, deleteRecord } from '@/lib/recordsService';
import { downloadCsv, downloadSingleRecordCsv } from '@/lib/exportCsv';
import { generateRecordReport } from '@/lib/pdfReport';
import type { FiltrationRecord } from '@/lib/types';

type SearchKey = 'all' | 'date' | 'sample_id' | 'before' | 'after';

const SEARCH_LABELS: { key: SearchKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'date', label: 'Date' },
  { key: 'sample_id', label: 'Sample ID' },
  { key: 'before', label: 'Before' },
  { key: 'after', label: 'After' },
];

function fmt(v: number | null | undefined, digits = 1): string {
  if (v == null) return '—';
  return v.toFixed(digits);
}

export default function Records() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [records, setRecords] = useState<FiltrationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [searchKey, setSearchKey] = useState<SearchKey>('all');
  const [viewing, setViewing] = useState<FiltrationRecord | null>(null);
  const [toDelete, setToDelete] = useState<FiltrationRecord | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await listRecords();
      setRecords(data);
    } catch (e: any) {
      showToast('error', e?.message ?? 'Failed to load records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return records;
    return records.filter((r) => {
      switch (searchKey) {
        case 'date':
          return r.test_date.toLowerCase().includes(q);
        case 'sample_id':
          return r.sample_id.toLowerCase().includes(q);
        case 'before':
          return r.sample_type === 'before' && (r.sample_id.toLowerCase().includes(q) || r.test_date.includes(q));
        case 'after':
          return r.sample_type === 'after' && (r.sample_id.toLowerCase().includes(q) || r.test_date.includes(q));
        default:
          return (
            r.sample_id.toLowerCase().includes(q) ||
            r.test_date.toLowerCase().includes(q) ||
            r.sample_type.includes(q) ||
            (r.water_color ?? '').toLowerCase().includes(q) ||
            (r.dye_category ?? '').toLowerCase().includes(q) ||
            (r.overall_quality ?? '').toLowerCase().includes(q)
          );
      }
    });
  }, [records, query, searchKey]);

  const handleDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await deleteRecord(toDelete.id);
      showToast('success', `Record ${toDelete.sample_id} deleted.`);
      setToDelete(null);
      setRecords((prev) => prev.filter((r) => r.id !== toDelete.id));
    } catch (e: any) {
      showToast('error', e?.message ?? 'Failed to delete record.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2.5">
            <Table2 className="h-6 w-6 text-brand-500" /> Records
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            All stored filtration tests. Search, view, edit, delete or export.
          </p>
        </div>
        <div className="flex gap-2.5">
          <Button variant="secondary" onClick={() => downloadCsv(filtered)} leftIcon={<Download className="h-4 w-4" />}>
            Export CSV
          </Button>
          <Button to="/new-test" leftIcon={<Plus className="h-4 w-4" />}>
            New Test
          </Button>
        </div>
      </div>

      {/* Search bar */}
      <GlassCard className="p-4">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search records…"
              className="w-full rounded-xl bg-white/70 dark:bg-white/5 border border-slate-200/70 dark:border-white/10 pl-10 pr-10 py-2.5 text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-400/60 transition-all"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-400 mr-1">
              <Filter className="h-3.5 w-3.5" /> Filter:
            </span>
            {SEARCH_LABELS.map((s) => (
              <button
                key={s.key}
                onClick={() => setSearchKey(s.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  searchKey === s.key
                    ? 'bg-brand-500 text-white shadow-glass-sm'
                    : 'bg-white/60 dark:bg-white/5 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-white/10 hover:bg-brand-50/60'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Records table */}
      <GlassCard className="p-0 overflow-hidden">
        {loading ? (
          <div className="py-20 flex items-center justify-center">
            <Spinner size="lg" label="Loading records…" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center">
            <Table2 className="h-10 w-10 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {records.length === 0 ? 'No records yet. Run a new test to get started.' : 'No records match your search.'}
            </p>
            {records.length === 0 && (
              <Button to="/new-test" className="mt-4" leftIcon={<Plus className="h-4 w-4" />}>
                New Test
              </Button>
            )}
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200/60 dark:border-white/10 text-left text-xs uppercase tracking-wider text-slate-400">
                    <th className="px-5 py-3 font-medium">Sample ID</th>
                    <th className="px-5 py-3 font-medium">Type</th>
                    <th className="px-5 py-3 font-medium">Date</th>
                    <th className="px-5 py-3 font-medium">pH</th>
                    <th className="px-5 py-3 font-medium">Turbidity</th>
                    <th className="px-5 py-3 font-medium">Efficiency</th>
                    <th className="px-5 py-3 font-medium">Quality</th>
                    <th className="px-5 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => (
                    <tr
                      key={r.id}
                      className="border-b border-slate-100/60 dark:border-white/5 hover:bg-brand-50/30 dark:hover:bg-white/5 transition-colors"
                    >
                      <td className="px-5 py-3 font-mono text-xs font-semibold text-slate-700 dark:text-slate-200">
                        {r.sample_id}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                            r.sample_type === 'before'
                              ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300'
                              : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'
                          }`}
                        >
                          {r.sample_type === 'before' ? 'Before' : 'After'}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-slate-600 dark:text-slate-300 text-xs">{r.test_date}</td>
                      <td className="px-5 py-3 text-slate-700 dark:text-slate-200">{fmt(r.ph_value, 2)}</td>
                      <td className="px-5 py-3 text-slate-700 dark:text-slate-200">{fmt(r.turbidity)}</td>
                      <td className="px-5 py-3 text-slate-700 dark:text-slate-200">
                        {r.filtration_efficiency != null ? `${r.filtration_efficiency}%` : '—'}
                      </td>
                      <td className="px-5 py-3">
                        <QualityBadge quality={r.overall_quality} size="sm" />
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setViewing(r)}
                            className="p-1.5 rounded-lg text-slate-500 hover:bg-brand-100 dark:hover:bg-brand-500/20 hover:text-brand-600 dark:hover:text-brand-300 transition-colors"
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => navigate(`/new-test/${r.id}`)}
                            className="p-1.5 rounded-lg text-slate-500 hover:bg-amber-100 dark:hover:bg-amber-500/20 hover:text-amber-600 dark:hover:text-amber-300 transition-colors"
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => generateRecordReport(r)}
                            className="p-1.5 rounded-lg text-slate-500 hover:bg-brand-100 dark:hover:bg-brand-500/20 hover:text-brand-600 dark:hover:text-brand-300 transition-colors"
                            title="PDF Report"
                          >
                            <FileText className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => downloadSingleRecordCsv(r)}
                            className="p-1.5 rounded-lg text-slate-500 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 hover:text-emerald-600 dark:hover:text-emerald-300 transition-colors"
                            title="Export CSV"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setToDelete(r)}
                            className="p-1.5 rounded-lg text-slate-500 hover:bg-rose-100 dark:hover:bg-rose-500/20 hover:text-rose-600 dark:hover:text-rose-300 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="lg:hidden divide-y divide-slate-100/60 dark:divide-white/5">
              {filtered.map((r) => (
                <div key={r.id} className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-200">{r.sample_id}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            r.sample_type === 'before'
                              ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300'
                              : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'
                          }`}
                        >
                          {r.sample_type === 'before' ? 'Before' : 'After'}
                        </span>
                        <span className="text-[11px] text-slate-400">{r.test_date}</span>
                      </div>
                    </div>
                    <QualityBadge quality={r.overall_quality} size="sm" />
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-3 text-center">
                    <div className="rounded-lg bg-white/50 dark:bg-white/5 py-1.5">
                      <p className="text-[10px] text-slate-400">pH</p>
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">{fmt(r.ph_value, 2)}</p>
                    </div>
                    <div className="rounded-lg bg-white/50 dark:bg-white/5 py-1.5">
                      <p className="text-[10px] text-slate-400">Turb</p>
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">{fmt(r.turbidity)}</p>
                    </div>
                    <div className="rounded-lg bg-white/50 dark:bg-white/5 py-1.5">
                      <p className="text-[10px] text-slate-400">Eff</p>
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                        {r.filtration_efficiency != null ? `${r.filtration_efficiency}%` : '—'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-1 mt-3">
                    <button onClick={() => setViewing(r)} className="p-2 rounded-lg text-slate-500 hover:bg-brand-100 dark:hover:bg-brand-500/20" title="View">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button onClick={() => navigate(`/new-test/${r.id}`)} className="p-2 rounded-lg text-slate-500 hover:bg-amber-100 dark:hover:bg-amber-500/20" title="Edit">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={() => generateRecordReport(r)} className="p-2 rounded-lg text-slate-500 hover:bg-brand-100 dark:hover:bg-brand-500/20" title="Report">
                      <FileText className="h-4 w-4" />
                    </button>
                    <button onClick={() => downloadSingleRecordCsv(r)} className="p-2 rounded-lg text-slate-500 hover:bg-emerald-100 dark:hover:bg-emerald-500/20" title="Export">
                      <Download className="h-4 w-4" />
                    </button>
                    <button onClick={() => setToDelete(r)} className="p-2 rounded-lg text-slate-500 hover:bg-rose-100 dark:hover:bg-rose-500/20" title="Delete">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </GlassCard>

      <p className="text-xs text-slate-400 text-center">
        Showing {filtered.length} of {records.length} records
      </p>

      {/* View modal */}
      <Modal
        open={!!viewing}
        onClose={() => setViewing(null)}
        title={viewing ? `Record ${viewing.sample_id}` : ''}
        size="xl"
        footer={
          <>
            <Button variant="ghost" onClick={() => setViewing(null)}>Close</Button>
            {viewing && (
              <Button onClick={() => generateRecordReport(viewing)} leftIcon={<FileText className="h-4 w-4" />}>
                Download PDF
              </Button>
            )}
          </>
        }
      >
        {viewing && <RecordDetail record={viewing} />}
      </Modal>

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!toDelete}
        title="Delete Record"
        message={`Are you sure you want to permanently delete record ${toDelete?.sample_id}? This cannot be undone.`}
        confirmLabel="Delete"
        danger
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />
      {deleting && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/30 backdrop-blur-sm">
          <Spinner label="Deleting…" />
        </div>
      )}
    </div>
  );
}

function RecordDetail({ record }: { record: FiltrationRecord }) {
  const images = [
    { src: record.ph_strip_image, label: 'pH Strip' },
    { src: record.water_sample_image, label: 'Water Sample' },
    { src: record.filter_paper_image, label: 'Filter Paper' },
  ].filter((i) => i.src);

  const rows: [string, string][] = [
    ['Sample ID', record.sample_id],
    ['Type', record.sample_type === 'before' ? 'Before Filtration' : 'After Filtration'],
    ['Date', record.test_date],
    ['Time', record.test_time],
    ['pH Value', fmt(record.ph_value, 2)],
    ['pH Confidence', record.ph_confidence != null ? `${(record.ph_confidence * 100).toFixed(0)}%` : '—'],
    ['Water Colour', record.water_color ?? '—'],
    ['Dye Category', record.dye_category ?? '—'],
    ['Colour Intensity', record.color_intensity != null ? String(record.color_intensity) : '—'],
    ['Microfiber Count', record.microfiber_count != null ? String(record.microfiber_count) : '—'],
    ['Fiber Density', record.fiber_density != null ? `${record.fiber_density} /mm²` : '—'],
    ['Avg Fiber Length', record.average_fiber_length != null ? `${record.average_fiber_length} µm` : '—'],
    ['Temperature', `${fmt(record.temperature)} °C`],
    ['Turbidity', `${fmt(record.turbidity)} NTU`],
    ['Flow Rate', `${fmt(record.flow_rate)} L/min`],
    ['Water Level', `${fmt(record.water_level)} cm`],
    ['Pressure Drop', `${fmt(record.pressure_drop)} kPa`],
    ['Electrical Conductivity', `${fmt(record.electrical_conductivity, 0)} µS/cm`],
    ['Dissolved Oxygen', `${fmt(record.dissolved_oxygen)} mg/L`],
    ['Estimated COD', `${fmt(record.estimated_cod, 0)} mg/L`],
    ['Estimated BOD', `${fmt(record.estimated_bod, 0)} mg/L`],
    ['Filtration Efficiency', record.filtration_efficiency != null ? `${record.filtration_efficiency}%` : '—'],
    ['Overall Quality', record.overall_quality ?? '—'],
  ];

  return (
    <div className="space-y-5">
      {images.length > 0 && (
        <div className="grid sm:grid-cols-3 gap-3">
          {images.map((img) => (
            <div key={img.label}>
              <p className="text-[11px] uppercase tracking-wider text-slate-400 font-medium mb-1.5">{img.label}</p>
              <img src={img.src!} alt={img.label} className="w-full h-32 object-cover rounded-lg border border-slate-200/60 dark:border-white/10" />
            </div>
          ))}
        </div>
      )}
      <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between py-1.5 border-b border-slate-100/60 dark:border-white/5">
            <span className="text-xs text-slate-500 dark:text-slate-400">{label}</span>
            <span className="text-sm font-semibold text-slate-800 dark:text-white">{value}</span>
          </div>
        ))}
      </div>
      {record.notes && (
        <div>
          <p className="text-[11px] uppercase tracking-wider text-slate-400 font-medium mb-1.5">Notes</p>
          <p className="text-sm text-slate-700 dark:text-slate-200 bg-white/50 dark:bg-white/5 rounded-lg p-3">{record.notes}</p>
        </div>
      )}
      <div>
        <p className="text-[11px] uppercase tracking-wider text-slate-400 font-medium mb-2">Alerts</p>
        <div className="grid sm:grid-cols-2 gap-2">
          {record.alerts.length === 0 ? (
            <p className="text-sm text-slate-400">No alerts.</p>
          ) : (
            record.alerts.map((a) => <AlertCard key={a.id} alert={a} />)
          )}
        </div>
      </div>
    </div>
  );
}
