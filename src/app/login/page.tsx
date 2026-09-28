import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Sprout } from "lucide-react";
import { AuthForm } from "@/app/login/auth-form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in or create your private Akiba AI planning account.",
};

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const isConfigured = isSupabaseConfigured();
  if (isConfigured) {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase.auth.getClaims();
    if (data?.claims) {
      redirect("/");
    }
  }

  return (
    <main className="min-h-screen bg-background px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-md">
        <Link
          className="mb-8 inline-flex items-center gap-2 rounded-lg text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          href="/"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Back to Akiba AI
        </Link>

        <Card className="rounded-3xl border-border/80 bg-card shadow-sm">
          <CardHeader className="space-y-5 px-6 pt-8 sm:px-8">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-secondary text-primary">
              <Sprout aria-hidden="true" className="size-6" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                Your money journey, your pace.
              </h1>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Sign in or create an account to keep your goals private and
                organised.
              </p>
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-8 sm:px-8">
            <AuthForm isConfigured={isConfigured} />
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-xs leading-5 text-muted-foreground">
          Akiba AI provides educational information and personal planning tools,
          not personalised investment advice or a financial service.
        </p>
      </div>
    </main>
  );
}
