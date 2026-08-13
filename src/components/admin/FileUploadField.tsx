import React, { useState, useRef } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Icon } from "../site-shell";
import { toast } from "sonner";

interface FileUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  help?: string;
  bucket?: string;
  accept?: string;
}

const DEFAULT_BUCKET = "category-images Paco-images-123";

export function FileUploadField({ 
  label, 
  value, 
  onChange, 
  help, 
  bucket = DEFAULT_BUCKET,
  accept = "image/jpeg,image/png,image/webp,application/pdf"
}: FileUploadFieldProps) {

  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isPdf = value?.toLowerCase().endsWith('.pdf');
  const isImage = value && !isPdf;

  const handleUpload = async (file: File) => {
    const fileType = file.type;
    const isAccepted = accept.split(',').some(a => {
      if (a.includes('*')) return fileType.startsWith(a.replace('*', ''));
      return fileType === a;
    });

    if (!isAccepted) {
      toast.error(`Lütfen geçerli bir dosya seçin. Kabul edilenler: ${accept}`);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Dosya boyutu 10MB'dan küçük olmalıdır.");
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
      toast.success("Dosya başarıyla yüklendi.");
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
          accept={accept}
          className="hidden" 
          onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
        />

        {value ? (
          <div className="flex flex-col items-center gap-3 w-full">
            <div className="relative aspect-[4/3] w-full max-w-[240px] rounded-lg overflow-hidden border border-white/10 bg-white/5 flex items-center justify-center">
              {isImage ? (
                <img src={value} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Icon name="description" className="text-[40px] text-white/40" />
                  <span className="text-[11px] text-white/60 font-medium">PDF Belgesi</span>
                </div>
              )}
              <button 
                onClick={(e) => { e.stopPropagation(); onChange(''); }}
                className="absolute top-2 right-2 h-7 w-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-red-500 transition-colors"
                title="Dosyayı Kaldır"
              >
                <Icon name="close" className="text-[16px]" />
              </button>
            </div>
            <p className="text-[11px] text-white/40">Dosyayı değiştirmek için tıklayın veya sürükleyin</p>
          </div>
        ) : (
          <>
            <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center mb-3">
              <Icon name={uploading ? "sync" : "cloud_upload"} className={`text-[20px] ${uploading ? 'animate-spin' : ''}`} />
            </div>
            <p className="text-[13px] font-medium text-white/80">
              {uploading ? "Yükleniyor..." : "Dosya Seç veya Sürükle"}
            </p>
            <p className="text-[11px] text-white/40 mt-1">Görsel veya PDF (Maks. 10MB)</p>
          </>
        )}
      </div>

      {help && <span className="text-[12px] text-white/40">{help}</span>}
    </div>
  );
}
