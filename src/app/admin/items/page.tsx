import prisma from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { Edit, Eye, Plus } from "lucide-react";
import DeleteButton from "@/components/admin/delete-button";

export default async function AdminItemsPage() {
  const items = await prisma.item.findMany({
    include: {
      images: true,
      _count: {
        select: { bids: true }
      },
      bids: {
        orderBy: { amount: "desc" },
        take: 1
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manajemen Barang</h1>
          <p className="text-muted-foreground">Kelola katalog barang jualan Anda.</p>
        </div>
        <Button asChild>
          <Link href="/admin/items/create">
            <Plus className="mr-2 h-4 w-4" /> Tambah Barang
          </Link>
        </Button>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Barang</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Base Price</TableHead>
              <TableHead>Penawaran Tertinggi</TableHead>
              <TableHead>Total Penawaran</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Belum ada barang.
                </TableCell>
              </TableRow>
            ) : (
              items.map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    <Link href={`/admin/items/${item.id}`} className="hover:underline text-primary font-bold">
                      {item.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.status === "CLOSED" ? "secondary" : "default"}>
                      {item.status === "CLOSED" ? "Selesai" : "Berlangsung"}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatCurrency(Number(item.basePrice || 0))}</TableCell>
                  <TableCell className="text-primary font-bold">
                    {formatCurrency(Number(item.bids[0]?.amount || 0))}
                  </TableCell>
                  <TableCell>{item._count.bids}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/items/${item.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/items/${item.id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <DeleteButton itemId={item.id} />
                    </div>
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
