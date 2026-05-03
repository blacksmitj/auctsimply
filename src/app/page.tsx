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
        <HydrationBoundary state={dehydrate(queryClient)}>
          <ItemGrid />
        </HydrationBoundary>
      </main>
    </div>
  );
}
