"use server";

import prisma from "@/lib/prisma";
import { z } from "zod";
import { bidSchema } from "@/lib/validations";

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

    return { success: true, data: JSON.parse(JSON.stringify(result)) };
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: error.message };
  }
}
