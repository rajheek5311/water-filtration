import type {
  EstimatedParameters,
  FilterPaperResult,
  ManualInputs,
  PHResult,
  SampleType,
  WaterSampleResult,
} from '@/lib/types';

// Heuristic estimators for COD, BOD, filtration efficiency and overall quality.
// These are intentionally simplified regression-like models combining the
// measured / estimated inputs. Swap for calibrated models later without
// touching the UI.

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

export function estimateCOD(
  ph: PHResult | null,
  water: WaterSampleResult | null,
  manual: ManualInputs
): number {
  let cod = 220; // baseline mg/L for raw textile wastewater
  if (ph) cod += Math.abs(ph.phValue - 7) * 18;
  if (water) cod += water.colorIntensity * 1.4;
  if (manual.turbidity != null) cod += manual.turbidity * 2.2;
  if (manual.electricalConductivity != null) cod += manual.electricalConductivity * 0.02;
  if (manual.temperature != null) cod += (manual.temperature - 25) * 1.5;
  return Math.round(clamp(cod, 20, 1200));
}

export function estimateBOD(cod: number, manual: ManualInputs): number {
  // BOD is typically 0.2–0.45 of COD for textile effluent.
  let bod = cod * (0.28 + (manual.temperature != null ? (manual.temperature - 25) * 0.004 : 0));
  if (manual.dissolvedOxygen != null && manual.dissolvedOxygen < 4) bod *= 1.15;
  return Math.round(clamp(bod, 5, 500));
}

// Efficiency is only meaningful for an "after" sample compared against assumed
// raw baselines. For a "before" sample we return null.
export function estimateEfficiency(
  sampleType: SampleType | null,
  ph: PHResult | null,
  water: WaterSampleResult | null,
  filter: FilterPaperResult | null,
  manual: ManualInputs,
  cod: number
): number | null {
  if (sampleType !== 'after') return null;
  // Start at a high baseline and subtract penalties.
  let eff = 92;
  if (water) eff -= water.colorIntensity * 0.25;
  if (manual.turbidity != null) eff -= manual.turbidity * 0.4;
  if (filter) eff -= Math.min(20, filter.microfiberCount * 0.015);
  if (ph) eff -= Math.abs(ph.phValue - 7) * 1.2;
  eff -= Math.max(0, cod - 100) * 0.05;
  if (manual.pressureDrop != null) eff -= Math.max(0, manual.pressureDrop - 15) * 0.3;
  return Math.round(clamp(eff, 0, 99));
}

export function overallQualityLabel(
  efficiency: number | null,
  cod: number,
  bod: number,
  ph: PHResult | null,
  manual: ManualInputs
): string {
  let score = 60;
  if (efficiency != null) score = (score + efficiency) / 2;
  if (ph) score -= Math.abs(ph.phValue - 7) * 4;
  if (manual.turbidity != null) score -= manual.turbidity * 0.5;
  score -= Math.max(0, cod - 100) * 0.1;
  score -= Math.max(0, bod - 20) * 0.4;
  if (score >= 75) return 'Good';
  if (score >= 50) return 'Moderate';
  if (score >= 30) return 'Poor';
  return 'Critical';
}

export function computeEstimatedParameters(input: {
  sampleType: SampleType | null;
  ph: PHResult | null;
  water: WaterSampleResult | null;
  filter: FilterPaperResult | null;
  manual: ManualInputs;
}): EstimatedParameters {
  const { sampleType, ph, water, filter, manual } = input;
  const cod = estimateCOD(ph, water, manual);
  const bod = estimateBOD(cod, manual);
  const efficiency = estimateEfficiency(sampleType, ph, water, filter, manual, cod);
  const quality = overallQualityLabel(efficiency, cod, bod, ph, manual);
  return {
    estimatedCOD: cod,
    estimatedBOD: bod,
    filtrationEfficiency: efficiency,
    overallQuality: quality,
  };
}

// Generate a human-readable sample ID, e.g. TWF-20260721-001.
export function generateSampleId(date: Date, seq: number): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `TWF-${y}${m}${d}-${String(seq).padStart(3, '0')}`;
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function nowTime(): string {
  return new Date().toTimeString().slice(0, 8);
}
