import { getItemById } from "@/actions/items";
import ItemForm from "@/components/admin/item-form";
import { notFound } from "next/navigation";

export default async function EditItemPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const item = await getItemById(id);

  if (!item) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Barang</h1>
        <p className="text-muted-foreground">Perbarui informasi barang lelang.</p>
      </div>

      <ItemForm initialData={item} />
    </div>
  );
}
