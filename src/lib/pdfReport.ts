import jsPDF from 'jspdf';
import type { FiltrationRecord } from '@/lib/types';

const BRAND: [number, number, number] = [28, 106, 242];
const DARK: [number, number, number] = [20, 38, 87];
const GREY: [number, number, number] = [90, 110, 140];

function alertColor(level: string): [number, number, number] {
  if (level === 'red') return [220, 38, 38];
  if (level === 'yellow') return [202, 138, 4];
  return [22, 163, 74];
}

function ensureRoom(doc: jsPDF, y: number, needed = 20): number {
  if (y + needed > 280) {
    doc.addPage();
    return 20;
  }
  return y;
}

function sectionHeader(doc: jsPDF, text: string, y: number): number {
  y = ensureRoom(doc, y, 16);
  doc.setFillColor(...BRAND);
  doc.rect(14, y - 4, 182, 0.8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...DARK);
  doc.text(text, 14, y + 4);
  return y + 12;
}

function kvRow(doc: jsPDF, label: string, value: string, y: number): number {
  y = ensureRoom(doc, y, 8);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(...GREY);
  doc.text(label, 16, y);
  doc.setTextColor(...DARK);
  doc.setFont('helvetica', 'bold');
  doc.text(value, 90, y);
  return y + 7;
}

function tryImage(doc: jsPDF, dataUrl: string | null, title: string, y: number): number {
  if (!dataUrl) return y;
  y = ensureRoom(doc, y, 70);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...GREY);
  doc.text(title, 16, y);
  try {
    doc.addImage(dataUrl, 'JPEG', 16, y + 3, 60, 45, undefined, 'FAST');
  } catch {
    doc.setTextColor(200, 80, 80);
    doc.text('[image unavailable]', 80, y + 26);
  }
  return y + 52;
}

function simpleBar(
  doc: jsPDF,
  title: string,
  value: number,
  max: number,
  y: number,
  color: [number, number, number] = BRAND
): number {
  y = ensureRoom(doc, y, 16);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...GREY);
  doc.text(title, 16, y);
  doc.setTextColor(...DARK);
  doc.setFont('helvetica', 'bold');
  doc.text(String(value.toFixed(1)), 160, y);
  const barY = y + 3;
  const barW = 140;
  doc.setFillColor(230, 235, 245);
  doc.rect(16, barY, barW, 4, 'F');
  const filled = Math.min(barW, (value / max) * barW);
  doc.setFillColor(...color);
  doc.rect(16, barY, filled, 4, 'F');
  return y + 12;
}

export function generateRecordReport(record: FiltrationRecord): void {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  let y = 18;

  // Header band
  doc.setFillColor(...BRAND);
  doc.rect(0, 0, 210, 28, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text('Smart Textile Water Filtration Monitoring System', 14, 12);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Wastewater Filtration Test Report', 14, 19);

  // Institution logo placeholder (top-right)
  doc.setDrawColor(255, 255, 255);
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(168, 6, 30, 16, 2, 2, 'S');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7);
  doc.text('INSTITUTION', 183, 14, { align: 'center' });
  doc.text('LOGO', 183, 18, { align: 'center' });

  y = 40;

  // Sample details
  y = sectionHeader(doc, 'Sample Details', y);
  y = kvRow(doc, 'Sample ID', record.sample_id, y);
  y = kvRow(doc, 'Type', record.sample_type === 'before' ? 'Before Filtration' : 'After Filtration', y);
  y = kvRow(doc, 'Date', record.test_date, y);
  y = kvRow(doc, 'Time', record.test_time, y);
  y = kvRow(doc, 'Overall Quality', record.overall_quality ?? '-', y);
  y += 4;

  // Uploaded images
  y = sectionHeader(doc, 'Uploaded Images', y);
  const imgY = y;
  y = tryImage(doc, record.ph_strip_image, 'pH Strip', imgY);
  y = tryImage(doc, record.water_sample_image, 'Water Sample', y);
  y = tryImage(doc, record.filter_paper_image, 'Filter Paper', y);
  y += 2;

  // Results — image-derived
  y = sectionHeader(doc, 'Image-Derived Results', y);
  y = kvRow(doc, 'pH Value', String(record.ph_value ?? '-'), y);
  y = kvRow(doc, 'pH Confidence', record.ph_confidence != null ? `${(record.ph_confidence * 100).toFixed(0)}%` : '-', y);
  y = kvRow(doc, 'Water Colour', record.water_color ?? '-', y);
  y = kvRow(doc, 'Dye Category', record.dye_category ?? '-', y);
  y = kvRow(doc, 'Colour Intensity', record.color_intensity != null ? `${record.color_intensity}` : '-', y);
  y = kvRow(doc, 'Microfiber Count', String(record.microfiber_count ?? '-'), y);
  y = kvRow(doc, 'Fiber Density', record.fiber_density != null ? `${record.fiber_density} /mm²` : '-', y);
  y = kvRow(doc, 'Avg Fiber Length', record.average_fiber_length != null ? `${record.average_fiber_length} µm` : '-', y);
  y += 4;

  // Manual inputs
  y = sectionHeader(doc, 'Manual Measurements', y);
  y = kvRow(doc, 'Temperature (°C)', String(record.temperature ?? '-'), y);
  y = kvRow(doc, 'Turbidity (NTU)', String(record.turbidity ?? '-'), y);
  y = kvRow(doc, 'Flow Rate (L/min)', String(record.flow_rate ?? '-'), y);
  y = kvRow(doc, 'Water Level (cm)', String(record.water_level ?? '-'), y);
  y = kvRow(doc, 'Pressure Drop (kPa)', String(record.pressure_drop ?? '-'), y);
  y = kvRow(doc, 'EC (µS/cm)', String(record.electrical_conductivity ?? '-'), y);
  y = kvRow(doc, 'DO (mg/L)', String(record.dissolved_oxygen ?? '-'), y);
  y += 4;

  // Estimated parameters with mini bars
  y = sectionHeader(doc, 'Estimated Parameters', y);
  if (record.estimated_cod != null) y = simpleBar(doc, 'Estimated COD (mg/L)', record.estimated_cod, 1000, y, [220, 38, 38]);
  if (record.estimated_bod != null) y = simpleBar(doc, 'Estimated BOD (mg/L)', record.estimated_bod, 400, y, [202, 138, 4]);
  if (record.filtration_efficiency != null)
    y = simpleBar(doc, 'Filtration Efficiency (%)', record.filtration_efficiency, 100, y, [22, 163, 74]);
  y += 2;

  // Alerts
  y = sectionHeader(doc, 'Alerts', y);
  if (record.alerts && record.alerts.length) {
    for (const a of record.alerts) {
      y = ensureRoom(doc, y, 14);
      doc.setFillColor(...alertColor(a.level));
      doc.rect(16, y - 3, 2.5, 6, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(...DARK);
      doc.text(a.title, 22, y + 1);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(...GREY);
      const lines = doc.splitTextToSize(a.message, 170);
      doc.text(lines, 22, y + 6);
      y += 6 + lines.length * 4 + 3;
    }
  } else {
    doc.setFontSize(10);
    doc.setTextColor(...GREY);
    doc.text('No alerts generated.', 16, y);
    y += 8;
  }

  // Footer
  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(...GREY);
    doc.text(
      `Generated ${new Date().toLocaleString()}  •  Page ${i} of ${pages}`,
      105,
      290,
      { align: 'center' }
    );
  }

  doc.save(`${record.sample_id}_report.pdf`);
}

