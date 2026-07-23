import { getAverageColor, seededRandom } from '@/lib/imageUtils';
import type { PHResult } from '@/lib/types';

// Dummy pH estimation.
//
// Heuristic: pH strips shift from red (acidic, ~pH 4) through yellow/green
// (neutral, ~pH 7) to blue/purple (basic, ~pH 10). We approximate the pH from
// the average colour hue and brightness, then jitter deterministically from the
// image bytes so the same strip yields a stable value.
//
// Replace this function with a real CV model call without touching the UI —
// the signature (dataUrl) => Promise<PHResult> is the contract.
export async function analyzePHStrip(dataUrl: string): Promise<PHResult> {
  const avg = await getAverageColor(dataUrl);
  const rng = seededRandom(dataUrl.slice(0, 200));

  let base = 7;
  if (avg) {
    const { r, g, b } = avg;
    // Green-dominant → neutral; blue-dominant → basic; red-dominant → acidic.
    if (b > r && b > g) base = 7.5 + (b - Math.max(r, g)) / 255 * 3; // 7.5..10.5
    else if (r > g && r > b) base = 7 - (r - Math.max(g, b)) / 255 * 3.5; // 3.5..7
    else base = 6 + (g - 128) / 128 * 1.5; // green-ish band ~5..8
  }
  const jitter = (rng() - 0.5) * 0.4;
  const phValue = Math.min(11, Math.max(3.5, +(base + jitter).toFixed(2)));
  const confidence = +(0.82 + rng() * 0.15).toFixed(2); // 0.82..0.97
  return { phValue, confidence };
}
