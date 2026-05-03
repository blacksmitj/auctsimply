"use client";

import Image from "next/image";
import { useItem } from "@/hooks/use-items";
import { formatCurrency } from "@/lib/utils";
import BidForm from "@/components/bid-form";
import BidList from "@/components/bid-list";
import { Loader2, Gavel, Calendar, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ItemDetail({ id }: { id: string }) {
  const { data: item, isLoading } = useItem(id);

  if (isLoading) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!item) return null;

  const highestBid = item.bids?.[0]?.amount || item.basePrice;

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
            {item.imageUrl ? (
              <Image
                src={item.imageUrl}
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

          <div className="rounded-2xl bg-muted/50 p-6">
            <div className="mb-1 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Bid Tertinggi Saat Ini
            </div>
            <div className="text-4xl font-black text-primary">
              {formatCurrency(Number(highestBid))}
            </div>
          </div>

          <p className="text-lg leading-relaxed text-muted-foreground">
            {item.description}
          </p>

          <BidForm itemId={item.id} currentHighest={Number(highestBid)} />
          
          <BidList bids={item.bids} />
        </div>
      </div>
    </div>
  );
}
