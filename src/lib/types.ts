// Domain types shared across the application.

export type SampleType = 'before' | 'after';

export type AlertLevel = 'green' | 'yellow' | 'red';

export interface AlertItem {
  id: string;
  level: AlertLevel;
  title: string;
  message: string;
}

// Results returned by the (dummy) image analysis modules.
export interface PHResult {
  phValue: number;
  confidence: number; // 0..1
}

export interface WaterSampleResult {
  waterColor: string;
  dyeCategory: string;
  colorIntensity: number; // 0..100
  rgb: { r: number; g: number; b: number };
}

export interface FilterPaperResult {
  microfiberCount: number;
  fiberDensity: number; // fibers / mm^2
  averageFiberLength: number; // µm
}

export interface ManualInputs {
  temperature: number | null; // °C
  turbidity: number | null; // NTU
  flowRate: number | null; // L/min
  waterLevel: number | null; // cm
  pressureDrop: number | null; // kPa
  electricalConductivity: number | null; // µS/cm
  dissolvedOxygen: number | null; // mg/L
}

export interface EstimatedParameters {
  estimatedCOD: number | null; // mg/L
  estimatedBOD: number | null; // mg/L
  filtrationEfficiency: number | null; // %
  overallQuality: string;
}

// Full record persisted to the database.
export interface FiltrationRecord {
  id: string;
  user_id?: string;
  sample_id: string;
  sample_type: SampleType;
  test_date: string;
  test_time: string;
  ph_value: number | null;
  ph_confidence: number | null;
  ph_strip_image: string | null;
  water_color: string | null;
  dye_category: string | null;
  color_intensity: number | null;
  water_sample_image: string | null;
  microfiber_count: number | null;
  fiber_density: number | null;
  average_fiber_length: number | null;
  filter_paper_image: string | null;
  temperature: number | null;
  turbidity: number | null;
  flow_rate: number | null;
  water_level: number | null;
  pressure_drop: number | null;
  electrical_conductivity: number | null;
  dissolved_oxygen: number | null;
  estimated_cod: number | null;
  estimated_bod: number | null;
  filtration_efficiency: number | null;
  overall_quality: string | null;
  alerts: AlertItem[];
  notes: string | null;
  created_at?: string;
}

// Working state used inside the New Test flow before saving.
export interface TestFormState {
  sampleType: SampleType | null;
  phStripImage: string | null;
  phResult: PHResult | null;
  waterSampleImage: string | null;
  waterSampleResult: WaterSampleResult | null;
  filterPaperImage: string | null;
  filterPaperResult: FilterPaperResult | null;
  manual: ManualInputs;
  estimated: EstimatedParameters;
  alerts: AlertItem[];
  notes: string;
}
