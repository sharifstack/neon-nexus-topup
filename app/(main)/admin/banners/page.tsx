import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import AdminSidebar from "../components/AdminSidebar";
import BannersClient from "./BannersClient";

export const metadata = {
  title: "Manage Banners – Admin",
};

export default async function AdminBannersPage() {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") {
    redirect("/login");
  }

  return (
    <div className="flex relative min-h-screen w-full">
      <AdminSidebar />
      <main className="flex-1 md:ml-64 bg-background relative z-10 w-full min-h-screen">
        <div className="max-w-container-max mx-auto py-xl flex flex-col gap-xl">
          <BannersClient />
        </div>
      </main>
    </div>
  );
}
