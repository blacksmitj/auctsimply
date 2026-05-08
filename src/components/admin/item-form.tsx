"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createItem, updateItem } from "@/actions/items";
import { itemSchema } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";
import FileUploadMultiple from "@/components/file-upload-multiple";

type ItemFormValues = z.infer<typeof itemSchema>;

interface ItemFormProps {
  initialData?: any;
}

export default function ItemForm({ initialData }: ItemFormProps) {
  const router = useRouter();

  const form = useForm<ItemFormValues>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      basePrice: Number(initialData?.basePrice) || 0,
      images: initialData?.images?.map((img: any) => ({
        url: img.url,
        path: img.path,
        isPrimary: !!img.isPrimary,
      })) || [],
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = form;

  const images = watch("images");

  const onSubmit: SubmitHandler<ItemFormValues> = async (data) => {
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
        <div className="space-y-4">
          <FieldLabel>Gambar Barang</FieldLabel>
          <FileUploadMultiple
            value={images}
            onChange={(val) => setValue("images", val, { shouldValidate: true })}
          />
          <FieldError errors={[errors.images]} />
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
        <Button type="submit" disabled={isSubmitting}>
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
