"use client";

import { useItems } from "@/hooks/use-items";
import ItemCard from "@/components/item-card";
import { Loader2 } from "lucide-react";

export default function ItemGrid() {
  const { data: items, isLoading } = useItems();

  if (isLoading) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="flex h-64 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed">
        <p className="text-xl font-medium text-muted-foreground">Belum ada barang dijual.</p>
        <p className="text-sm text-muted-foreground/60">Cek kembali nanti!</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item: any) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}
