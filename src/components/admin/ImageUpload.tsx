import { useState, useRef } from 'react';
import { Upload, X, Loader2, Link as LinkIcon } from 'lucide-react';
import { supabase } from '../../lib/admin';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  aspect?: string;
}

export default function ImageUpload({ value, onChange, label, aspect = 'aspect-[3/4]' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('فقط فایل تصویری مجاز است');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('حداکثر حجم ۵ مگابایت');
      return;
    }
    setError('');
    setUploading(true);
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from('admin-uploads')
      .upload(fileName, file, { cacheControl: '3600', upsert: false });
    setUploading(false);
    if (upErr) {
      setError('خطا در آپلود: ' + upErr.message);
      return;
    }
    const { data: pub } = supabase.storage.from('admin-uploads').getPublicUrl(fileName);
    onChange(pub.publicUrl);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div>
      {label && <label className="text-xs text-gray-400 block mb-1.5">{label}</label>}
      <div className="flex gap-3 items-start">
        {value && (
          <div className={`relative ${aspect} w-24 flex-shrink-0 rounded overflow-hidden border border-white/10`}>
            <img src={value} alt="preview" className="w-full h-full object-cover object-top" />
            <button
              onClick={() => onChange('')}
              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-red-500 transition-colors"
              type="button"
              aria-label="حذف تصویر"
            >
              <X size={10} />
            </button>
          </div>
        )}
        <div className="flex-1">
          <div
            onClick={() => fileRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="border-2 border-dashed border-white/10 rounded-lg p-4 text-center cursor-pointer hover:border-white/30 transition-colors"
          >
            {uploading ? (
              <div className="flex flex-col items-center gap-2 py-2">
                <Loader2 size={20} className="animate-spin text-gray-400" />
                <span className="text-xs text-gray-500">در حال آپلود...</span>
              </div>
            ) : (
              <>
                <Upload size={18} className="mx-auto text-gray-500 mb-1.5" />
                <p className="text-xs text-gray-400">کلیک کنید یا تصویر را بکشید</p>
                <p className="text-[10px] text-gray-600 mt-0.5">JPG, PNG, WebP — حداکثر ۵MB</p>
              </>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }}
            />
          </div>
          <button
            onClick={() => { setShowUrlInput(!showUrlInput); setUrlInput(value); }}
            className="flex items-center gap-1.5 text-[11px] text-gray-500 hover:text-gray-300 mt-2 transition-colors"
            type="button"
          >
            <LinkIcon size={11} />
            {showUrlInput ? 'بستن' : 'یا وارد کردن آدرس URL'}
          </button>
          {showUrlInput && (
            <div className="flex gap-2 mt-1.5">
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://..."
                className="flex-1 px-3 py-1.5 text-xs rounded border font-en"
                style={{ background: '#1a1a1a', borderColor: '#333', color: '#e5e5e5' }}
              />
              <button
                onClick={() => { onChange(urlInput.trim()); setShowUrlInput(false); }}
                className="px-3 py-1.5 text-xs rounded border border-white/10 text-gray-300 hover:border-white/30"
                type="button"
              >
                تایید
              </button>
            </div>
          )}
          {error && <p className="text-[11px] text-red-400 mt-1.5">{error}</p>}
        </div>
      </div>
    </div>
  );
}

// Multi-image upload variant
export function MultiImageUpload({ value, onChange, label }: { value: string[]; onChange: (urls: string[]) => void; label?: string }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList) => {
    setError('');
    setUploading(true);
    const newUrls: string[] = [];
    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) continue;
      if (file.size > 5 * 1024 * 1024) continue;
      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error: upErr } = await supabase.storage.from('admin-uploads').upload(fileName, file, { cacheControl: '3600' });
      if (upErr) { setError('خطا: ' + upErr.message); continue; }
      const { data: pub } = supabase.storage.from('admin-uploads').getPublicUrl(fileName);
      newUrls.push(pub.publicUrl);
    }
    setUploading(false);
    if (newUrls.length) onChange([...value, ...newUrls]);
  };

  const removeAt = (idx: number) => {
    onChange(value.filter((_, i) => i !== idx));
  };

  return (
    <div>
      {label && <label className="text-xs text-gray-400 block mb-1.5">{label}</label>}
      <div className="flex flex-wrap gap-2">
        {value.map((url, i) => (
          <div key={i} className="relative w-16 h-20 rounded overflow-hidden border border-white/10 group">
            <img src={url} alt="" className="w-full h-full object-cover object-top" />
            <button
              onClick={() => removeAt(i)}
              className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-black/60 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
              type="button"
            >
              <X size={9} />
            </button>
          </div>
        ))}
        <div
          onClick={() => fileRef.current?.click()}
          onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.files) handleFiles(e.dataTransfer.files); }}
          onDragOver={(e) => e.preventDefault()}
          className="w-16 h-20 border-2 border-dashed border-white/10 rounded flex items-center justify-center cursor-pointer hover:border-white/30 transition-colors"
        >
          {uploading ? <Loader2 size={16} className="animate-spin text-gray-400" /> : <Upload size={16} className="text-gray-500" />}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => { if (e.target.files) handleFiles(e.target.files); e.target.value = ''; }}
          />
        </div>
      </div>
      {error && <p className="text-[11px] text-red-400 mt-1.5">{error}</p>}
    </div>
  );
}
