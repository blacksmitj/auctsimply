import { getItemById } from "@/actions/items";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import ItemDetail from "@/components/item-detail";
import Navbar from "@/components/navbar";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const { id } = await params;
  const item = await getItemById(id);

  if (!item) return { title: "Item Not Found" };

  return {
    title: `${item.title} | AuctSimply`,
    description: item.description.substring(0, 160),
    openGraph: {
      images: [item.imageUrl || ""],
    },
  };
}

export default async function ItemPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const queryClient = new QueryClient();

  const item = await queryClient.fetchQuery({
    queryKey: ["items", id],
    queryFn: () => getItemById(id),
  });

  if (!item) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <ItemDetail id={id} />
        </HydrationBoundary>
      </main>
    </div>
  );
}
