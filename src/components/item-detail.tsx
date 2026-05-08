"use client";

import Image from "next/image";
import { useItem } from "@/hooks/use-items";
import { formatCurrency } from "@/lib/utils";
import BidForm from "@/components/bid-form";
import BidList from "@/components/bid-list";
import { Loader2, Gavel, Calendar, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export default function ItemDetail({ id }: { id: string }) {
  const { data: item, isLoading } = useItem(id);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  useEffect(() => {
    if (item?.images?.length > 0) {
      const primary = item.images.find((img: any) => img.isPrimary) || item.images[0];
      setActiveImage(primary.url);
    }
  }, [item]);

  if (isLoading) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!item) return null;

  const highestBid = item.bids?.[0]?.amount || item.basePrice;
  const isClosed = item.status === "CLOSED";
  const winner = isClosed ? item.bids.find((b: any) => b.id === item.winnerId) : null;

  return (
    <div className="mx-auto max-w-6xl">
      <Button variant="ghost" className="mb-6 -ml-2" asChild>
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
        </Link>
      </Button>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Left: Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-3xl bg-muted shadow-2xl">
            {isClosed && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                <div className="rounded-2xl bg-white p-6 text-center shadow-2xl">
                  <div className="mb-2 text-xs font-black uppercase tracking-widest text-muted-foreground">Lelang Selesai</div>
                  <div className="text-2xl font-black text-primary">TERJUAL</div>
                </div>
              </div>
            )}
            {activeImage ? (
              <Image
                src={activeImage}
                alt={item.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <Gavel className="h-20 w-20 text-muted-foreground/20" />
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {item.images?.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {item.images.map((img: any) => (
                <button
                  key={img.path}
                  onClick={() => setActiveImage(img.url)}
                  className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                    activeImage === img.url ? "border-primary scale-105" : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img.url}
                    alt={item.title}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info & Bid Form */}
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">{item.title}</h1>
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="mr-2 h-4 w-4" />
              Ditambahkan {new Date(item.createdAt).toLocaleDateString("id-ID", { 
                day: "numeric", 
                month: "long", 
                year: "numeric" 
              })}
            </div>
          </div>

          <div className={`rounded-2xl p-6 transition-colors ${isClosed ? "bg-primary/5 border border-primary/20" : "bg-muted/50"}`}>
            <div className="mb-1 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              {isClosed ? "Harga Akhir" : "Bid Tertinggi Saat Ini"}
            </div>
            <div className="text-4xl font-black text-primary">
              {formatCurrency(Number(highestBid))}
            </div>
            {isClosed && winner && (
              <div className="mt-2 text-sm font-medium text-primary/60">
                Pemenang: <span className="font-bold text-primary">{winner.name}</span>
              </div>
            )}
          </div>

          <p className="text-lg leading-relaxed text-muted-foreground">
            {item.description}
          </p>

          <BidForm itemId={item.id} currentHighest={Number(highestBid)} disabled={isClosed} />
          
          <BidList bids={item.bids} />
        </div>
      </div>
    </div>
  );
}
