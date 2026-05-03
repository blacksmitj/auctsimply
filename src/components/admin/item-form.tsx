"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createItem, updateItem, uploadImage } from "@/actions/items";
import { itemSchema } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

type ItemFormValues = z.infer<typeof itemSchema>;

interface ItemFormProps {
  initialData?: any;
}

export default function ItemForm({ initialData }: ItemFormProps) {
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  const form = useForm<ItemFormValues>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      basePrice: initialData?.basePrice || 0,
      imageUrl: initialData?.imageUrl || "",
      imagePath: initialData?.imagePath || "",
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = form;

  const imageUrl = watch("imageUrl");

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await uploadImage(formData);
      if (res.success) {
        setValue("imageUrl", res.url);
        setValue("imagePath", res.path);
        toast.success("Gambar berhasil diunggah");
      } else {
        toast.error(res.error || "Gagal mengunggah gambar");
      }
    } catch (err) {
      toast.error("Terjadi kesalahan saat mengunggah");
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: ItemFormValues) => {
    try {
      let res;
      if (initialData?.id) {
        res = await updateItem(initialData.id, data);
      } else {
        res = await createItem(data);
      }

      if (res.success) {
        toast.success(initialData?.id ? "Barang diperbarui" : "Barang ditambahkan");
        router.push("/admin/items");
      } else {
        toast.error(res.error || "Gagal menyimpan barang");
      }
    } catch (err) {
      toast.error("Terjadi kesalahan sistem");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left: Basic Info */}
        <div className="lg:col-span-2 space-y-6">
          <Field>
            <FieldLabel htmlFor="title">Judul Barang</FieldLabel>
            <Input
              id="title"
              {...register("title")}
              placeholder="Masukkan judul barang"
            />
            <FieldError errors={[errors.title]} />
          </Field>

          <Field>
            <FieldLabel htmlFor="description">Deskripsi</FieldLabel>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Jelaskan detail barang..."
              rows={6}
            />
            <FieldError errors={[errors.description]} />
          </Field>

          <Field>
            <FieldLabel htmlFor="basePrice">Harga Awal (Base Price)</FieldLabel>
            <Input
              id="basePrice"
              type="number"
              {...register("basePrice", { valueAsNumber: true })}
              placeholder="Contoh: 1000000"
            />
            <FieldError errors={[errors.basePrice]} />
          </Field>
        </div>

        {/* Right: Image Upload */}
        <div className="space-y-6">
          <FieldLabel>Gambar Barang</FieldLabel>
          <Card className="overflow-hidden">
            <CardContent className="p-4">
              {imageUrl ? (
                <div className="relative aspect-square rounded-lg overflow-hidden border">
                  <Image src={imageUrl} alt="Preview" fill className="object-cover" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8"
                    onClick={() => {
                      setValue("imageUrl", "");
                      setValue("imagePath", "");
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <label
                  htmlFor="image-upload"
                  className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors hover:bg-muted/50 relative"
                >
                  <div className="flex flex-col items-center justify-center pb-6 pt-5">
                    <Upload className="mb-4 h-8 w-8 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground font-semibold">
                      Klik untuk upload gambar
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG, atau WebP
                    </p>
                  </div>
                  <input
                    id="image-upload"
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                  />
                  {isUploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/50">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  )}
                </label>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-end space-x-4 border-t pt-8">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Batal
        </Button>
        <Button type="submit" disabled={isSubmitting || isUploading}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            initialData?.id ? "Simpan Perubahan" : "Tambah Barang"
          )}
        </Button>
      </div>
    </form>
  );
}
