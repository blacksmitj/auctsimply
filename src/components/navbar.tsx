"use client";

import Link from "next/link";
import { Hammer } from "lucide-react";
import { Button } from "@/components/ui/button";

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

        <nav className="flex items-center space-x-4">
          <Button variant="ghost" asChild>
            <Link href="/">Lelang</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin">Panel Admin</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
