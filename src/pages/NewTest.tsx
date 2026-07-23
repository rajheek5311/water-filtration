import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  FlaskConical,
  Image as ImageIcon,
  SlidersHorizontal,
  Calculator,
  Save,
  ArrowRight,
  Thermometer,
  Waves,
  Gauge,
  Droplet,
  ArrowDownUp,
  Zap,
  Wind,
  Info,
  CheckCircle2,
} from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import Button from '@/components/Button';
import SectionHeader from '@/components/SectionHeader';
import ImageDropzone from '@/components/ImageDropzone';
import Field from '@/components/Field';
import AlertCard from '@/components/AlertCard';
import QualityBadge from '@/components/QualityBadge';
import Spinner from '@/components/Spinner';
import { useToast } from '@/context/ToastContext';
import { fileToDataURL } from '@/lib/imageUtils';
import { analyzePHStrip } from '@/lib/analysis/phAnalysis';
import { analyzeWaterSample } from '@/lib/analysis/waterAnalysis';
import { analyzeFilterPaper } from '@/lib/analysis/filterAnalysis';
import { computeEstimatedParameters } from '@/lib/calculations';
import { generateAlerts } from '@/lib/alertEngine';
import { emptyForm, recordToForm } from '@/lib/emptyForm';
import { getRecord, saveRecord, updateRecord } from '@/lib/recordsService';
import type { ManualInputs, SampleType, TestFormState } from '@/lib/types';

const ANALYZING_LABEL: Record<string, string> = {
  ph: 'Estimating pH from strip…',
  water: 'Analysing water sample…',
  filter: 'Counting microfibers…',
};

function ResultPill({ label, value, unit }: { label: string; value: string | number; unit?: string }) {
  return (
    <div className="rounded-xl bg-white/60 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 px-4 py-3">
      <p className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">{label}</p>
      <p className="mt-1 font-display text-lg font-bold text-slate-800 dark:text-white">
        {value}
        {unit && <span className="ml-1 text-xs font-medium text-slate-400">{unit}</span>}
      </p>
    </div>
  );
}

const MANUAL_FIELDS: {
  key: keyof ManualInputs;
  label: string;
  unit: string;
  icon: typeof Thermometer;
  placeholder: string;
  step?: string;
}[] = [
  { key: 'temperature', label: 'Temperature', unit: '°C', icon: Thermometer, placeholder: '25.0', step: '0.1' },
  { key: 'turbidity', label: 'Turbidity', unit: 'NTU', icon: Waves, placeholder: '12.5', step: '0.1' },
  { key: 'flowRate', label: 'Flow Rate', unit: 'L/min', icon: Gauge, placeholder: '4.2', step: '0.1' },
  { key: 'waterLevel', label: 'Water Level', unit: 'cm', icon: Droplet, placeholder: '32', step: '0.1' },
  { key: 'pressureDrop', label: 'Pressure Drop', unit: 'kPa', icon: ArrowDownUp, placeholder: '8.5', step: '0.1' },
  { key: 'electricalConductivity', label: 'Electrical Conductivity', unit: 'µS/cm', icon: Zap, placeholder: '1450', step: '1' },
  { key: 'dissolvedOxygen', label: 'Dissolved Oxygen', unit: 'mg/L', icon: Wind, placeholder: '6.2', step: '0.1' },
];

