import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Package, Gavel, Users, TrendingUp } from "lucide-react"

import data from "./data.json"

export default function Page() {
  const stats = [
    { 
      name: "Total Penawaran Saya", 
      value: "12", 
      description: "Lelang yang sedang diikuti", 
      trend: "up", 
      trendValue: "+2", 
      icon: Gavel 
    },
    { 
      name: "Barang Dimenangkan", 
      value: "3", 
      description: "Lelang yang berhasil dimenangkan", 
      trend: "up", 
      trendValue: "+1", 
      icon: Package 
    },
    { 
      name: "Penawaran Tertinggi", 
      value: "Rp 1.500.000", 
      description: "Bid tertinggi Anda saat ini", 
      trend: "up", 
      trendValue: "+5%", 
      icon: TrendingUp 
    },
    { 
      name: "Lelang Dipantau", 
      value: "45", 
      description: "Barang dalam wishlist Anda", 
      icon: Users 
    },
  ];

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards stats={stats} />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
              <DataTable data={data} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
