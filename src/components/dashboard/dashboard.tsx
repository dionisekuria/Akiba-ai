import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  CircleDollarSign,
  Clock3,
  GraduationCap,
  House,
  Leaf,
  Lightbulb,
  LogOut,
  Menu,
  PiggyBank,
  ShieldCheck,
  Sparkles,
  Target,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { signOut } from "@/app/actions/auth";
import type { DashboardData, GoalSnapshot } from "@/lib/dashboard-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type DashboardProps =
  | { mode: "demo" }
  | { mode: "live"; data: DashboardData };

const demoGoals: GoalSnapshot[] = [
  {
    id: "demo-emergency",
    name: "A little breathing room",
    category: "Emergency fund",
    targetAmount: 60000,
    savedAmount: 28500,
    targetDate: null,
  },
  {
    id: "demo-learning",
    name: "My next qualification",
    category: "Education",
    targetAmount: 45000,
    savedAmount: 25200,
    targetDate: "2026-11-15",
  },
  {
    id: "demo-home",
    name: "A place of my own",
    category: "Home",
    targetAmount: 120000,
    savedAmount: 33600,
    targetDate: "2027-04-30",
  },
];

const navigation: {
  href: string;
  icon: LucideIcon;
  label: string;
}[] = [
  { href: "#overview", icon: House, label: "Overview" },
  { href: "#goals", icon: Target, label: "My goals" },
  { href: "#learning", icon: BookOpen, label: "Learn" },
  { href: "#profile", icon: CircleDollarSign, label: "My profile" },
];

function formatKes(amount: number) {
  return `KSh ${new Intl.NumberFormat("en-KE", {
    maximumFractionDigits: 0,
  }).format(amount)}`;
}

