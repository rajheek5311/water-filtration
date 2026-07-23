import { supabase } from '@/lib/supabase';
import type { FiltrationRecord, SampleType, TestFormState } from '@/lib/types';
import { generateSampleId, nowTime, todayISO } from '@/lib/calculations';

const TABLE = 'filtration_records';

// Convert the in-progress TestFormState into a row ready for insert.
function formToRow(form: TestFormState, sampleId: string): Omit<FiltrationRecord, 'id' | 'created_at' | 'user_id'> {
  return {
    sample_id: sampleId,
    sample_type: form.sampleType as SampleType,
    test_date: todayISO(),
    test_time: nowTime(),
    ph_value: form.phResult?.phValue ?? null,
    ph_confidence: form.phResult?.confidence ?? null,
    ph_strip_image: form.phStripImage,
    water_color: form.waterSampleResult?.waterColor ?? null,
    dye_category: form.waterSampleResult?.dyeCategory ?? null,
    color_intensity: form.waterSampleResult?.colorIntensity ?? null,
    water_sample_image: form.waterSampleImage,
    microfiber_count: form.filterPaperResult?.microfiberCount ?? null,
    fiber_density: form.filterPaperResult?.fiberDensity ?? null,
    average_fiber_length: form.filterPaperResult?.averageFiberLength ?? null,
    filter_paper_image: form.filterPaperImage,
    temperature: form.manual.temperature,
    turbidity: form.manual.turbidity,
    flow_rate: form.manual.flowRate,
    water_level: form.manual.waterLevel,
    pressure_drop: form.manual.pressureDrop,
    electrical_conductivity: form.manual.electricalConductivity,
    dissolved_oxygen: form.manual.dissolvedOxygen,
    estimated_cod: form.estimated.estimatedCOD,
    estimated_bod: form.estimated.estimatedBOD,
    filtration_efficiency: form.estimated.filtrationEfficiency,
    overall_quality: form.estimated.overallQuality,
    alerts: form.alerts,
    notes: form.notes || null,
  };
}

function rowToRecord(r: any): FiltrationRecord {
  return { ...r, alerts: Array.isArray(r.alerts) ? r.alerts : [] } as FiltrationRecord;
}

export async function countRecords(): Promise<number> {
  const { count, error } = await supabase
    .from(TABLE)
    .select('*', { count: 'exact', head: true });
  if (error) throw error;
  return count ?? 0;
}

export async function saveRecord(form: TestFormState): Promise<FiltrationRecord> {
  const existing = await countRecords();
  const sampleId = generateSampleId(new Date(), existing + 1);
  const row = formToRow(form, sampleId);
  const { data, error } = await supabase.from(TABLE).insert(row).select().single();
  if (error) throw error;
  return rowToRecord(data);
}

export async function updateRecord(id: string, form: TestFormState): Promise<FiltrationRecord> {
  const row = formToRow(form, form.sampleType ? '' : '');
  // Keep the original sample id and timestamp on edit.
  const { sample_id, test_date, test_time, ...updates } = row;
  void sample_id;
  void test_date;
  void test_time;
  const { data, error } = await supabase
    .from(TABLE)
    .update({ ...updates, sample_type: form.sampleType })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return rowToRecord(data);
}

export async function listRecords(): Promise<FiltrationRecord[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(rowToRecord);
}

export async function getRecord(id: string): Promise<FiltrationRecord | null> {
  const { data, error } = await supabase.from(TABLE).select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data ? rowToRecord(data) : null;
}

export async function deleteRecord(id: string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq('id', id);
  if (error) throw error;
}
