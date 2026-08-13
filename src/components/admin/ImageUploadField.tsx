import React, { useState, useRef } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Icon } from "../site-shell";
import { toast } from "sonner";

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  help?: string;
  bucket?: string;
}

const DEFAULT_BUCKET = "category-images Paco-images-123";

export function ImageUploadField({ 
  label, 
  value, 
  onChange, 
  help, 
  bucket = DEFAULT_BUCKET 
}: ImageUploadFieldProps) {

  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error("Lütfen geçerli bir görsel dosyası seçin (JPG, PNG, WebP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Dosya boyutu 5MB'dan küçük olmalıdır.");
      return;
    }

    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${ext}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      onChange(publicUrl);
      toast.success("Görsel başarıyla yüklendi.");
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error("Yükleme sırasında bir hata oluştu: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <span className="text-[13px] font-semibold text-[var(--admin-text)]">{label}</span>
      </div>

      <div 
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={onDrop}
        className={`relative border-2 border-dashed rounded-xl p-4 transition-all flex flex-col items-center justify-center min-h-[160px] cursor-pointer
          ${dragActive ? 'border-[var(--admin-yellow)] bg-[var(--admin-yellow-soft)]/10' : 'border-white/10 bg-white/5'}
          ${value ? 'pb-20' : ''}`}
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          ref={fileInputRef}
          type="file" 
          accept="image/jpeg,image/png,image/webp" 
          className="hidden" 
          onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
        />

        {value ? (
          <div className="flex flex-col items-center gap-3 w-full">
            <div className="relative aspect-[4/3] w-full max-w-[240px] rounded-lg overflow-hidden border border-white/10">
              <img src={value} alt="Preview" className="w-full h-full object-cover" />
              <button 
                onClick={(e) => { e.stopPropagation(); onChange(''); }}
                className="absolute top-2 right-2 h-7 w-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-red-500 transition-colors"
                title="Görseli Kaldır"
              >
                <Icon name="close" className="text-[16px]" />
              </button>
            </div>
            <p className="text-[11px] text-white/40">Görseli değiştirmek için tıklayın veya sürükleyin</p>
          </div>
        ) : (
          <>
            <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center mb-3">
              <Icon name={uploading ? "sync" : "cloud_upload"} className={`text-[20px] ${uploading ? 'animate-spin' : ''}`} />
            </div>
            <p className="text-[13px] font-medium text-white/80">
              {uploading ? "Yükleniyor..." : "Dosya Seç veya Sürükle"}
            </p>
            <p className="text-[11px] text-white/40 mt-1">JPG, PNG veya WebP (Maks. 5MB)</p>
          </>
        )}
      </div>

      {help && <span className="text-[12px] text-white/40">{help}</span>}
    </div>
  );
}
