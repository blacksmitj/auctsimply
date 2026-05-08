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

  return (
    <Link href={`/items/${item.id}`} className="block">
      <Card className="group flex flex-row overflow-hidden border-none bg-card/50 transition-all hover:shadow-2xl hover:shadow-primary/10">
        <div className="relative aspect-square w-24 shrink-0 overflow-hidden sm:w-32">
          {item.images?.length > 0 ? (
            <Image
              src={item.images.find((img: any) => img.isPrimary)?.url || item.images[0].url}
              alt={item.title}
              fill
              sizes="(max-width: 640px) 100px, 150px"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              priority={priority}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <Gavel className="h-8 w-8 text-muted-foreground/30" />
            </div>
          )}
          <div className="absolute top-1 right-1">
            <Badge variant="secondary" className="bg-background/80 px-1.5 py-0 text-[10px] backdrop-blur-md">
              {item._count?.bids || 0} Bid
            </Badge>
          </div>
        </div>
        <CardContent className="flex flex-1 flex-col justify-center p-3 sm:p-4">
          <h3 className="line-clamp-1 text-sm font-bold tracking-tight sm:text-base">{item.title}</h3>
          
          <div className="mt-2 flex flex-col">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Penawaran Tertinggi
            </span>
            <span className="text-base font-black text-primary">
              {formatCurrency(Number(highestBid))}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
