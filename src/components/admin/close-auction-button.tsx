"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Gavel, Loader2 } from "lucide-react";
import { closeAuction } from "@/actions/items";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface CloseAuctionButtonProps {
  itemId: string;
}

export default function CloseAuctionButton({ itemId }: CloseAuctionButtonProps) {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = async () => {
    try {
      setIsClosing(true);
      const res = await closeAuction(itemId);
      
      if (res.success) {
        toast.success("Lelang berhasil ditutup");
      } else {
        toast.error(res.error || "Gagal menutup lelang");
      }
    } catch (err) {
      toast.error("Terjadi kesalahan saat menutup lelang");
    } finally {
      setIsClosing(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="w-full" variant="destructive" disabled={isClosing}>
          {isClosing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Gavel className="mr-2 h-4 w-4" />}
          Tutup Lelang Sekarang
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Tutup Lelang?</AlertDialogTitle>
          <AlertDialogDescription>
            Tindakan ini akan menghentikan seluruh penawaran baru dan menetapkan penawar tertinggi saat ini sebagai pemenang.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleClose}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Tutup Lelang
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
