import { Dashboard } from "@/components/dashboard/dashboard";
import { DashboardSetup } from "@/components/dashboard/dashboard-setup";
import { getDashboardData } from "@/lib/dashboard-data";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Home() {
  if (!isSupabaseConfigured()) {
    if (process.env.NODE_ENV === "development") {
      return <Dashboard mode="demo" />;
    }

    return <DashboardSetup />;
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims?.sub) {
    redirect("/login");
  }

  const dashboardData = await getDashboardData(
    supabase,
    data.claims.sub,
    typeof data.claims.email === "string" ? data.claims.email : null,
  );

  return <Dashboard mode="live" data={dashboardData} />;
}
