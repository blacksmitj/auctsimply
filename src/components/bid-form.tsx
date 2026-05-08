"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSubmitBid } from "@/hooks/use-bids";
import { bidSchema } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { formatCurrency, formatNumber, parseNumber } from "@/lib/utils";
import { Loader2 } from "lucide-react";

type BidFormValues = z.infer<typeof bidSchema>;

interface BidFormProps {
  itemId: string;
  currentHighest: number;
  disabled?: boolean;
}

export default function BidForm({ itemId, currentHighest, disabled }: BidFormProps) {
  const { mutate: submit, isPending } = useSubmitBid();

  const form = useForm<BidFormValues>({
    resolver: zodResolver(bidSchema),
    defaultValues: {
      itemId,
      name: "",
      phone: "",
      amount: undefined as any,
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    control,
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
        setValue("amount", undefined as any);
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
              disabled={disabled}
            />
            <FieldError errors={[errors.name]} />
          </Field>

          <Field>
            <FieldLabel htmlFor="phone">Nomor WhatsApp</FieldLabel>
            <Input
              id="phone"
              placeholder="08123456789"
              {...register("phone")}
              disabled={disabled}
            />
            <FieldError errors={[errors.phone]} />
          </Field>

          <Field>
            <FieldLabel htmlFor="amount">Jumlah Penawaran</FieldLabel>
            <Controller
              name="amount"
              control={control}
              render={({ field: { onChange, value, ...field } }) => (
                <div className="relative group">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium text-sm transition-colors group-focus-within:text-primary">
                    Rp
                  </span>
                  <Input
                    {...field}
                    id="amount"
                    type="text"
                    className="pl-10 font-medium"
                    placeholder={disabled ? "Lelang Selesai" : `Contoh: ${formatNumber(minBid)}`}
                    value={formatNumber(value)}
                    disabled={disabled}
                    onChange={(e) => {
                      const rawValue = e.target.value;
                      const numericValue = parseNumber(rawValue);
                      if (rawValue === "") {
                        onChange(undefined);
                      } else if (!isNaN(numericValue)) {
                        onChange(numericValue);
                      }
                    }}
                  />
                </div>
              )}
            />
            <FieldError errors={[errors.amount]} />
          </Field>

          <Button type="submit" className="w-full" disabled={isPending || disabled}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Mengirim...
              </>
            ) : disabled ? (
              "Lelang Sudah Selesai"
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
