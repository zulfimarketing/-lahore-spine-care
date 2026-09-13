import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DashboardClient from "@/components/DashboardClient";

export default function DashboardPage() {
  const session = cookies().get("lsc_admin_session");
  if (!session) {
    redirect("/admin");
  }
  return <DashboardClient />;
}
