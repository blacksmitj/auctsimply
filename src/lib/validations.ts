import { z } from "zod";

export const itemSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter"),
  description: z.string().min(5, "Deskripsi minimal 5 karakter"),
  basePrice: z.number().min(0, "Harga awal tidak boleh negatif"),
  imageUrl: z.string().optional(),
  imagePath: z.string().optional(),
});

export const bidSchema = z.object({
  itemId: z.string(),
  name: z.string().min(3, "Nama minimal 3 karakter"),
  phone: z.string().regex(/^08[0-9]{8,11}$/, "Nomor WhatsApp tidak valid (Gunakan format 08xxx)"),
  amount: z.number().min(1000, "Minimal penawaran adalah Rp 1.000"),
});