// Comparison report covering a before + after pair.
export function generateComparisonReport(before: FiltrationRecord, after: FiltrationRecord): void {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  let y = 18;
  doc.setFillColor(...BRAND);
  doc.rect(0, 0, 210, 28, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text('Filtration Comparison Report', 14, 12);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Before ${before.sample_id}  vs  After ${after.sample_id}`, 14, 19);
  y = 40;

  y = sectionHeader(doc, 'Comparison Table', y);
  const rows: [string, number | null, number | null][] = [
    ['pH', before.ph_value, after.ph_value],
    ['Turbidity (NTU)', before.turbidity, after.turbidity],
    ['Temperature (°C)', before.temperature, after.temperature],
    ['Flow Rate (L/min)', before.flow_rate, after.flow_rate],
    ['Pressure Drop (kPa)', before.pressure_drop, after.pressure_drop],
    ['EC (µS/cm)', before.electrical_conductivity, after.electrical_conductivity],
    ['DO (mg/L)', before.dissolved_oxygen, after.dissolved_oxygen],
    ['Microfiber Count', before.microfiber_count, after.microfiber_count],
    ['Est COD (mg/L)', before.estimated_cod, after.estimated_cod],
    ['Est BOD (mg/L)', before.estimated_bod, after.estimated_bod],
    ['Filtration Eff. (%)', before.filtration_efficiency, after.filtration_efficiency],
  ];

  // Table header
  doc.setFillColor(240, 245, 255);
  doc.rect(14, y - 4, 182, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...DARK);
  doc.text('Parameter', 16, y + 1);
  doc.text('Before', 110, y + 1, { align: 'right' });
  doc.text('After', 140, y + 1, { align: 'right' });
  doc.text('Diff', 170, y + 1, { align: 'right' });
  doc.text('Improvement %', 194, y + 1, { align: 'right' });
  y += 8;

  doc.setFont('helvetica', 'normal');
  for (const [label, b, a] of rows) {
    y = ensureRoom(doc, y, 8);
    doc.setTextColor(...GREY);
    doc.text(label, 16, y);
    doc.setTextColor(...DARK);
    doc.text(b != null ? b.toFixed(2) : '-', 110, y, { align: 'right' });
    doc.text(a != null ? a.toFixed(2) : '-', 140, y, { align: 'right' });
    const diff = b != null && a != null ? a - b : null;
    doc.text(diff != null ? diff.toFixed(2) : '-', 170, y, { align: 'right' });
    const imp = b != null && a != null && b !== 0 ? ((b - a) / Math.abs(b)) * 100 : null;
    doc.text(imp != null ? `${imp.toFixed(1)}%` : '-', 194, y, { align: 'right' });
    y += 7;
  }

  doc.save(`comparison_${before.sample_id}_vs_${after.sample_id}.pdf`);
}
