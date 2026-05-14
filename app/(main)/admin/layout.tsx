import { getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();

  // Protect admin routes: Must be logged in and have 'admin' role
  if (!user || user.role !== "admin") {
    console.log(`[AUTH GUARD] Unauthorized access attempt to /admin by: ${user?.email || 'Anonymous'}`);
    redirect("/");
  }

  return <>{children}</>;
}
