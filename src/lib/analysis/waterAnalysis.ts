import { getAverageColor, seededRandom } from '@/lib/imageUtils';
import type { WaterSampleResult } from '@/lib/types';

interface DyeCategory {
  name: string;
  // Representative hue range this category falls into (degrees, 0..360).
  hueMin: number;
  hueMax: number;
}

const DYE_CATEGORIES: DyeCategory[] = [
  { name: 'Reactive Red', hueMin: 340, hueMax: 380 },
  { name: 'Reactive Blue', hueMin: 200, hueMax: 260 },
  { name: 'Disperse Yellow', hueMin: 45, hueMax: 75 },
  { name: 'Azo Orange', hueMin: 15, hueMax: 45 },
  { name: 'Vat Green', hueMin: 75, hueMax: 165 },
  { name: 'Sulphur Black', hueMin: -1, hueMax: -1 },
  { name: 'Basic Violet', hueMin: 260, hueMax: 340 },
];

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
        break;
      case g:
        h = ((b - r) / d + 2) * 60;
        break;
      case b:
        h = ((r - g) / d + 4) * 60;
        break;
    }
  }
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function colorName(h: number, s: number, l: number): string {
  if (l < 12) return 'Black';
  if (l > 92 && s < 15) return 'Clear / White';
  if (s < 12) return 'Grey';
  if (h < 15 || h >= 345) return 'Red';
  if (h < 45) return 'Orange';
  if (h < 75) return 'Yellow';
  if (h < 165) return 'Green';
  if (h < 200) return 'Teal';
  if (h < 260) return 'Blue';
  return 'Violet';
}

function matchDye(h: number, s: number, l: number, rng: () => number): string {
  if (l < 15) return 'Sulphur Black';
  if (s < 15) return 'Unidentified / Clear';
  const norm = h % 360;
  for (const cat of DYE_CATEGORIES) {
    if (cat.hueMin < 0) continue;
    const min = cat.hueMin;
    const max = cat.hueMax > 360 ? cat.hueMax - 360 : cat.hueMax;
    const inRange = max >= min ? norm >= min && norm <= max : norm >= min || norm <= max;
    if (inRange) {
      // Add slight variant suffix for realism, deterministic per image.
      if (rng() > 0.7) return cat.name.replace('Reactive', 'Direct');
      return cat.name;
    }
  }
  return 'Unidentified';
}

// Dummy water-sample analysis. Replace with a real CV classifier later without
// changing the UI — the contract is (dataUrl) => Promise<WaterSampleResult>.
export async function analyzeWaterSample(dataUrl: string): Promise<WaterSampleResult> {
  const avg = await getAverageColor(dataUrl);
  const rng = seededRandom(dataUrl.slice(0, 200));

  let r = 180;
  let g = 180;
  let b = 180;
  if (avg) {
    r = avg.r;
    g = avg.g;
    b = avg.b;
  }
  const { h, s, l } = rgbToHsl(r, g, b);
  const waterColor = colorName(h, s, l);
  const dyeCategory = matchDye(h, s, l, rng);
  // Intensity: saturation scaled, darkened slightly by low lightness.
  const colorIntensity = Math.round(Math.min(100, Math.max(0, s * 0.7 + (100 - l) * 0.3)));
  return { waterColor, dyeCategory, colorIntensity, rgb: { r, g, b } };
}
