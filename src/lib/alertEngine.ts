import type { AlertItem, EstimatedParameters, ManualInputs, SampleType } from '@/lib/types';
import type { FilterPaperResult, PHResult, WaterSampleResult } from '@/lib/types';

export interface AlertEngineInput {
  sampleType: SampleType | null;
  ph: PHResult | null;
  water: WaterSampleResult | null;
  filter: FilterPaperResult | null;
  manual: ManualInputs;
  estimated: EstimatedParameters;
}

let counter = 0;
function makeAlert(level: AlertItem['level'], title: string, message: string): AlertItem {
  counter += 1;
  return { id: `alert-${Date.now()}-${counter}`, level, title, message };
}

// Thresholds are illustrative; tuned for a textile-wastewater context.
const PH_RANGE = [6.0, 9.0] as const;
const TURBIDITY_MAX = 30; // NTU (after filtration target)
const TEMP_RANGE = [15, 40] as const; // °C
const DO_MIN = 4; // mg/L
const EC_MAX = 3000; // µS/cm
const COD_MAX = 250; // mg/L (post-filtration discharge target)
const BOD_MAX = 30; // mg/L
const FIBER_COUNT_WARN = 400;
const FIBER_COUNT_HIGH = 800;
const EFFICIENCY_GOOD = 70;
const EFFICIENCY_WARN = 50;

// Pure function: inspect every available value and emit coloured alert cards.
// Green = satisfactory, Yellow = caution, Red = critical.
export function generateAlerts(input: AlertEngineInput): AlertItem[] {
  const alerts: AlertItem[] = [];
  const { sampleType, ph, water, filter, manual, estimated } = input;
  const isAfter = sampleType === 'after';

  if (ph) {
    if (ph.phValue < PH_RANGE[0] || ph.phValue > PH_RANGE[1]) {
      alerts.push(
        makeAlert(
          'red',
          'pH out of range',
          `pH ${ph.phValue} is outside the recommended ${PH_RANGE[0]}–${PH_RANGE[1]} band. Neutralisation required.`
        )
      );
    } else {
      alerts.push(
        makeAlert('green', 'pH within range', `pH ${ph.phValue} is within the recommended band.`)
      );
    }
  }

  if (manual.turbidity != null) {
    if (manual.turbidity > TURBIDITY_MAX) {
      alerts.push(
        makeAlert(
          isAfter ? 'red' : 'yellow',
          'High turbidity',
          `Turbidity ${manual.turbidity} NTU exceeds the ${TURBIDITY_MAX} NTU target.`
        )
      );
    } else {
      alerts.push(
        makeAlert('green', 'Turbidity acceptable', `Turbidity ${manual.turbidity} NTU is within target.`)
      );
    }
  }

  if (manual.temperature != null) {
    if (manual.temperature < TEMP_RANGE[0] || manual.temperature > TEMP_RANGE[1]) {
      alerts.push(
        makeAlert(
          'yellow',
          'Temperature out of range',
          `Temperature ${manual.temperature}°C is outside ${TEMP_RANGE[0]}–${TEMP_RANGE[1]}°C.`
        )
      );
    }
  }

  if (manual.dissolvedOxygen != null && manual.dissolvedOxygen < DO_MIN) {
    alerts.push(
      makeAlert(
        'red',
        'Low dissolved oxygen',
        `DO ${manual.dissolvedOxygen} mg/L is below the ${DO_MIN} mg/L minimum.`
      )
    );
  }

  if (manual.electricalConductivity != null && manual.electricalConductivity > EC_MAX) {
    alerts.push(
      makeAlert('yellow', 'High electrical conductivity', `EC ${manual.electricalConductivity} µS/cm exceeds ${EC_MAX}.`)
    );
  }

  if (filter) {
    if (filter.microfiberCount >= FIBER_COUNT_HIGH) {
      alerts.push(
        makeAlert(
          'red',
          'High microfiber concentration observed',
          `${filter.microfiberCount} fibres detected on the filter paper.`
        )
      );
    } else if (filter.microfiberCount >= FIBER_COUNT_WARN) {
      alerts.push(
        makeAlert('yellow', 'Elevated microfiber count', `${filter.microfiberCount} fibres detected — monitor closely.`)
      );
    } else {
      alerts.push(
        makeAlert('green', 'Microfiber count normal', `${filter.microfiberCount} fibres detected.`)
      );
    }
  }

  if (estimated.filtrationEfficiency != null) {
    const eff = estimated.filtrationEfficiency;
    if (eff < EFFICIENCY_WARN) {
      alerts.push(
        makeAlert('red', 'Filter performance reduced', `Filtration efficiency ${eff}% is below ${EFFICIENCY_WARN}%.`)
      );
      alerts.push(
        makeAlert('red', 'Possible filter clogging detected', 'Low efficiency combined with pressure drop suggests clogging.')
      );
    } else if (eff < EFFICIENCY_GOOD) {
      alerts.push(
        makeAlert('yellow', 'Filtration efficiency below target', `${eff}% — target is ${EFFICIENCY_GOOD}%.`)
      );
    } else {
      alerts.push(
        makeAlert('green', 'Filtration efficiency is satisfactory', `Efficiency ${eff}% meets the target.`)
      );
    }
  }

  if (estimated.estimatedCOD != null && isAfter && estimated.estimatedCOD > COD_MAX) {
    alerts.push(
      makeAlert('red', 'COD exceeds discharge limit', `Estimated COD ${estimated.estimatedCOD} mg/L > ${COD_MAX} mg/L.`)
    );
  }
  if (estimated.estimatedBOD != null && isAfter && estimated.estimatedBOD > BOD_MAX) {
    alerts.push(
      makeAlert('red', 'BOD exceeds discharge limit', `Estimated BOD ${estimated.estimatedBOD} mg/L > ${BOD_MAX} mg/L.`)
    );
  }

  if (manual.pressureDrop != null && manual.pressureDrop > 25) {
    alerts.push(
      makeAlert('yellow', 'High pressure drop', `Pressure drop ${manual.pressureDrop} kPa may indicate filter clogging.`)
    );
  }

  if (water && water.colorIntensity > 75) {
    alerts.push(
      makeAlert('yellow', 'High colour intensity', `Colour intensity ${water.colorIntensity} — dye load is elevated.`)
    );
  }

  // Overall quality summary — always present.
  const hasRed = alerts.some((a) => a.level === 'red');
  const hasYellow = alerts.some((a) => a.level === 'yellow');
  if (!hasRed && !hasYellow) {
    alerts.push(
      makeAlert('green', 'Water quality within recommended range', 'All measured parameters are within targets.')
    );
  } else if (hasRed) {
    alerts.push(
      makeAlert('red', 'Water quality outside recommended range', 'One or more critical parameters require attention.')
    );
  } else {
    alerts.push(
      makeAlert('yellow', 'Water quality borderline', 'Some parameters are approaching limits — review advised.')
    );
  }

  return alerts;
}
