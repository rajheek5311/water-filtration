import type { FiltrationRecord } from '@/lib/types';

function avg(values: (number | null)[]): number | null {
  const valid = values.filter((v): v is number => v != null && !Number.isNaN(v));
  if (valid.length === 0) return null;
  return valid.reduce((s, v) => s + v, 0) / valid.length;
}

export interface DashboardStats {
  totalSamples: number;
  todayTests: number;
  avgPH: number | null;
  avgTemperature: number | null;
  avgTurbidity: number | null;
  avgMicrofiber: number | null;
  avgCOD: number | null;
  avgBOD: number | null;
  avgEfficiency: number | null;
}

export function computeDashboardStats(records: FiltrationRecord[]): DashboardStats {
  const today = new Date().toISOString().slice(0, 10);
  return {
    totalSamples: records.length,
    todayTests: records.filter((r) => r.test_date === today).length,
    avgPH: avg(records.map((r) => r.ph_value)),
    avgTemperature: avg(records.map((r) => r.temperature)),
    avgTurbidity: avg(records.map((r) => r.turbidity)),
    avgMicrofiber: avg(records.map((r) => r.microfiber_count)),
    avgCOD: avg(records.map((r) => r.estimated_cod)),
    avgBOD: avg(records.map((r) => r.estimated_bod)),
    avgEfficiency: avg(records.map((r) => r.filtration_efficiency)),
  };
}

export interface TrendPoint {
  label: string;
  value: number | null;
}

// Build a trend series (chronological) for a given field, using sample id as label.
export function buildTrend(
  records: FiltrationRecord[],
  key: keyof FiltrationRecord
): TrendPoint[] {
  return [...records]
    .sort((a, b) => (a.created_at ?? '').localeCompare(b.created_at ?? ''))
    .map((r) => ({
      label: r.sample_id.slice(-7),
      value: r[key] != null ? Number(r[key]) : null,
    }));
}

export function recentAlerts(records: FiltrationRecord[], limit = 6) {
  return records
    .flatMap((r) => r.alerts.map((a) => ({ ...a, sampleId: r.sample_id, date: r.test_date })))
    .slice(0, limit);
}

export function recentActivity(records: FiltrationRecord[], limit = 8) {
  return records.slice(0, limit).map((r) => ({
    id: r.id,
    sampleId: r.sample_id,
    type: r.sample_type,
    date: r.test_date,
    time: r.test_time,
    quality: r.overall_quality,
  }));
}
