import { getAverageColor, seededRandom } from '@/lib/imageUtils';
import type { FilterPaperResult } from '@/lib/types';

// Dummy filter-paper microfiber estimation. Heuristic: darker / denser patches
// on the filter paper indicate more captured fibres. We derive a coverage
// metric from brightness and saturation, then convert into count, density and
// average length with deterministic jitter per image.
//
// Replace with a real CV segmentation model later — contract stays
// (dataUrl) => Promise<FilterPaperResult>.
export async function analyzeFilterPaper(dataUrl: string): Promise<FilterPaperResult> {
  const avg = await getAverageColor(dataUrl);
  const rng = seededRandom(dataUrl.slice(0, 200));

  let coverage = 0.3; // 0..1 fraction of paper covered by fibres
  if (avg) {
    // Darker + more saturated → more fibres.
    const darkness = 1 - avg.brightness;
    const saturation = avg.r === 0 && avg.g === 0 && avg.b === 0 ? 0.4 : 0.5;
    coverage = Math.min(0.95, Math.max(0.05, darkness * 0.8 + saturation * 0.2));
  }
  const microfiberCount = Math.round(coverage * 1200 + rng() * 80);
  const fiberDensity = +(coverage * 240 + rng() * 20).toFixed(1); // fibers / mm^2
  const averageFiberLength = +(0.4 + rng() * 2.6).toFixed(2); // µm
  return { microfiberCount, fiberDensity, averageFiberLength };
}
