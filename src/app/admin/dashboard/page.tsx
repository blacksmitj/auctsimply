import prisma from "@/lib/prisma";
import { SectionCards } from "@/components/section-cards";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
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
    { 
      name: "Total Barang", 
      value: totalItems, 
      description: "Jumlah barang yang terdaftar", 
      trend: "up", 
      trendValue: "+12%", 
      icon: Package 
    },
    { 
      name: "Total Penawaran", 
      value: totalBids, 
      description: "Total bid yang masuk", 
      trend: "up", 
      trendValue: "+5%", 
      icon: Gavel 
    },
    { 
      name: "Bid Tertinggi", 
      value: formatCurrency(Number(highestBid._max.amount || 0)), 
      description: "Nilai penawaran tertinggi saat ini", 
      trend: "up", 
      trendValue: "+25%", 
      icon: TrendingUp 
    },
    { 
      name: "Penawar Unik", 
      value: "8", 
      description: "Calon pembeli yang aktif", 
      trend: "down", 
      trendValue: "-2%", 
      icon: Users 
    },
  ];

  return (
    <div className="flex flex-col gap-6 py-6">
      <div className="px-4 lg:px-6">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Ringkasan aktivitas jualan Anda.</p>
      </div>

      <SectionCards stats={stats} />

      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>

      {/* Recent Bids or Items list can go here */}
    </div>
  );
}

