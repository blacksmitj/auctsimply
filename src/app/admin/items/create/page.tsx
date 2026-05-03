import ItemForm from "@/components/admin/item-form";

export default function CreateItemPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tambah Barang</h1>
        <p className="text-muted-foreground">Isi detail barang yang akan dijual.</p>
      </div>

      <ItemForm />
    </div>
  );
}
