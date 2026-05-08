import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Edit, 
  Phone, 
  MessageCircle, 
  Gavel, 
  Calendar,
  Clock,
  User,
  Trophy
} from "lucide-react";
import DeleteButton from "@/components/admin/delete-button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import DeleteBidButton from "@/components/admin/delete-bid-button";
import CloseAuctionButton from "@/components/admin/close-auction-button";
import WinnerButton from "@/components/admin/winner-button";

export default async function AdminItemDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const item = await prisma.item.findUnique({
    where: { id },
    include: {
      images: { orderBy: { isPrimary: "desc" } },
      bids: { orderBy: { amount: "desc" } }
    }
  });

  if (!item) notFound();

  const highestBid = item.bids[0];
  const isClosed = item.status === "CLOSED";

  return (
    <div className="space-y-8 pb-10">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" asChild className="-ml-2">
          <Link href="/admin/items">
            <ArrowLeft className="mr-2 h-4 w-4" /> Daftar Barang
          </Link>
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/admin/items/${item.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" /> Edit
            </Link>
          </Button>
          <DeleteButton itemId={item.id} />
        </div>
      </div>

      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">{item.title}</h1>
            <Badge 
              variant={isClosed ? "secondary" : "default"} 
              className={`h-7 px-4 rounded-full text-xs font-bold uppercase tracking-wider ${
                !isClosed ? "bg-green-500 hover:bg-green-600" : ""
              }`}
            >
              {isClosed ? "Penawaran Selesai" : "Sedang Berlangsung"}
            </Badge>
          </div>
          <p className="text-muted-foreground max-w-2xl text-lg leading-relaxed">{item.description}</p>
        </div>
        
        <div className="bg-primary/10 border border-primary/20 p-6 rounded-4xl text-right min-w-[240px]">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/70 mb-1">
            {isClosed ? "Pemenang Akhir" : "Penawaran Tertinggi"}
          </div>
          <div className="text-4xl font-black text-primary">
            {highestBid ? formatCurrency(Number(highestBid.amount)) : formatCurrency(Number(item.basePrice || 0))}
          </div>
          {highestBid && (
            <div className="text-xs font-medium text-primary/60 mt-1 flex items-center justify-end gap-1">
              <User className="h-3 w-3" /> {highestBid.name}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Images & Status */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="overflow-hidden border-none bg-muted/30 rounded-4xl shadow-sm">
             <div className="relative aspect-4/5">
                {item.images.length > 0 ? (
                  <Image 
                    src={item.images[0].url} 
                    alt={item.title} 
                    fill 
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-muted">
                    <Gavel className="h-20 w-20 text-muted-foreground/20" />
                  </div>
                )}
             </div>
             {item.images.length > 1 && (
               <div className="p-4 flex gap-2 overflow-x-auto scrollbar-hide">
                 {item.images.slice(1).map((img) => (
                   <div key={img.id} className="relative h-20 w-20 shrink-0 rounded-2xl overflow-hidden border-2 border-white shadow-sm">
                     <Image src={img.url} alt="" fill className="object-cover" />
                   </div>
                 ))}
               </div>
             )}
          </Card>

          <Card className="rounded-4xl border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4" /> Detail Waktu
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/50">
                <div className="text-xs font-bold text-muted-foreground">Dibuat</div>
                <div className="text-sm font-black">{new Date(item.createdAt).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}</div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/50">
                <div className="text-xs font-bold text-muted-foreground">Berakhir</div>
                <div className="text-sm font-black">
                  {item.endDate ? new Date(item.endDate).toLocaleString("id-ID") : "Open-ended"}
                </div>
              </div>
              
              {!isClosed ? (
                <CloseAuctionButton itemId={item.id} />
              ) : (
                <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex flex-col items-center gap-2">
                  <Trophy className="h-10 w-10 text-primary" />
                  <div className="text-center">
                    <div className="text-[10px] font-black uppercase tracking-widest text-primary/70">Pemenang</div>
                    <div className="text-xl font-black">{highestBid?.name || "Tidak ada penawar"}</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Bidder Directory */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="rounded-4xl border-none shadow-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between bg-muted/20 pb-6">
              <div className="space-y-1">
                <CardTitle className="text-2xl font-black">Daftar Penawar</CardTitle>
                <CardDescription>Seluruh riwayat penawaran ({item.bids.length} penawaran)</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/10">
                  <TableRow>
                    <TableHead className="pl-6 font-black uppercase text-[10px] tracking-widest">Penawar</TableHead>
                    <TableHead className="font-black uppercase text-[10px] tracking-widest">Jumlah Penawaran</TableHead>
                    <TableHead className="font-black uppercase text-[10px] tracking-widest">Waktu</TableHead>
                    <TableHead className="pr-6 text-right font-black uppercase text-[10px] tracking-widest">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {item.bids.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-40 text-center">
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                          <Gavel className="h-10 w-10 opacity-20" />
                          <p className="font-bold">Belum ada penawaran</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    item.bids.map((bid, index) => (
                      <TableRow 
                        key={bid.id} 
                        className={`group transition-colors ${
                          bid.id === item.winnerId ? "bg-primary/3" : "hover:bg-muted/20"
                        }`}
                      >
                        <TableCell className="pl-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-2xl bg-muted flex items-center justify-center group-hover:scale-110 transition-transform">
                              <User className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div>
                              <div className="font-black flex items-center gap-2">
                                {bid.name}
                                {bid.id === item.winnerId && (
                                  <Badge className="bg-yellow-500 hover:bg-yellow-600 h-5 px-2 rounded-full border-none">
                                    <Trophy className="h-3 w-3 mr-1" /> WINNER
                                  </Badge>
                                )}
                              </div>
                              <div className="text-xs text-muted-foreground font-bold tracking-tight">
                                {bid.phone}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className={`font-black text-lg ${index === 0 ? "text-primary" : "text-foreground"}`}>
                            {formatCurrency(Number(bid.amount))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs font-medium text-muted-foreground">
                            {new Date(bid.createdAt).toLocaleString("id-ID", { 
                              day: 'numeric', 
                              month: 'short', 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </div>
                        </TableCell>
                        <TableCell className="pr-6 text-right">
                          <div className="flex justify-end items-center gap-2">
                            <WinnerButton 
                              itemId={item.id} 
                              bidId={bid.id} 
                              isWinner={bid.id === item.winnerId} 
                            />
                            <Button variant="outline" size="icon" className="h-10 w-10 rounded-2xl border-muted hover:border-primary hover:text-primary transition-all" asChild>
                              <a href={`tel:${bid.phone}`} title="Telepon">
                                <Phone className="h-4 w-4" />
                              </a>
                            </Button>
                            <Button variant="outline" size="icon" className="h-10 w-10 rounded-2xl border-muted text-green-600 hover:text-white hover:bg-green-600 hover:border-green-600 transition-all" asChild>
                              <a 
                                href={`https://wa.me/${bid.phone.replace(/^0/, "62")}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                title="WhatsApp"
                              >
                                <MessageCircle className="h-4 w-4" />
                              </a>
                            </Button>
                            <DeleteBidButton bidId={bid.id} />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
