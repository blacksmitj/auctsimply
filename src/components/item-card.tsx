"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Gavel } from "lucide-react";

interface ItemCardProps {
  item: any;
  priority?: boolean;
}

export default function ItemCard({ item, priority }: ItemCardProps) {
  const highestBid = item.bids?.[0]?.amount || item.basePrice;
  const isClosed = item.status === "CLOSED";

  return (
    <Link href={`/items/${item.id}`} className="block">
      <Card className={`group relative flex flex-col overflow-hidden border-none bg-card/40 p-0 gap-0 backdrop-blur-sm transition-all hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-1 ${isClosed ? "opacity-80" : ""}`}>
        {/* Image Container */}
        <div className="relative h-[240px] sm:h-[300px] w-full overflow-hidden">
          {item.images?.length > 0 ? (
            <Image
              src={item.images.find((img: any) => img.isPrimary)?.url || item.images[0].url}
              alt={item.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className={`object-cover transition-transform duration-700 group-hover:scale-110 ${isClosed ? "grayscale opacity-70" : ""}`}
              priority={priority}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <Gavel className="h-12 w-12 text-muted-foreground/20" />
            </div>
          )}
          
          {isClosed && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
              <div className="rounded-xl bg-background/95 px-4 py-2 text-xs font-black uppercase tracking-widest text-primary shadow-2xl border border-primary/20">
                Selesai
              </div>
            </div>
          )}
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Top Badge (Floating) */}
          <div className="absolute top-3 right-3">
            <Badge className={`${isClosed ? "bg-muted/80 text-muted-foreground" : "bg-primary/90 text-primary-foreground"} border-none px-2 py-1 text-[10px] font-bold backdrop-blur-md shadow-lg`}>
              {item._count?.bids || 0} PENAWARAN
            </Badge>
          </div>
        </div>

        {/* Content */}
        <CardContent className="flex flex-col p-4 pt-5">
          <h3 className="line-clamp-1 text-lg font-bold tracking-tight mb-3 group-hover:text-primary transition-colors">
            {item.title}
          </h3>
          
          <div className="flex items-center justify-between mt-auto">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">
                {isClosed ? "Harga Akhir" : "Penawaran Tertinggi"}
              </span>
              <span className={`text-xl font-black tabular-nums ${isClosed ? "text-muted-foreground" : "text-primary"}`}>
                {formatCurrency(Number(highestBid))}
              </span>
            </div>
            
            <div className={`h-10 w-10 rounded-full flex items-center justify-center transition-all duration-300 ${isClosed ? "bg-muted text-muted-foreground" : "bg-primary/10 group-hover:bg-primary group-hover:text-primary-foreground"}`}>
              <Gavel className="h-5 w-5" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
