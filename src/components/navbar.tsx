"use client";

import Link from "next/link";
import { Hammer, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
            <Hammer className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight">AuctSimply</span>
        </Link>

        <div className="flex items-center">
          <Button variant="default" className="rounded-full px-6 font-bold shadow-lg shadow-primary/20" asChild>
            <Link href="/auth/login">Login Admin</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
