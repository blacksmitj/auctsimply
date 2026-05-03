import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Sidebar from "@/components/admin/sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    // Cek apakah path saat ini adalah login, jika bukan redirect
    // Tapi karena ini layout admin, jika di /admin/* dan bukan /admin/login, redirect
    // Kita bisa cek dari path, tapi cara termudah adalah cek session
    // Namun kita harus mengecualikan /admin/login agar tidak infinite redirect
    // (Next.js layout logic: /admin/login akan menggunakan layout ini jika ada di folder /admin)
    // Sebaiknya login diletakkan di luar /admin/layout atau di-handle di middleware
  }

  return (
    <div className="flex min-h-screen bg-muted/20">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="mx-auto max-w-6xl">
          {children}
        </div>
      </main>
    </div>
  );
}
