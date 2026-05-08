"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { HelpCircle, Trash2, Upload, Loader2, Image as ImageIcon } from "lucide-react";
import { useRef, useState } from "react";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { generateSignedUrl } from "@/actions/items";
import { processImage } from "@/lib/image-utils";
import { toast } from "sonner";

interface ItemImage {
  url: string;
  path: string;
  isPrimary: boolean;
}

interface FileUploadMultipleProps {
  value: ItemImage[];
  onChange: (value: ItemImage[]) => void;
  className?: string;
}

export default function FileUploadMultiple({
  value = [],
  onChange,
  className,
}: FileUploadMultipleProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const newImages = [...value];
    const uploadPromises = Array.from(files).map(async (file) => {
      try {
        // 1. Process image on client (crop 1:1 & compress < 1MB)
        const processedBlob = await processImage(file);
        
        // 2. Get Signed URL from server
        const signedRes = await generateSignedUrl(file.name, "image/jpeg");
        
        if (!signedRes.success || !signedRes.signedUrl) {
          toast.error(`Gagal mendapatkan izin upload untuk ${file.name}`);
          return null;
        }

        // 3. Direct Upload to Supabase/S3 via Signed URL
        const uploadRes = await fetch(signedRes.signedUrl, {
          method: "PUT",
          body: processedBlob,
          headers: {
            "Content-Type": "image/jpeg",
          },
        });

        if (uploadRes.ok) {
          return {
            url: signedRes.publicUrl!,
            path: signedRes.path!,
            isPrimary: newImages.length === 0,
          };
        } else {
          toast.error(`Gagal mengunggah ${file.name} langsung ke storage`);
          return null;
        }
      } catch (err) {
        console.error(err);
        toast.error(`Terjadi kesalahan saat memproses ${file.name}`);
        return null;
      }
    });

    const results = await Promise.all(uploadPromises);
    const successfulUploads = results.filter((res): res is ItemImage => res !== null);
    
    if (successfulUploads.length > 0) {
      // Ensure only one is primary
      const updatedImages = [...value, ...successfulUploads];
      const hasPrimary = updatedImages.some(img => img.isPrimary);
      if (!hasPrimary && updatedImages.length > 0) {
        updatedImages[0].isPrimary = true;
      }
      
      onChange(updatedImages);
      toast.success(`${successfulUploads.length} gambar berhasil diunggah`);
    }
    
    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (index: number) => {
    const newImages = [...value];
    const removed = newImages.splice(index, 1)[0];
    
    // If we removed the primary image, make the first one primary
    if (removed.isPrimary && newImages.length > 0) {
      newImages[0].isPrimary = true;
    }
    
    onChange(newImages);
  };

  const setPrimary = (index: number) => {
    const newImages = value.map((img, i) => ({
      ...img,
      isPrimary: i === index,
    }));
    onChange(newImages);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (isUploading) return;
    handleFileSelect(e.dataTransfer.files);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="grid grid-cols-2 gap-4">
        {value.map((img, index) => (
          <div key={img.path} className="group relative aspect-square rounded-xl overflow-hidden border bg-muted shadow-sm">
            <Image
              src={img.url}
              alt={`Product ${index + 1}`}
              fill
              className="object-cover"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={img.isPrimary ? "default" : "secondary"}
                  size="sm"
                  className="h-8 text-[10px] px-2"
                  onClick={() => setPrimary(index)}
                >
                  {img.isPrimary ? "Utama" : "Jadikan Utama"}
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => removeImage(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Primary Badge */}
            {img.isPrimary && (
              <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                UTAMA
              </div>
            )}
          </div>
        ))}

        {/* Upload Button Box */}
        <div
          className={cn(
            "border-2 border-dashed border-border rounded-xl aspect-square flex flex-col items-center justify-center text-center cursor-pointer transition-colors hover:bg-muted/50 overflow-hidden",
            isUploading && "cursor-not-allowed opacity-80"
          )}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {isUploading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary mb-2" />
              <p className="text-[10px] font-medium text-muted-foreground">Uploading...</p>
            </div>
          ) : (
            <>
              <div className="mb-2 bg-muted rounded-full p-2">
                <Upload className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-[11px] font-medium text-foreground px-2">
                Tambah Gambar
              </p>
            </>
          )}
        </div>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        multiple
        onChange={(e) => handleFileSelect(e.target.files)}
        disabled={isUploading}
      />

      <div className="flex justify-between items-center px-1 pt-2 border-t">
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center text-[10px] text-muted-foreground cursor-help hover:text-foreground transition-colors">
                <HelpCircle className="h-3 w-3 mr-1" />
                Panduan Upload
              </div>
            </TooltipTrigger>
            <TooltipContent className="py-2 bg-background text-foreground border shadow-lg max-w-[200px]">
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Unggah hingga 5 gambar. Pilih satu sebagai gambar utama yang akan muncul di daftar lelang.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <span className="text-[10px] text-muted-foreground">
          {value.length} / 5 Gambar
        </span>
      </div>
    </div>
  );
}
