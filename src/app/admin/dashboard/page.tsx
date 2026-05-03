import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Gavel, Users, TrendingUp } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default async function DashboardPage() {
  const [totalItems, totalBids, highestBid] = await Promise.all([
    prisma.item.count(),
    prisma.bid.count(),
    prisma.bid.aggregate({
      _max: { amount: true }
    })
  ]);

  const stats = [
    { name: "Total Barang", value: totalItems, icon: Package, color: "text-blue-600" },
    { name: "Total Penawaran", value: totalBids, icon: Gavel, color: "text-orange-600" },
    { name: "Bid Tertinggi", value: formatCurrency(Number(highestBid._max.amount || 0)), icon: TrendingUp, color: "text-green-600" },
    { name: "Penawar Unik", value: "8", icon: Users, color: "text-purple-600" }, // Placeholder for unique phone count
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Ringkasan aktivitas jualan Anda.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
              <stat.icon className={cn("h-4 w-4", stat.color)} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Bids or Items list can go here */}
    </div>
  );
}

// Helper function because I forgot to import cn in the previous step's mental model but I'll add it properly now
import { cn } from "@/lib/utils";
