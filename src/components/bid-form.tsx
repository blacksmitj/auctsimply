"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSubmitBid } from "@/hooks/use-bids";
import { bidSchema } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { formatCurrency } from "@/lib/utils";
import { Loader2 } from "lucide-react";

type BidFormValues = z.infer<typeof bidSchema>;

interface BidFormProps {
  itemId: string;
  currentHighest: number;
}

export default function BidForm({ itemId, currentHighest }: BidFormProps) {
  const { mutate: submit, isPending } = useSubmitBid();

  const form = useForm<BidFormValues>({
    resolver: zodResolver(bidSchema),
    defaultValues: {
      itemId,
      name: "",
      phone: "",
      amount: 0,
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = form;

  // Load from localStorage
  useEffect(() => {
    const savedName = localStorage.getItem("bidder_name");
    const savedPhone = localStorage.getItem("bidder_phone");
    if (savedName) setValue("name", savedName);
    if (savedPhone) setValue("phone", savedPhone);
  }, [setValue]);

  const onSubmit = (data: BidFormValues) => {
    // Save to localStorage
    localStorage.setItem("bidder_name", data.name);
    localStorage.setItem("bidder_phone", data.phone);

    submit(data, {
      onSuccess: () => {
        setValue("amount", 0);
      }
    });
  };

  const minBid = currentHighest + 10000; // Increment minimal 10000 based on server action logic

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Kirim Penawaran</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Field>
            <FieldLabel htmlFor="name">Nama Lengkap</FieldLabel>
            <Input
              id="name"
              placeholder="Masukkan nama Anda"
              {...register("name")}
            />
            <FieldError errors={[errors.name]} />
          </Field>

          <Field>
            <FieldLabel htmlFor="phone">Nomor WhatsApp</FieldLabel>
            <Input
              id="phone"
              placeholder="08123456789"
              {...register("phone")}
            />
            <FieldError errors={[errors.phone]} />
          </Field>

          <Field>
            <FieldLabel htmlFor="amount">Jumlah Penawaran (IDR)</FieldLabel>
            <Input
              id="amount"
              type="number"
              placeholder={`Minimal ${formatCurrency(minBid)}`}
              {...register("amount", { valueAsNumber: true })}
            />
            <FieldError errors={[errors.amount]} />
          </Field>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Mengirim...
              </>
            ) : (
              "Kirim Bid Sekarang"
            )}
          </Button>
          <p className="text-center text-[10px] text-muted-foreground">
            Data Anda bersifat rahasia dan hanya dapat dilihat oleh admin.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
