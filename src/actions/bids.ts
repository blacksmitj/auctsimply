"use server";

import prisma from "@/lib/prisma";
import { z } from "zod";
import { bidSchema } from "@/lib/validations";

import { revalidatePath } from "next/cache";

const MIN_INCREMENT = 10000; // Kelipatan minimal 10rb

export async function submitBid(data: z.infer<typeof bidSchema>) {
  try {
    const validated = bidSchema.parse(data);

    const result = await prisma.$transaction(async (tx) => {
      // 1. Ambil data barang dan bid tertinggi
      const item = await tx.item.findUnique({
        where: { id: validated.itemId },
        include: {
          bids: {
            orderBy: { amount: "desc" },
            take: 1,
          },
        },
      });

      if (!item) throw new Error("Barang tidak ditemukan");

      // Validasi status barang
      if (item.status === "CLOSED") {
        throw new Error("Lelang sudah ditutup");
      }

      // Validasi waktu (jika ada endDate)
      if (item.endDate && new Date() > new Date(item.endDate)) {
        // Otomatis tutup jika waktu habis saat ada yang bid
        await tx.item.update({
          where: { id: item.id },
          data: { status: "CLOSED", winnerId: item.bids[0]?.id || null }
        });
        throw new Error("Lelang sudah berakhir");
      }

      const currentHighest = item.bids[0]?.amount ? Number(item.bids[0].amount) : Number(item.basePrice);
      
      // 2. Validasi kenaikan bid minimal
      const minRequired = currentHighest + MIN_INCREMENT;

      if (validated.amount < minRequired) {
        throw new Error(`Penawaran minimal adalah ${new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(minRequired)}`);
      }

      // 3. Simpan bid baru
      const newBid = await tx.bid.create({
        data: {
          itemId: validated.itemId,
          name: validated.name,
          phone: validated.phone,
          amount: validated.amount,
        },
      });

      return newBid;
    });

    revalidatePath(`/items/${validated.itemId}`);
    revalidatePath("/admin/items");
    return { success: true, data: JSON.parse(JSON.stringify(result)) };
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: error.message };
  }
}

export async function deleteBid(bidId: string) {
  try {
    const bid = await prisma.bid.findUnique({ where: { id: bidId } });
    if (!bid) throw new Error("Bid tidak ditemukan");
    
    await prisma.bid.delete({ where: { id: bidId } });
    
    revalidatePath(`/items/${bid.itemId}`);
    revalidatePath(`/admin/items/${bid.itemId}`);
    revalidatePath("/admin/items");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting bid:", error);
    return { success: false, error: error.message };
  }
}
