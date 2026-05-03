"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { Gavel } from "lucide-react";

interface ItemCardProps {
  item: any;
}

export default function ItemCard({ item }: ItemCardProps) {
  const highestBid = item.bids?.[0]?.amount || item.basePrice;

  return (
    <Card className="group overflow-hidden border-none bg-card/50 transition-all hover:shadow-2xl hover:shadow-primary/10">
      <div className="relative aspect-4/3 overflow-hidden">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <Gavel className="h-12 w-12 text-muted-foreground/30" />
          </div>
        )}
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="bg-background/80 backdrop-blur-md">
            {item._count?.bids || 0} Penawaran
          </Badge>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="mb-1 text-lg font-bold tracking-tight">{item.title}</h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {item.description}
        </p>
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t p-4">
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
            Current Bid
          </span>
          <span className="text-lg font-black text-primary">
            {formatCurrency(Number(highestBid))}
          </span>
        </div>
        <Button size="sm" asChild>
          <Link href={`/items/${item.id}`}>Detail</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