function formatTargetDate(date: string | null) {
  if (!date) {
    return "No date set";
  }

  return new Intl.DateTimeFormat("en-KE", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T12:00:00Z`));
}

function getGoalIcon(category: string): ReactNode {
  const normalized = category.toLowerCase();
  if (normalized.includes("education") || normalized.includes("learn")) {
    return <GraduationCap aria-hidden="true" className="size-5" />;
  }
  if (normalized.includes("home") || normalized.includes("house")) {
    return <House aria-hidden="true" className="size-5" />;
  }
  if (
    normalized.includes("emergency") ||
    normalized.includes("buffer") ||
    normalized.includes("rainy")
  ) {
    return <PiggyBank aria-hidden="true" className="size-5" />;
  }
  if (
    normalized.includes("work") ||
    normalized.includes("career") ||
    normalized.includes("business")
  ) {
    return <BriefcaseBusiness aria-hidden="true" className="size-5" />;
  }
  return <Target aria-hidden="true" className="size-5" />;
}

function NavigationLinks({ mobile = false }: { mobile?: boolean }) {
  return (
    <nav aria-label={mobile ? "Main navigation" : "Workspace navigation"}>
      <ul
        className={
          mobile
            ? "flex items-center justify-around"
            : "space-y-1"
        }
      >
        {navigation.map(({ href, icon: Icon, label }, index) => (
          <li key={href}>
            <Link
              aria-current={index === 0 ? "page" : undefined}
              className={
                mobile
                  ? "flex min-w-14 flex-col items-center gap-1 rounded-xl px-2 py-2 text-[11px] text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  : `flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                      index === 0
                        ? "bg-secondary text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`
              }
              href={href}
            >
              <Icon aria-hidden="true" className={mobile ? "size-5" : "size-4"} />
              <span>{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function GoalCard({ goal, index }: { goal: GoalSnapshot; index: number }) {
  const icon = getGoalIcon(goal.category);
  const percentage =
    goal.targetAmount > 0
      ? Math.min(
          100,
          Math.round((Math.max(0, goal.savedAmount) / goal.targetAmount) * 100),
        )
      : 0;
  const accents = [
    "bg-[#edf2e7] text-[#51704d]",
    "bg-[#f7eee0] text-[#927342]",
    "bg-[#e8f0ed] text-[#41695a]",
  ];

  return (
    <Card className="gap-5 border-border/70 bg-card py-5 shadow-[0_2px_12px_rgba(31,55,42,0.025)]">
      <CardHeader className="px-5">
        <div className="flex items-start justify-between gap-3">
          <span
            className={`flex size-11 shrink-0 items-center justify-center rounded-2xl ${accents[index % accents.length]}`}
          >
            {icon}
          </span>
          <Badge
            className="mt-1 border-0 bg-muted text-[11px] font-medium text-muted-foreground"
            variant="secondary"
          >
            {goal.category}
          </Badge>
        </div>
        <CardTitle className="mt-2 text-base font-semibold tracking-tight">
          {goal.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 px-5">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xl font-semibold tracking-tight tabular-nums">
              {formatKes(goal.savedAmount)}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              of {formatKes(goal.targetAmount)}
            </p>
          </div>
          <span className="pb-0.5 text-sm font-semibold text-primary">
            {percentage}%
          </span>
        </div>
        <Progress
          aria-label={`${goal.name}: ${percentage}% of the goal target`}
          className="h-2 bg-[#edf0e9]"
          value={percentage}
        />
        <div className="flex items-center gap-1.5 pt-1 text-xs text-muted-foreground">
          <CalendarDays aria-hidden="true" className="size-3.5" />
          <span>Target {formatTargetDate(goal.targetDate)}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function LearningCard({
  icon: Icon,
  label,
  title,
  duration,
  tone,
}: {
  icon: LucideIcon;
  label: string;
  title: string;
  duration: string;
  tone: string;
}) {
  return (
    <article className="group flex gap-4 rounded-2xl border border-border/70 bg-card p-4 transition-colors hover:border-primary/25 hover:bg-white">
      <span
        className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${tone}`}
      >
        <Icon aria-hidden="true" className="size-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
          {label}
        </p>
        <h3 className="mt-1 text-sm leading-5 font-semibold tracking-tight">
          {title}
        </h3>
        <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock3 aria-hidden="true" className="size-3.5" />
          {duration}
        </p>
      </div>
      <ArrowRight
        aria-hidden="true"
        className="mt-2 size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
      />
    </article>
  );
}

export function Dashboard(props: DashboardProps) {
  const isDemo = props.mode === "demo";
  const data = props.mode === "live" ? props.data : null;
  const displayName = isDemo ? "Njeri" : (data?.displayName ?? "there");
  const goals = isDemo
    ? demoGoals
    : data?.status === "ready"
      ? data.goals
      : [];
  const isDataError = !isDemo && data?.status === "error";
  const totalSaved = goals.reduce((total, goal) => total + goal.savedAmount, 0);
  const totalTarget = goals.reduce(
    (total, goal) => total + goal.targetAmount,
    0,
  );
  const overallProgress =
    totalTarget > 0 ? Math.min(100, Math.round((totalSaved / totalTarget) * 100)) : 0;

  return (
    <div className="min-h-screen">
      {isDemo && (
        <div
          aria-label="Sample dashboard preview"
          className="border-b border-[#e1cf9e] bg-[#faf1d9] px-4 py-2.5 text-center text-xs leading-5 text-[#665630] sm:text-sm"
          role="status"
        >
          <span className="font-semibold">Sample preview.</span> Every name,
          goal and amount below is illustrative—not a real account.
        </div>
      )}

      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside className="hidden w-[246px] shrink-0 border-r border-border/70 bg-card px-5 py-7 md:sticky md:top-0 md:flex md:h-screen md:flex-col">
          <Link
            aria-label="Akiba home"
            className="mb-11 flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            href="#overview"
          >
            <span className="flex size-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <Leaf aria-hidden="true" className="size-5" />
            </span>
            <span>
              <span className="block text-[19px] leading-5 font-semibold tracking-tight">
                akiba
              </span>
              <span className="mt-1 block text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
                your money, made human
              </span>
            </span>
          </Link>

          <p className="mb-3 px-3 text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
            Your space
          </p>
          <NavigationLinks />

          <div className="mt-auto">
            <div className="mb-4 rounded-2xl bg-[#f1f4ec] p-4">
              <span className="mb-3 flex size-8 items-center justify-center rounded-xl bg-white text-primary">
                <Lightbulb aria-hidden="true" className="size-4" />
              </span>
              <p className="text-sm font-semibold">Small steps count.</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                A plan that feels right for you is a good place to start.
              </p>
              <a
                className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                href="#learning"
              >
                Explore a lesson <ArrowUpRight aria-hidden="true" className="size-3.5" />
              </a>
            </div>
            <div
              className="flex items-center gap-3 rounded-2xl border border-border/70 bg-white p-3"
              id="profile"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#e9eee5] text-xs font-semibold text-primary">
                {displayName.slice(0, 1).toUpperCase()}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold">
                  {displayName}
                </span>
                <span className="mt-0.5 block text-[11px] text-muted-foreground">
                  {isDemo ? "Illustrative profile" : "Your personal space"}
                </span>
              </span>
              {!isDemo && (
                <form action={signOut}>
                  <button
                    aria-label="Sign out"
                    className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    title="Sign out"
                    type="submit"
                  >
                    <LogOut aria-hidden="true" className="size-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="flex min-h-[72px] items-center justify-between gap-4 border-b border-border/70 bg-background/90 px-4 sm:px-7 lg:px-10">
            <div className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground md:hidden">
                <Leaf aria-hidden="true" className="size-4.5" />
              </span>
              <span className="text-sm font-semibold tracking-tight md:hidden">
                akiba
              </span>
              <span className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
                <span>My space</span>
                <span aria-hidden="true">/</span>
                <span className="font-medium text-foreground">Overview</span>
              </span>
              <span className="text-xs font-medium text-muted-foreground sm:hidden">
                Overview
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden items-center gap-2 rounded-full border border-border/80 bg-card px-3 py-2 text-xs text-muted-foreground sm:flex">
                <ShieldCheck aria-hidden="true" className="size-3.5 text-primary" />
                Your space is private
              </span>
              <span
                aria-label={displayName}
                className="flex size-9 items-center justify-center rounded-full bg-[#e9eee5] text-xs font-semibold text-primary md:hidden"
              >
                {displayName.slice(0, 1).toUpperCase()}
              </span>
              {!isDemo && (
                <form action={signOut} className="md:hidden">
                  <button
                    className="flex size-9 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    title="Sign out"
                    type="submit"
                  >
                    <LogOut aria-hidden="true" className="size-4" />
                    <span className="sr-only">Sign out</span>
                  </button>
                </form>
              )}
              {isDemo && (
                <Menu
                  aria-hidden="true"
                  className="size-5 text-muted-foreground md:hidden"
                />
              )}
            </div>
          </header>

          <main
            className="mx-auto max-w-[1280px] px-4 pt-7 pb-28 sm:px-7 sm:pt-9 lg:px-10 lg:pt-11 lg:pb-12"
            id="overview"
          >
            <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                  Your money journey, at your pace
                  <Sparkles aria-hidden="true" className="size-3.5 text-[#bd9654]" />
                </p>
                <h1 className="text-[1.8rem] leading-tight font-semibold tracking-[-0.045em] sm:text-[2.2rem]">
                  Good to have you here, {displayName}.
                </h1>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  A little progress is still progress. Let&apos;s see where you are.
                </p>
              </div>
              <div className="hidden items-center gap-2 rounded-xl border border-border/70 bg-card px-3 py-2.5 text-xs text-muted-foreground sm:flex">
                <CalendarDays aria-hidden="true" className="size-3.5" />
                Your personal overview
              </div>
            </div>

            {isDataError && (
              <div
                className="mb-6 rounded-2xl border border-[#e8d9ad] bg-[#faf5e5] px-4 py-3 text-sm leading-6 text-[#69572f]"
                role="alert"
              >
                Your plans couldn&apos;t be loaded right now. No sample amounts
                are being substituted. Try refreshing the page.
              </div>
            )}

            <section
              aria-label="Savings overview"
              className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-[1.35fr_1fr_1fr]"
            >
              <Card className="relative isolate min-h-[183px] overflow-hidden border-0 bg-[#234e3d] text-white shadow-[0_8px_30px_rgba(35,78,61,0.13)] sm:col-span-2 xl:col-span-1">
                <div
                  aria-hidden="true"
                  className="absolute -top-24 -right-16 -z-10 size-64 rounded-full border border-white/10"
                />
                <div
                  aria-hidden="true"
                  className="absolute -top-14 -right-6 -z-10 size-44 rounded-full border border-white/10"
                />
                <CardContent className="flex h-full min-h-[183px] flex-col justify-between p-6 sm:p-7">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm text-white/75">Your goals, together</p>
                    <span className="flex size-9 items-center justify-center rounded-xl bg-white/10">
                      <Wallet aria-hidden="true" className="size-4.5" />
                    </span>
                  </div>
                  <div>
                    <p className="text-[1.95rem] leading-none font-semibold tracking-[-0.04em] tabular-nums">
                      {formatKes(totalSaved)}
                    </p>
                    <p className="mt-2 text-xs text-white/65">
                      {isDemo ? "Illustrative total across sample goals" : "Recorded toward your goals"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-white/80">
                    <span className="flex size-5 items-center justify-center rounded-full bg-white/10">
                      <ArrowUpRight aria-hidden="true" className="size-3" />
                    </span>
                    {isDemo
                      ? "This sample is here to show how tracking could look"
                      : `${goals.length} ${goals.length === 1 ? "goal" : "goals"} in your plan`}
                  </div>
                </CardContent>
              </Card>

              <Card className="min-h-[183px] border-border/70 bg-card py-5 shadow-[0_2px_12px_rgba(31,55,42,0.025)]">
                <CardContent className="flex h-full flex-col justify-between px-5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm text-muted-foreground">Planned for</p>
                    <span className="flex size-9 items-center justify-center rounded-xl bg-[#f6f0e4] text-[#917548]">
                      <Target aria-hidden="true" className="size-4.5" />
                    </span>
                  </div>
                  <div>
                    <p className="text-2xl font-semibold tracking-tight tabular-nums">
                      {formatKes(totalTarget)}
                    </p>
                    <p className="mt-1.5 text-xs text-muted-foreground">
                      {isDemo ? "Combined illustrative goal targets" : "Across all your goal targets"}
                    </p>
                  </div>
                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <CircleDollarSign aria-hidden="true" className="size-3.5 text-primary" />
                    Amounts you chose for your plans
                  </p>
                </CardContent>
              </Card>

              <Card className="min-h-[183px] border-border/70 bg-card py-5 shadow-[0_2px_12px_rgba(31,55,42,0.025)]">
                <CardContent className="flex h-full flex-col justify-between px-5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm text-muted-foreground">Overall progress</p>
                    <span className="flex size-9 items-center justify-center rounded-xl bg-[#edf2e7] text-primary">
                      <Check aria-hidden="true" className="size-4.5" />
                    </span>
                  </div>
                  <div>
                    <div className="flex items-end gap-1.5">
                      <p className="text-2xl font-semibold tracking-tight tabular-nums">
                        {overallProgress}%
                      </p>
                      {isDemo && (
                        <span className="pb-1 text-xs text-muted-foreground">
                          sample
                        </span>
                      )}
                    </div>
                    <Progress
                      aria-label={`Overall goal progress: ${overallProgress}%`}
                      className="mt-3 h-2 bg-[#edf0e9]"
                      value={overallProgress}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {goals.length > 0
                      ? "One thoughtful step at a time"
                      : "Start with a goal that matters to you"}
                  </p>
                </CardContent>
              </Card>
            </section>

            <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(290px,0.9fr)]">
              <section aria-labelledby="goals-title" className="min-w-0" id="goals">
                <div className="mb-4 flex items-end justify-between gap-3">
                  <div>
                    <p className="mb-1 text-xs font-semibold tracking-[0.13em] text-muted-foreground uppercase">
                      Keep your plans close
                    </p>
                    <h2
                      className="text-xl font-semibold tracking-tight"
                      id="goals-title"
                    >
                      Goals you&apos;re working toward
                    </h2>
                  </div>
                  {goals.length > 0 && (
                    <a
                      className="mb-0.5 inline-flex min-h-9 shrink-0 items-center gap-1 text-xs font-semibold text-primary hover:underline focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      href="#goals"
                    >
                      Your goals <ArrowRight aria-hidden="true" className="size-3.5" />
                    </a>
                  )}
                </div>

                {goals.length > 0 ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {goals.map((goal, index) => (
                      <GoalCard goal={goal} index={index} key={goal.id} />
                    ))}
                  </div>
                ) : (
                  <Card className="border-dashed border-border bg-card py-0 shadow-none">
                    <CardContent className="flex flex-col items-center px-6 py-10 text-center sm:py-12">
                      <span className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-secondary text-primary">
                        <Target aria-hidden="true" className="size-5" />
                      </span>
                      <h3 className="text-base font-semibold">
                        {isDataError ? "Your plans will show up here" : "A goal begins with what matters to you"}
                      </h3>
                      <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                        {isDataError
                          ? "We couldn’t confirm your saved plans. Refresh to try again."
                          : "There are no goals in your plan yet. When you're ready, choose something meaningful and make a first, manageable plan."}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </section>

              <div className="space-y-6">
                <section aria-labelledby="coach-title" id="coach">
                  <Card className="overflow-hidden border-[#e5e7d9] bg-[#f1f4eb] py-5 shadow-none">
                    <CardHeader className="px-5">
                      <div className="flex items-start justify-between gap-3">
                        <span className="flex size-10 items-center justify-center rounded-2xl bg-white text-primary shadow-sm">
                          <Sparkles aria-hidden="true" className="size-5" />
                        </span>
                        <Badge
                          className="border border-[#dfe5d7] bg-white/70 text-[10px] tracking-[0.1em] text-primary uppercase"
                          variant="outline"
                        >
                          Coming soon
                        </Badge>
                      </div>
                      <CardTitle
                        className="mt-3 text-lg font-semibold tracking-tight"
                        id="coach-title"
                      >
                        A calmer money conversation
                      </CardTitle>
                      <p className="text-sm leading-6 text-muted-foreground">
                        Akiba will help you learn the basics and think through a
                        plan—without telling you what to buy.
                      </p>
                    </CardHeader>
                    <CardContent className="px-5">
                      <Button
                        className="h-10 rounded-xl bg-primary px-4 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
                        disabled
                        type="button"
                      >
                        <Sparkles aria-hidden="true" />
                        Meet Akiba
                      </Button>
                      <p className="mt-3 text-[11px] leading-5 text-muted-foreground">
                        Educational support only. Akiba never moves money or
                        places investments.
                      </p>
                    </CardContent>
                  </Card>
                </section>

                <section aria-labelledby="learning-title" id="learning">
                  <div className="mb-3 flex items-end justify-between gap-3">
                    <div>
                      <p className="mb-1 text-xs font-semibold tracking-[0.13em] text-muted-foreground uppercase">
                        Learn at your pace
                      </p>
                      <h2
                        className="text-lg font-semibold tracking-tight"
                        id="learning-title"
                      >
                        A little knowledge
                      </h2>
                    </div>
                    <a
                      aria-label="Explore learning resources"
                      className="mb-0.5 flex size-9 items-center justify-center rounded-xl border border-border/70 bg-card text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      href="#lesson-emergency"
                    >
                      <ArrowUpRight aria-hidden="true" className="size-4" />
                    </a>
                  </div>
                  <div className="space-y-3">
                    <LearningCard
                      duration="4 min read"
                      icon={PiggyBank}
                      label="Planning basics"
                      title="Building a small emergency cushion"
                      tone="bg-[#edf2e7] text-[#51704d]"
                    />
                    <LearningCard
                      duration="3 min read"
                      icon={BookOpen}
                      label="Money habits"
                      title="A simple plan for your next payday"
                      tone="bg-[#f7eee0] text-[#927342]"
                    />
                  </div>
                </section>

                <section
                  aria-label="Learning tip"
                  className="rounded-2xl border border-border/70 bg-card p-4"
                  id="lesson-emergency"
                >
                  <p className="flex items-center gap-2 text-xs font-semibold text-primary">
                    <Lightbulb aria-hidden="true" className="size-4" />
                    A gentle reminder
                  </p>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">
                    Your circumstances are unique. Take what is useful, ask
                    questions, and move at a pace that works for you.
                  </p>
                </section>
              </div>
            </div>

            <footer className="mt-10 border-t border-border/70 pt-5 text-[11px] leading-5 text-muted-foreground">
              Akiba AI is an educational and planning tool, not a bank or
              licensed financial adviser. Goal amounts are plans you record—not
              bank balances or transactions. Past performance does not guarantee
              future results.
            </footer>
          </main>

          <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border/80 bg-background/95 px-3 pt-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] backdrop-blur-md md:hidden">
            <NavigationLinks mobile />
          </div>
        </div>
      </div>
    </div>
  );
}
