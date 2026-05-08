"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trophy, Loader2, X } from "lucide-react";
import { toggleWinner } from "@/actions/items";
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

interface WinnerButtonProps {
  itemId: string;
  bidId: string;
  isWinner: boolean;
}

export default function WinnerButton({ itemId, bidId, isWinner }: WinnerButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    try {
      setIsLoading(true);
      const res = await toggleWinner(itemId, isWinner ? null : bidId);
      
      if (res.success) {
        toast.success(isWinner ? "Pemenang dibatalkan" : "Pemenang ditetapkan");
      } else {
        toast.error(res.error || "Gagal mengubah pemenang");
      }
    } catch (err) {
      toast.error("Terjadi kesalahan");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          variant={isWinner ? "secondary" : "outline"} 
          size="sm" 
          disabled={isLoading}
          className={`h-8 rounded-full px-4 text-[10px] font-black uppercase tracking-widest transition-all ${
            isWinner 
              ? "bg-yellow-500 hover:bg-yellow-600 text-white border-none shadow-lg shadow-yellow-500/20" 
              : "hover:border-yellow-500 hover:text-yellow-600 border-muted"
          }`}
        >
          {isLoading ? (
            <Loader2 className="h-3 w-3 animate-spin mr-1" />
          ) : isWinner ? (
            <>
              <X className="mr-1 h-3 w-3" /> Cancel
            </>
          ) : (
            <>
              <Trophy className="mr-1 h-3 w-3" /> Winner
            </>
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{isWinner ? "Batalkan Pemenang?" : "Jadikan Pemenang?"}</AlertDialogTitle>
          <AlertDialogDescription>
            {isWinner 
              ? "Tindakan ini akan membuka kembali lelang dan menghapus status pemenang dari penawar ini." 
              : "Tindakan ini akan otomatis MENUTUP lelang dan menetapkan penawar ini sebagai pemenang tunggal."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleToggle}
            className={isWinner ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : "bg-yellow-500 hover:bg-yellow-600 text-white"}
          >
            {isWinner ? "Ya, Batalkan" : "Ya, Jadikan Pemenang"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
