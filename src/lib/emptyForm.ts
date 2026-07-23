import type { TestFormState } from '@/lib/types';

export const emptyForm: TestFormState = {
  sampleType: null,
  phStripImage: null,
  phResult: null,
  waterSampleImage: null,
  waterSampleResult: null,
  filterPaperImage: null,
  filterPaperResult: null,
  manual: {
    temperature: null,
    turbidity: null,
    flowRate: null,
    waterLevel: null,
    pressureDrop: null,
    electricalConductivity: null,
    dissolvedOxygen: null,
  },
  estimated: {
    estimatedCOD: null,
    estimatedBOD: null,
    filtrationEfficiency: null,
    overallQuality: '—',
  },
  alerts: [],
  notes: '',
};

import type { FiltrationRecord } from '@/lib/types';

export function recordToForm(r: FiltrationRecord): TestFormState {
  return {
    sampleType: r.sample_type,
    phStripImage: r.ph_strip_image,
    phResult:
      r.ph_value != null
        ? { phValue: r.ph_value, confidence: r.ph_confidence ?? 0.9 }
        : null,
    waterSampleImage: r.water_sample_image,
    waterSampleResult:
      r.water_color != null
        ? {
            waterColor: r.water_color,
            dyeCategory: r.dye_category ?? 'Unidentified',
            colorIntensity: r.color_intensity ?? 0,
            rgb: { r: 0, g: 0, b: 0 },
          }
        : null,
    filterPaperImage: r.filter_paper_image,
    filterPaperResult:
      r.microfiber_count != null
        ? {
            microfiberCount: r.microfiber_count,
            fiberDensity: r.fiber_density ?? 0,
            averageFiberLength: r.average_fiber_length ?? 0,
          }
        : null,
    manual: {
      temperature: r.temperature,
      turbidity: r.turbidity,
      flowRate: r.flow_rate,
      waterLevel: r.water_level,
      pressureDrop: r.pressure_drop,
      electricalConductivity: r.electrical_conductivity,
      dissolvedOxygen: r.dissolved_oxygen,
    },
    estimated: {
      estimatedCOD: r.estimated_cod,
      estimatedBOD: r.estimated_bod,
      filtrationEfficiency: r.filtration_efficiency,
      overallQuality: r.overall_quality ?? '—',
    },
    alerts: r.alerts ?? [],
    notes: r.notes ?? '',
  };
}
