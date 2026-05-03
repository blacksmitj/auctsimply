"use client";

import { useQuery } from "@tanstack/react-query";
import { getItems, getItemById } from "@/actions/items";

export function useItems(initialData?: any) {
  return useQuery({
    queryKey: ["items"],
    queryFn: () => getItems(),
    initialData,
    staleTime: 1000 * 60, // 1 minute
  });
}

export function useItem(id: string, initialData?: any) {
  return useQuery({
    queryKey: ["items", id],
    queryFn: () => getItemById(id),
    initialData,
    enabled: !!id,
  });
}
