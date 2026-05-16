import { getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "../components/AdminSidebar";
import PointsAdminClient from "./PointsAdminClient";

export const metadata = { title: "Manage Points Rewards - Admin" };
export const dynamic = "force-dynamic";

export default async function AdminPointsPage() {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") redirect("/");

  return (
    <div className="flex relative min-h-screen w-full">
      <AdminSidebar />
      <main className="flex-1 md:ml-64 bg-background relative z-10 w-full min-h-screen">
        <div className="max-w-container-max mx-auto py-xl px-md flex flex-col gap-xl">
          <PointsAdminClient />
        </div>
      </main>
    </div>
  );
}
