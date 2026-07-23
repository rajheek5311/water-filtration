import type { FiltrationRecord } from '@/lib/types';

const COLUMNS: { key: keyof FiltrationRecord; label: string }[] = [
  { key: 'sample_id', label: 'Sample ID' },
  { key: 'sample_type', label: 'Type' },
  { key: 'test_date', label: 'Date' },
  { key: 'test_time', label: 'Time' },
  { key: 'ph_value', label: 'pH' },
  { key: 'ph_confidence', label: 'pH Confidence' },
  { key: 'water_color', label: 'Water Colour' },
  { key: 'dye_category', label: 'Dye Category' },
  { key: 'color_intensity', label: 'Colour Intensity' },
  { key: 'microfiber_count', label: 'Microfiber Count' },
  { key: 'fiber_density', label: 'Fiber Density' },
  { key: 'average_fiber_length', label: 'Avg Fiber Length (µm)' },
  { key: 'temperature', label: 'Temp (°C)' },
  { key: 'turbidity', label: 'Turbidity (NTU)' },
  { key: 'flow_rate', label: 'Flow Rate (L/min)' },
  { key: 'water_level', label: 'Water Level (cm)' },
  { key: 'pressure_drop', label: 'Pressure Drop (kPa)' },
  { key: 'electrical_conductivity', label: 'EC (µS/cm)' },
  { key: 'dissolved_oxygen', label: 'DO (mg/L)' },
  { key: 'estimated_cod', label: 'Est COD (mg/L)' },
  { key: 'estimated_bod', label: 'Est BOD (mg/L)' },
  { key: 'filtration_efficiency', label: 'Filtration Efficiency %' },
  { key: 'overall_quality', label: 'Overall Quality' },
];

function csvEscape(value: unknown): string {
  if (value == null) return '';
  const s = String(value);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export function recordsToCsv(records: FiltrationRecord[]): string {
  const header = COLUMNS.map((c) => c.label).join(',');
  const rows = records.map((r) => COLUMNS.map((c) => csvEscape(r[c.key])).join(','));
  return [header, ...rows].join('\n');
}

export function downloadCsv(records: FiltrationRecord[], filename = 'filtration_records.csv'): void {
  const csv = recordsToCsv(records);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadSingleRecordCsv(record: FiltrationRecord): void {
  downloadCsv([record], `${record.sample_id}.csv`);
}
