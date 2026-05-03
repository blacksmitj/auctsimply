"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { HelpCircle, Trash2, Upload, Loader2 } from "lucide-react";
import { useRef } from "react";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FileUpload01Props {
  value?: string;
  onUpload: (file: File) => void;
  onRemove: () => void;
  isUploading?: boolean;
  className?: string;
}

export default function FileUpload01({
  value,
  onUpload,
  onRemove,
  isUploading,
  className,
}: FileUpload01Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    onUpload(files[0]);
  };

  const handleBoxClick = () => {
    if (isUploading) return;
    fileInputRef.current?.click();
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
      <div
        className={cn(
          "border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors hover:bg-muted/50 relative overflow-hidden",
          value && "border-solid",
          isUploading && "cursor-not-allowed opacity-80"
        )}
        onClick={handleBoxClick}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {value ? (
          <div className="relative w-full aspect-video rounded-lg overflow-hidden border bg-muted">
            <Image
              src={value}
              alt="Preview"
              fill
              sizes="(max-width: 768px) 100vw, 800px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="h-9 w-9"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-4 bg-muted rounded-full p-4">
              <Upload className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">
              Unggah gambar barang
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Klik atau tarik gambar ke sini (Maks. 4MB)
            </p>
          </>
        )}

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={(e) => handleFileSelect(e.target.files)}
          disabled={isUploading}
        />

        {isUploading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/60 backdrop-blur-[1px] z-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
            <p className="text-xs font-medium text-muted-foreground animate-pulse">
              Sedang mengunggah...
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center px-1">
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center text-xs text-muted-foreground cursor-help hover:text-foreground transition-colors">
                <HelpCircle className="h-3.5 w-3.5 mr-1.5" />
                Butuh bantuan?
              </div>
            </TooltipTrigger>
            <TooltipContent className="py-3 bg-background text-foreground border shadow-xl max-w-[280px]">
              <div className="space-y-1.5">
                <p className="text-[13px] font-semibold">Panduan Gambar</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Gunakan gambar berkualitas tinggi untuk menarik minat pembeli. 
                  Format yang didukung: JPG, PNG, atau WebP. 
                  Ukuran maksimal file: 4MB.
                </p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
