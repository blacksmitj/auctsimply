"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitBid } from "@/actions/bids";
import { toast } from "sonner";

export function useSubmitBid() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitBid,
    onSuccess: (response, variables) => {
      if (response.success) {
        // Invalidate queries to refresh data
        queryClient.invalidateQueries({ queryKey: ["items"] });
        queryClient.invalidateQueries({ queryKey: ["items", variables.itemId] });
        toast.success("Penawaran berhasil dikirim!");
      } else {
        toast.error(response.error || "Gagal mengirim penawaran");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Terjadi kesalahan sistem");
    },
  });
}
