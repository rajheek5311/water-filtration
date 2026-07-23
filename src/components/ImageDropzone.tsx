import { useCallback, useRef, useState, type DragEvent } from 'react';
import { UploadCloud, ImageIcon, RefreshCw } from 'lucide-react';

interface ImageDropzoneProps {
  label: string;
  preview: string | null;
  onFile: (file: File) => void;
  onClear: () => void;
  disabled?: boolean;
  hint?: string;
}

export default function ImageDropzone({
  label,
  preview,
  onFile,
  onClear,
  disabled = false,
  hint = 'Drag & drop or click to upload',
}: ImageDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragging(false);
      if (disabled) return;
      const file = e.dataTransfer.files?.[0];
      if (file && file.type.startsWith('image/')) onFile(file);
    },
    [disabled, onFile]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFile(file);
    e.target.value = '';
  };

  return (
    <div className="w-full">
      <p className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</p>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        className={`relative rounded-xl border-2 border-dashed transition-all duration-200 ${
          disabled
            ? 'opacity-60 cursor-not-allowed border-slate-300/50'
            : 'cursor-pointer hover:border-brand-400 hover:bg-brand-50/30 dark:hover:bg-brand-500/5'
        } ${
          dragging
            ? 'border-brand-500 bg-brand-50/60 dark:bg-brand-500/10 scale-[1.01]'
            : 'border-slate-300/70 dark:border-white/15'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleChange}
          disabled={disabled}
        />
        {preview ? (
          <div className="relative group">
            <img src={preview} alt={label} className="w-full h-44 object-cover rounded-xl" />
            {!disabled && (
              <div className="absolute inset-0 rounded-xl bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    inputRef.current?.click();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-white/90 text-slate-800 text-xs font-semibold flex items-center gap-1.5 hover:bg-white"
                >
                  <RefreshCw className="h-3.5 w-3.5" /> Replace
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClear();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-rose-500/90 text-white text-xs font-semibold hover:bg-rose-500"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
            <div className="p-3 rounded-full bg-brand-100/60 dark:bg-brand-500/15 text-brand-600 dark:text-brand-300 mb-3">
              {dragging ? <UploadCloud className="h-7 w-7 animate-bounce" /> : <ImageIcon className="h-7 w-7" />}
            </div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{hint}</p>
            <p className="mt-1 text-xs text-slate-400">PNG, JPG up to ~5MB</p>
          </div>
        )}
      </div>
    </div>
  );
}
