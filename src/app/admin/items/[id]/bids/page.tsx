import prisma from "@/lib/prisma";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { ArrowLeft, Phone } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";

export default async function AdminBidsPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const item = await prisma.item.findUnique({
    where: { id },
    include: {
      bids: {
        orderBy: { amount: "desc" }
      }
    }
  });

  if (!item) notFound();

  return (
    <div className="space-y-6">
      <Button variant="ghost" asChild className="-ml-2">
        <Link href="/admin/items">
          <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Daftar Barang
        </Link>
      </Button>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Riwayat Penawaran</h1>
        <p className="text-muted-foreground">Barang: <span className="font-semibold text-foreground">{item.title}</span></p>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Penawar</TableHead>
              <TableHead>No. WhatsApp</TableHead>
              <TableHead>Jumlah Bid</TableHead>
              <TableHead>Waktu</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {item.bids.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Belum ada penawaran.
                </TableCell>
              </TableRow>
            ) : (
              item.bids.map((bid: any) => (
                <TableRow key={bid.id}>
                  <TableCell className="font-medium">{bid.name}</TableCell>
                  <TableCell>{bid.phone}</TableCell>
                  <TableCell className="text-primary font-bold">
                    {formatCurrency(Number(bid.amount))}
                  </TableCell>
                  <TableCell>{new Date(bid.createdAt).toLocaleString("id-ID")}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" asChild>
                      <a 
                        href={`https://wa.me/${bid.phone.replace(/^0/, "62")}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <Phone className="mr-2 h-3 w-3" /> Hubungi
                      </a>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
