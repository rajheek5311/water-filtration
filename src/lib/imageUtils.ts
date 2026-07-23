// Helpers to load an uploaded image file into an HTMLImageElement and extract
// average pixel data. Shared by the (dummy) analysis modules so a future real
// computer-vision implementation can reuse the same primitives.

export async function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

// Downscale to a small canvas for fast pixel sampling, then return average RGB
// plus a brightness value. Returns null if drawing fails (e.g. tainted canvas).
export async function getAverageColor(
  src: string,
  sampleSize = 64
): Promise<{ r: number; g: number; b: number; brightness: number } | null> {
  try {
    const img = await loadImage(src);
    const canvas = document.createElement('canvas');
    canvas.width = sampleSize;
    canvas.height = sampleSize;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.drawImage(img, 0, 0, sampleSize, sampleSize);
    const { data } = ctx.getImageData(0, 0, sampleSize, sampleSize);
    let r = 0;
    let g = 0;
    let b = 0;
    const count = data.length / 4;
    for (let i = 0; i < data.length; i += 4) {
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
    }
    r = Math.round(r / count);
    g = Math.round(g / count);
    b = Math.round(b / count);
    const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return { r, g, b, brightness };
  } catch {
    return null;
  }
}

// Deterministic pseudo-random in 0..1 from a string (e.g. data URL) so the same
// image yields stable results across re-analysis — mimics a model's determinism.
export function seededRandom(seed: string): () => number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  let state = h >>> 0;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return ((state >>> 0) % 100000) / 100000;
  };
}