export default function NewTest() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [form, setForm] = useState<TestFormState>(emptyForm);
  const [analyzing, setAnalyzing] = useState<string | null>(null);
  const [loadingRecord, setLoadingRecord] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  // Load existing record when editing.
  useEffect(() => {
    if (!id) return;
    let mounted = true;
    (async () => {
      setLoadingRecord(true);
      try {
        const rec = await getRecord(id);
        if (mounted && rec) setForm(recordToForm(rec));
        else if (mounted) showToast('error', 'Record not found.');
      } catch (e) {
        if (mounted) showToast('error', 'Failed to load record.');
      } finally {
        if (mounted) setLoadingRecord(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id, showToast]);

  // Recompute estimated parameters + alerts whenever inputs change.
  const recomputed = useMemo(() => {
    const estimated = computeEstimatedParameters({
      sampleType: form.sampleType,
      ph: form.phResult,
      water: form.waterSampleResult,
      filter: form.filterPaperResult,
      manual: form.manual,
    });
    const alerts = generateAlerts({
      sampleType: form.sampleType,
      ph: form.phResult,
      water: form.waterSampleResult,
      filter: form.filterPaperResult,
      manual: form.manual,
      estimated,
    });
    return { estimated, alerts };
  }, [form.sampleType, form.phResult, form.waterSampleResult, form.filterPaperResult, form.manual]);

  // Keep form.estimated and form.alerts in sync (without causing re-render loop).
  useEffect(() => {
    setForm((prev) => {
      const sameEst =
        prev.estimated.estimatedCOD === recomputed.estimated.estimatedCOD &&
        prev.estimated.estimatedBOD === recomputed.estimated.estimatedBOD &&
        prev.estimated.filtrationEfficiency === recomputed.estimated.filtrationEfficiency &&
        prev.estimated.overallQuality === recomputed.estimated.overallQuality;
      const sameAlerts = prev.alerts.length === recomputed.alerts.length;
      if (sameEst && sameAlerts) return prev;
      return { ...prev, estimated: recomputed.estimated, alerts: recomputed.alerts };
    });
  }, [recomputed]);

  const setManual = (key: keyof ManualInputs, raw: string) => {
    setForm((prev) => ({
      ...prev,
      manual: { ...prev.manual, [key]: raw === '' ? null : Number(raw) },
    }));
  };

  const handlePHFile = useCallback(async (file: File) => {
    setAnalyzing('ph');
    try {
      const dataUrl = await fileToDataURL(file);
      setForm((prev) => ({ ...prev, phStripImage: dataUrl }));
      const result = await analyzePHStrip(dataUrl);
      setForm((prev) => ({ ...prev, phResult: result }));
      showToast('success', `pH estimated at ${result.phValue}.`);
    } catch {
      showToast('error', 'Could not analyse pH strip image.');
    } finally {
      setAnalyzing(null);
    }
  }, [showToast]);

  const handleWaterFile = useCallback(async (file: File) => {
    setAnalyzing('water');
    try {
      const dataUrl = await fileToDataURL(file);
      setForm((prev) => ({ ...prev, waterSampleImage: dataUrl }));
      const result = await analyzeWaterSample(dataUrl);
      setForm((prev) => ({ ...prev, waterSampleResult: result }));
      showToast('success', `Water colour detected: ${result.waterColor}.`);
    } catch {
      showToast('error', 'Could not analyse water sample image.');
    } finally {
      setAnalyzing(null);
    }
  }, [showToast]);

  const handleFilterFile = useCallback(async (file: File) => {
    setAnalyzing('filter');
    try {
      const dataUrl = await fileToDataURL(file);
      setForm((prev) => ({ ...prev, filterPaperImage: dataUrl }));
      const result = await analyzeFilterPaper(dataUrl);
      setForm((prev) => ({ ...prev, filterPaperResult: result }));
      showToast('success', `${result.microfiberCount} microfibers estimated.`);
    } catch {
      showToast('error', 'Could not analyse filter paper image.');
    } finally {
      setAnalyzing(null);
    }
  }, [showToast]);

  const handleSave = async () => {
    if (!form.sampleType) {
      showToast('error', 'Select Before or After filtration first.');
      return;
    }
    setSaving(true);
    try {
      const payload: TestFormState = {
        ...form,
        estimated: recomputed.estimated,
        alerts: recomputed.alerts,
      };
      if (isEdit && id) {
        await updateRecord(id, payload);
        showToast('success', 'Record updated successfully.');
      } else {
        const saved = await saveRecord(payload);
        showToast('success', `Record saved as ${saved.sample_id}.`);
      }
      navigate('/records');
    } catch (e: any) {
      showToast('error', e?.message ?? 'Failed to save record.');
    } finally {
      setSaving(false);
    }
  };

  if (loadingRecord) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner size="lg" label="Loading record…" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Page header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2.5">
            <FlaskConical className="h-6 w-6 text-brand-500" />
            {isEdit ? 'Edit Test Record' : 'New Filtration Test'}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Upload images, enter manual readings, and let the system estimate parameters and alerts.
          </p>
        </div>
        {form.sampleType && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-100/70 dark:bg-brand-500/15 text-brand-700 dark:text-brand-300 text-sm font-semibold border border-brand-300/40">
            {form.sampleType === 'before' ? 'Before Filtration' : 'After Filtration'}
          </span>
        )}
      </div>

      {/* Step 0: sample type selection */}
      <GlassCard strong className="p-6">
        <SectionHeader
          step={0}
          title="Select Sample Type"
          description="Choose whether this sample was taken before or after filtration."
        />
        <div className="grid sm:grid-cols-2 gap-4">
          {(['before', 'after'] as SampleType[]).map((t) => {
            const active = form.sampleType === t;
            return (
              <button
                key={t}
                onClick={() => setForm((prev) => ({ ...prev, sampleType: t }))}
                className={`relative text-left rounded-xl border-2 p-5 transition-all duration-200 ${
                  active
                    ? 'border-brand-500 bg-brand-50/70 dark:bg-brand-500/15 shadow-glass-sm'
                    : 'border-slate-200/70 dark:border-white/10 hover:border-brand-300 hover:bg-brand-50/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2.5 rounded-xl ${
                      active
                        ? 'bg-brand-500 text-white'
                        : 'bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-300'
                    }`}
                  >
                    {t === 'before' ? <ImageIcon className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-white">
                      {t === 'before' ? 'Before Filtration' : 'After Filtration'}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {t === 'before'
                        ? 'Raw wastewater sample entering the filter.'
                        : 'Treated water sample exiting the filter.'}
                    </p>
                  </div>
                </div>
                {active && (
                  <span className="absolute top-3 right-3 h-2 w-2 rounded-full bg-brand-500 ring-4 ring-brand-200/50 dark:ring-brand-500/30" />
                )}
              </button>
            );
          })}
        </div>
      </GlassCard>

      {/* Section 1: pH strip */}
      <GlassCard className="p-6">
        <SectionHeader step={1} title="pH Strip Image" description="Upload a pH test strip photo for automatic pH estimation." />
        <div className="grid md:grid-cols-2 gap-5">
          <ImageDropzone
            label="pH Strip Photo"
            preview={form.phStripImage}
            onFile={handlePHFile}
            onClear={() => setForm((prev) => ({ ...prev, phStripImage: null, phResult: null }))}
            disabled={analyzing === 'ph'}
          />
          <div className="space-y-3">
            {analyzing === 'ph' ? (
              <div className="flex flex-col items-center justify-center h-full py-8">
                <Spinner label={ANALYZING_LABEL.ph} />
              </div>
            ) : form.phResult ? (
              <div className="space-y-3 animate-fade-in">
                <div className="grid grid-cols-2 gap-3">
                  <ResultPill label="Estimated pH" value={form.phResult.phValue.toFixed(2)} />
                  <ResultPill label="Confidence" value={`${(form.phResult.confidence * 100).toFixed(0)}%`} />
                </div>
                <div className="rounded-xl bg-brand-50/60 dark:bg-brand-500/10 border border-brand-200/50 dark:border-brand-500/20 px-4 py-3 text-xs text-brand-700 dark:text-brand-300 flex items-start gap-2">
                  <Info className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>pH range reference: 6.0–9.0 recommended for textile discharge.</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center text-slate-400 py-10">
                <ImageIcon className="h-8 w-8 mb-2 opacity-50" />
                <p className="text-sm">Upload an image to estimate pH.</p>
              </div>
            )}
          </div>
        </div>
      </GlassCard>

      {/* Section 2: water sample */}
      <GlassCard className="p-6">
        <SectionHeader step={2} title="Water Sample Image" description="Detect water colour, predicted dye category and colour intensity." />
        <div className="grid md:grid-cols-2 gap-5">
          <ImageDropzone
            label="Water Sample Photo"
            preview={form.waterSampleImage}
            onFile={handleWaterFile}
            onClear={() =>
              setForm((prev) => ({ ...prev, waterSampleImage: null, waterSampleResult: null }))
            }
            disabled={analyzing === 'water'}
          />
          <div className="space-y-3">
            {analyzing === 'water' ? (
              <div className="flex flex-col items-center justify-center h-full py-8">
                <Spinner label={ANALYZING_LABEL.water} />
              </div>
            ) : form.waterSampleResult ? (
              <div className="space-y-3 animate-fade-in">
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center gap-3 rounded-xl bg-white/60 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 px-4 py-3">
                    <span
                      className="h-8 w-8 rounded-lg border border-white/60 shadow-sm"
                      style={{
                        backgroundColor: `rgb(${form.waterSampleResult.rgb.r}, ${form.waterSampleResult.rgb.g}, ${form.waterSampleResult.rgb.b})`,
                      }}
                    />
                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Water Colour</p>
                      <p className="font-display text-base font-bold text-slate-800 dark:text-white">
                        {form.waterSampleResult.waterColor}
                      </p>
                    </div>
                  </div>
                  <ResultPill label="Predicted Dye Category" value={form.waterSampleResult.dyeCategory} />
                  <ResultPill label="Colour Intensity" value={form.waterSampleResult.colorIntensity} unit="/ 100" />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center text-slate-400 py-10">
                <Waves className="h-8 w-8 mb-2 opacity-50" />
                <p className="text-sm">Upload an image to detect colour & dye.</p>
              </div>
            )}
          </div>
        </div>
      </GlassCard>

      {/* Section 3: filter paper — only applicable after filtration */}
      {form.sampleType === 'after' ? (
        <GlassCard className="p-6 animate-fade-in">
          <SectionHeader step={3} title="Filter Paper Image" description="Estimate microfiber count, fiber density and average fiber length." />
          <div className="grid md:grid-cols-2 gap-5">
            <ImageDropzone
              label="Filter Paper Photo"
              preview={form.filterPaperImage}
              onFile={handleFilterFile}
              onClear={() =>
                setForm((prev) => ({ ...prev, filterPaperImage: null, filterPaperResult: null }))
              }
              disabled={analyzing === 'filter'}
            />
            <div className="space-y-3">
              {analyzing === 'filter' ? (
                <div className="flex flex-col items-center justify-center h-full py-8">
                  <Spinner label={ANALYZING_LABEL.filter} />
                </div>
              ) : form.filterPaperResult ? (
                <div className="grid grid-cols-1 gap-3 animate-fade-in">
                  <ResultPill label="Approx. Microfiber Count" value={form.filterPaperResult.microfiberCount} />
                  <div className="grid grid-cols-2 gap-3">
                    <ResultPill label="Fiber Density" value={form.filterPaperResult.fiberDensity} unit="/mm²" />
                    <ResultPill label="Avg Fiber Length" value={form.filterPaperResult.averageFiberLength} unit="µm" />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-slate-400 py-10">
                  <Gauge className="h-8 w-8 mb-2 opacity-50" />
                  <p className="text-sm">Upload an image to estimate microfibers.</p>
                </div>
              )}
            </div>
          </div>
        </GlassCard>
      ) : (
        <GlassCard className="p-5">
          <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
            <div className="shrink-0 p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-400">
              <Gauge className="h-5 w-5" />
            </div>
            <p>
              <span className="font-semibold text-slate-700 dark:text-slate-200">Filter Paper Image</span> is only
              collected for <span className="font-semibold">After Filtration</span> samples. Select "After Filtration"
              above to enable microfiber estimation.
            </p>
          </div>
        </GlassCard>
      )}

      {/* Section 4: manual inputs */}
      <GlassCard className="p-6">
        <SectionHeader
          step={form.sampleType === 'after' ? 4 : 3}
          title="Manual Input Fields"
          description="Enter physical measurements from your instruments."
          icon={<SlidersHorizontal className="h-5 w-5" />}
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MANUAL_FIELDS.map((f) => {
            const Icon = f.icon;
            const value = form.manual[f.key];
            return (
              <Field
                key={f.key}
                label={f.label}
                unit={f.unit}
                type="number"
                step={f.step ?? 'any'}
                placeholder={f.placeholder}
                icon={<Icon className="h-4 w-4" />}
                value={value ?? ''}
                onChange={(e) => setManual(f.key, e.target.value)}
              />
            );
          })}
        </div>
      </GlassCard>

      {/* Section 5: estimated parameters */}
      <GlassCard strong className="p-6">
        <SectionHeader
          step={form.sampleType === 'after' ? 5 : 4}
          title="Estimated Parameters"
          description="Derived from image analysis and manual inputs."
          icon={<Calculator className="h-5 w-5" />}
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <ResultPill label="Estimated COD" value={form.estimated.estimatedCOD ?? '—'} unit="mg/L" />
          <ResultPill label="Estimated BOD" value={form.estimated.estimatedBOD ?? '—'} unit="mg/L" />
          <ResultPill
            label="Filtration Efficiency"
            value={form.estimated.filtrationEfficiency != null ? form.estimated.filtrationEfficiency : '—'}
            unit="%"
          />
          <div className="rounded-xl bg-white/60 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 px-4 py-3">
            <p className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Overall Water Quality</p>
            <div className="mt-1.5">
              <QualityBadge quality={form.estimated.overallQuality} />
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Alert engine */}
      <GlassCard className="p-6">
        <SectionHeader
          title="Alert Engine"
          description="Automatic checks across all measured values."
          icon={<Info className="h-5 w-5" />}
        />
        <div className="grid sm:grid-cols-2 gap-3">
          {form.alerts.length === 0 ? (
            <p className="text-sm text-slate-400 col-span-2 py-4 text-center">
              No alerts yet. Select a sample type and add measurements.
            </p>
          ) : (
            form.alerts.map((a) => <AlertCard key={a.id} alert={a} />)
          )}
        </div>
      </GlassCard>

      {/* Notes + save */}
      <GlassCard className="p-6">
        <SectionHeader title="Notes" description="Optional remarks for this record." />
        <textarea
          value={form.notes}
          onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
          rows={3}
          placeholder="Add any observations about this sample…"
          className="w-full rounded-xl bg-white/70 dark:bg-white/5 border border-slate-200/70 dark:border-white/10 px-4 py-3 text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-400/60 transition-all resize-y"
        />
        <div className="mt-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-slate-200/50 dark:border-white/10">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isEdit ? 'Saving will update the existing record.' : 'A unique sample ID, date and time are assigned automatically.'}
          </p>
          <div className="flex gap-2.5">
            <Button variant="ghost" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button onClick={handleSave} loading={saving} leftIcon={!saving && <Save className="h-4 w-4" />}>
              {isEdit ? 'Update Record' : 'Save Record'}
              {!saving && <ArrowRight className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
