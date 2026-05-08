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
import { formatCurrency } from "@/lib/utils";
import { Edit, Trash2, Plus } from "lucide-react";

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
              <TableHead>Base Price</TableHead>
              <TableHead>Bid Tertinggi</TableHead>
              <TableHead>Total Bid</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Belum ada barang.
                </TableCell>
              </TableRow>
            ) : (
              items.map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell>{formatCurrency(Number(item.basePrice || 0))}</TableCell>
                  <TableCell className="text-primary font-bold">
                    {formatCurrency(Number(item.bids[0]?.amount || 0))}
                  </TableCell>
                  <TableCell>{item._count.bids}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/items/${item.id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      {/* Delete logic will be added via client component later */}
                      <Button variant="ghost" size="icon" className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
