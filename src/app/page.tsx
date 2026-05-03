import { getItems } from "@/actions/items";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import ItemGrid from "@/components/item-grid";
import Navbar from "@/components/navbar";

export default async function HomePage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["items"],
    queryFn: getItems,
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-6xl mb-4">
            Jual Anonim <span className="text-primary">Anonim</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Temukan barang-barang eksklusif dengan sistem penawaran yang aman, transparan, dan tetap menjaga privasi Anda.
          </p>
        </div>

        <HydrationBoundary state={dehydrate(queryClient)}>
          <ItemGrid />
        </HydrationBoundary>
      </main>
    </div>
  );
}
