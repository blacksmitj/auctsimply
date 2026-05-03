"use client";

import { anonymizeName, formatCurrency } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

interface BidListProps {
  bids: any[];
}

export default function BidList({ bids }: BidListProps) {
  if (!bids || bids.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center">
        <p className="text-muted-foreground">Belum ada penawaran.</p>
        <p className="text-xs text-muted-foreground/60">Jadilah yang pertama!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-lg mb-4">Riwayat Penawaran</h3>
      <div className="divide-y rounded-xl border">
        {bids.map((bid, index) => (
          <div
            key={bid.id}
            className={`flex items-center justify-between p-4 ${
              index === 0 ? "bg-primary/5" : ""
            }`}
          >
            <div className="flex flex-col">
              <span className="font-semibold text-sm">
                {anonymizeName(bid.name)}
                {index === 0 && (
                  <span className="ml-2 text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full uppercase">
                    Tertinggi
                  </span>
                )}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {formatDistanceToNow(new Date(bid.createdAt), {
                  addSuffix: true,
                  locale: id,
                })}
              </span>
            </div>
            <div className="font-bold text-primary">
              {formatCurrency(bid.amount)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
