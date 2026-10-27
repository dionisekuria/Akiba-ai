import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  BriefcaseBusiness,
  CalendarDays,
  Clock3,
  GraduationCap,
  House,
  Lightbulb,
  LogOut,
  PiggyBank,
  ShieldCheck,
  Sparkles,
  Target,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { signOut } from "@/app/actions/auth";
import { AddGoalForm } from "@/components/dashboard/add-goal-form";
import { AkibaWordmark, HeroDiscs } from "@/components/brand/akiba-visuals";
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
  { href: "#goals", icon: Target, label: "Goals" },
  { href: "#learning", icon: BookOpen, label: "Learn" },
  { href: "#coach", icon: Sparkles, label: "Coach" },
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

function NavigationLinks({
  mobile = false,
  isDemo,
}: {
  mobile?: boolean;
  isDemo: boolean;
}) {
  return (
    <nav aria-label="Main navigation">
      <ul
        className={
          mobile
            ? "flex items-center justify-around"
            : "flex items-center gap-1 rounded-full p-1.5 akiba-glass"
        }
      >
        {navigation.map(({ href, icon: Icon, label }, index) => {
          const target =
            index === 1 && !isDemo ? "/goals" : href;
          return (
            <li key={href}>
              <Link
                aria-current={index === 0 ? "page" : undefined}
                className={
                  mobile
                    ? "flex min-w-14 flex-col items-center gap-1 rounded-xl px-2 py-2 text-[11px] font-medium text-white/85 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    : `flex min-h-10 items-center gap-2 rounded-full px-4 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                        index === 0
                          ? "bg-white text-[#a82e10]"
                          : "text-white/90 hover:bg-white/15"
                      }`
                }
                href={target}
              >
                <Icon aria-hidden="true" className={mobile ? "size-4.5" : "size-4"} />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
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
    "bg-[#fff0e7] text-[#b83d18]",
    "bg-[#f9ecd9] text-[#89532d]",
    "bg-[#f4e3df] text-[#8e3f2a]",
  ];

  return (
    <Card className="gap-5 rounded-[1.65rem] border-border/70 bg-card py-5 shadow-[0_12px_36px_rgba(70,38,21,0.06)]">
      <CardHeader className="px-5 sm:px-6">
        <div className="flex items-start justify-between gap-3">
          <span
            className={`flex size-12 shrink-0 items-center justify-center rounded-2xl ${accents[index % accents.length]}`}
          >
            {icon}
          </span>
          <Badge
            className="mt-1 max-w-[65%] whitespace-normal border-0 bg-secondary px-3 py-1 text-[10px] leading-4 font-semibold text-secondary-foreground"
            variant="secondary"
          >
            {goal.category}
          </Badge>
        </div>
        <CardTitle className="mt-2 break-words text-lg leading-6 font-semibold tracking-tight">
          {goal.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 px-5 sm:px-6">
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="break-all text-xl font-semibold tracking-tight tabular-nums sm:text-2xl">
              {formatKes(goal.savedAmount)}
            </p>
            <p className="mt-1 break-all text-xs text-muted-foreground">
              of {formatKes(goal.targetAmount)}
            </p>
          </div>
          <span className="pb-0.5 text-sm font-bold text-primary">
            {percentage}%
          </span>
        </div>
        <Progress
          aria-label={`${goal.name}: ${percentage}% of the goal target`}
          className="h-2.5 bg-[#f3e7dd]"
          value={percentage}
        />
        <div className="flex items-center gap-1.5 pt-1 text-xs text-muted-foreground">
          <CalendarDays aria-hidden="true" className="size-3.5 shrink-0" />
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
    <article className="group flex gap-4 rounded-[1.4rem] border border-border/70 bg-card p-4 transition-colors hover:border-primary/30 hover:bg-white">
      <span
        className={`flex size-11 shrink-0 items-center justify-center rounded-2xl ${tone}`}
      >
        <Icon aria-hidden="true" className="size-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold tracking-[0.12em] text-muted-foreground uppercase">
          {label}
        </p>
        <h3 className="mt-1 break-words text-sm leading-5 font-semibold tracking-tight">
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

function PhoneSnapshot({
  goals,
  totalSaved,
  totalTarget,
  overallProgress,
}: {
  goals: GoalSnapshot[];
  totalSaved: number;
  totalTarget: number;
  overallProgress: number;
}) {
  const firstGoal = goals[0];
  const progressStyle = {
    background: `conic-gradient(#fff ${overallProgress}%, rgb(255 255 255 / 0.18) 0)`,
  } satisfies CSSProperties;

  return (
    <div
      aria-hidden="true"
      className="relative mx-auto hidden w-full max-w-[310px] rotate-[4deg] rounded-[2.4rem] border border-white/55 bg-[#fff9f3]/95 p-3.5 text-[#27170f] shadow-[0_32px_70px_rgba(104,30,7,0.3)] xl:block"
    >
      <div className="rounded-[1.8rem] bg-[#21130e] p-5 text-white">
        <div className="mb-7 flex items-center justify-between">
          <AkibaWordmark className="scale-[0.82] origin-left" tone="light" />
          <span className="size-2 rounded-full bg-[#a5d6a0]" />
        </div>
        <p className="text-xs text-white/70">Recorded so far</p>
        <p className="mt-1 break-all text-2xl font-semibold tracking-tight">
          {formatKes(totalSaved)}
        </p>
        <div className="mt-5 flex items-center gap-4 rounded-2xl bg-white/10 p-3">
          <span
            className="flex size-16 shrink-0 items-center justify-center rounded-full p-1.5"
            style={progressStyle}
          >
            <span className="flex size-full items-center justify-center rounded-full bg-[#21130e] text-sm font-semibold">
              {overallProgress}%
            </span>
          </span>
          <span className="min-w-0">
            <span className="block text-xs text-white/65">Planned for</span>
            <span className="mt-1 block break-all text-sm font-semibold">
              {formatKes(totalTarget)}
            </span>
          </span>
        </div>
      </div>
      {firstGoal && (
        <div className="px-2 pt-4 pb-2">
          <p className="text-[10px] font-bold tracking-[0.12em] text-[#966d55] uppercase">
            First goal in focus
          </p>
          <p className="mt-2 break-words text-sm font-semibold">
            {firstGoal.name}
          </p>
          <p className="mt-1 break-all text-xs text-[#745746]">
            {formatKes(firstGoal.savedAmount)} saved
          </p>
        </div>
      )}
    </div>
  );
}

export function Dashboard(props: DashboardProps) {
  const isDemo = props.mode === "demo";
  const data = props.mode === "live" ? props.data : null;
  const displayName = isDemo ? "Njeri" : (data?.displayName ?? "there");
  const firstName = displayName.trim().split(/\s+/)[0] || "there";
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
    totalTarget > 0
      ? Math.min(100, Math.round((totalSaved / totalTarget) * 100))
      : 0;
  const showSnapshot = !isDataError && goals.length > 0;

  return (
    <div className="min-h-screen overflow-x-clip pb-24 sm:pb-28">
      {isDemo && (
        <div
          aria-label="Sample dashboard preview"
          className="border-b border-[#e7c99a] bg-[#fff2d6] px-4 py-2.5 text-center text-xs leading-5 text-[#5b3b28] sm:text-sm"
          role="status"
        >
          <span className="font-bold">Illustrative preview.</span> Names, goals,
          and amounts shown are examples—not a real account.
        </div>
      )}

      <main
        className="mx-auto max-w-[1500px] px-3 pt-3 sm:px-5 sm:pt-5 lg:px-8"
        id="overview"
      >
        <section className="akiba-hero-gradient relative isolate flex min-h-[690px] flex-col overflow-hidden rounded-[2rem] px-5 pt-5 pb-12 text-white shadow-[0_28px_80px_rgba(166,57,20,0.2)] sm:min-h-[660px] sm:rounded-[2.5rem] sm:px-8 sm:pt-7 sm:pb-14 lg:px-11 lg:pt-8 xl:rounded-[2.75rem]">
          <HeroDiscs className="-z-10" />
          <header className="relative z-10 flex min-h-12 items-center justify-between gap-3">
            <Link
              aria-label="Akiba AI overview"
              className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              href="#overview"
            >
              <AkibaWordmark tone="light" />
            </Link>

            <div className="hidden xl:block">
              <NavigationLinks isDemo={isDemo} />
            </div>

            {isDemo ? (
              <div className="flex items-center gap-2">
                <Button
                  asChild
                  className="h-10 rounded-full border border-white/45 bg-white/10 px-4 text-xs font-semibold text-white hover:bg-white/20 focus-visible:ring-white"
                  variant="outline"
                >
                  <Link href="/login">Log in</Link>
                </Button>
                <Button
                  asChild
                  className="h-10 rounded-full bg-white px-4 text-xs font-bold text-[#9f2d10] hover:bg-white/90"
                >
                  <Link href="/login">Sign up</Link>
                </Button>
              </div>
            ) : (
              <div
                className="akiba-glass flex max-w-[48%] items-center gap-2 rounded-full px-2 py-1.5 sm:max-w-none sm:gap-3 sm:px-3"
                id="profile"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-[#a73514]">
                  {displayName.slice(0, 1).toUpperCase()}
                </span>
                <span className="hidden max-w-36 truncate text-xs font-semibold sm:block">
                  {displayName}
                </span>
                <form action={signOut}>
                  <button
                    aria-label="Sign out"
                    className="flex size-8 items-center justify-center rounded-full text-white transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    title="Sign out"
                    type="submit"
                  >
                    <LogOut aria-hidden="true" className="size-4" />
                  </button>
                </form>
              </div>
            )}
          </header>

          <div className="relative z-10 mt-auto grid items-end gap-8 pt-20 xl:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.8fr)] xl:gap-10">
            <div className="max-w-[690px]">
              <p className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/35 bg-white/15 px-4 py-2 text-xs leading-5 font-semibold text-white shadow-sm backdrop-blur-md sm:text-sm">
                <Sparkles aria-hidden="true" className="size-4 shrink-0" />
                <span className="break-words">
                  Habari, {firstName} — your money journey, at your pace
                </span>
              </p>
              <h1 className="mt-6 max-w-[760px] text-[clamp(3.2rem,8vw,7.25rem)] leading-[0.88] font-semibold tracking-[-0.075em]">
                Save for
                <br />
                what matters.
              </h1>
              <p className="mt-6 max-w-xl text-sm leading-6 text-white/95 sm:text-base sm:leading-7">
                Make a thoughtful plan, keep your goals in view, and learn
                practical money basics one step at a time.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Button
                  asChild
                  className="h-12 rounded-full bg-white px-6 text-sm font-bold text-[#9f2d10] shadow-lg hover:bg-white/90"
                >
                  <Link href={isDemo ? "/login" : "/goals/new"}>
                    {isDemo ? "Start your plan" : "Create a goal"}
                    <ArrowUpRight aria-hidden="true" className="size-4" />
                  </Link>
                </Button>
                <a
                  className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/45 px-5 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  href="#goals"
                >
                  See progress
                  <ArrowDownRight aria-hidden="true" className="size-4" />
                </a>
              </div>
              <p className="mt-6 max-w-lg text-xs leading-5 text-white">
                Your records are for planning only. Akiba never moves money or
                places investments.
              </p>
            </div>

            {showSnapshot && (
              <div className="relative z-10 hidden justify-self-center pb-2 xl:block">
                <PhoneSnapshot
                  goals={goals}
                  totalSaved={totalSaved}
                  totalTarget={totalTarget}
                  overallProgress={overallProgress}
                />
              </div>
            )}
          </div>
        </section>

        {isDataError && (
          <div
            className="relative z-20 mt-5 rounded-2xl border border-[#e6c6a9] bg-[#fff4e8] px-4 py-3 text-sm leading-6 text-[#68432b]"
            role="alert"
          >
            Your plans couldn&apos;t be loaded right now. No sample amounts are
            being substituted. Try refreshing the page.
          </div>
        )}

        <section
          aria-label="Savings overview"
          className="relative z-20 -mt-2 grid gap-3 sm:-mt-5 sm:grid-cols-3 sm:gap-4 lg:-mt-8"
        >
          <Card className="min-w-0 overflow-hidden rounded-[1.6rem] border-0 bg-white py-5 shadow-[0_18px_48px_rgba(76,40,22,0.1)] sm:min-h-44 sm:py-6">
            <CardContent className="flex h-full flex-col justify-between gap-5 px-5 sm:px-6">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Recorded so far
                </p>
                <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-[#fff0e7] text-primary">
                  <Wallet aria-hidden="true" className="size-5" />
                </span>
              </div>
              <div>
                <p className="break-all text-2xl font-semibold tracking-tight tabular-nums sm:text-3xl">
                  {isDataError ? "Unavailable" : formatKes(totalSaved)}
                </p>
                <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
                  {isDemo
                    ? "Illustrative total across sample goals"
                    : "Manually recorded toward your goals"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="min-w-0 overflow-hidden rounded-[1.6rem] border-0 bg-[#21130e] py-5 text-white shadow-[0_18px_48px_rgba(76,40,22,0.1)] sm:min-h-44 sm:py-6">
            <CardContent className="flex h-full flex-col justify-between gap-5 px-5 sm:px-6">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-white/80">Planned for</p>
                <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-[#ffd1ae]">
                  <Target aria-hidden="true" className="size-5" />
                </span>
              </div>
              <div>
                <p className="break-all text-2xl font-semibold tracking-tight tabular-nums sm:text-3xl">
                  {isDataError ? "Unavailable" : formatKes(totalTarget)}
                </p>
                <p className="mt-1.5 text-xs leading-5 text-white/75">
                  {isDemo
                    ? "Combined illustrative goal targets"
                    : "Across your personal goal targets"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="min-w-0 overflow-hidden rounded-[1.6rem] border-0 bg-[#f9e3d3] py-5 shadow-[0_18px_48px_rgba(76,40,22,0.1)] sm:min-h-44 sm:py-6">
            <CardContent className="flex h-full flex-col justify-between gap-5 px-5 sm:px-6">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-[#76503c]">
                  Overall progress
                </p>
                <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-white/75 text-primary">
                  <ArrowUpRight aria-hidden="true" className="size-5" />
                </span>
              </div>
              <div>
                <p className="text-3xl font-semibold tracking-tight tabular-nums sm:text-4xl">
                  {isDataError ? "Unavailable" : `${overallProgress}%`}
                </p>
                {!isDataError && (
                  <Progress
                    aria-label={`Overall goal progress: ${overallProgress}%`}
                    className="mt-3 h-2.5 bg-white/75"
                    value={overallProgress}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </section>

        <div className="mt-12 grid items-start gap-8 xl:grid-cols-[minmax(0,1.65fr)_minmax(290px,0.85fr)] xl:gap-10">
          <section aria-labelledby="goals-title" className="min-w-0" id="goals">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
              <div className="min-w-0">
                <p className="mb-2 text-xs font-bold tracking-[0.14em] text-primary uppercase">
                  Keep your plans close
                </p>
                <h2
                  className="break-words text-2xl font-semibold tracking-[-0.045em] sm:text-3xl"
                  id="goals-title"
                >
                  Goals you&apos;re working toward
                </h2>
              </div>
              {!isDemo && (
                <Link
                  className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full border border-border bg-white px-4 text-xs font-bold text-foreground shadow-sm transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  href="/goals"
                >
                  All goals <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
              )}
            </div>

            {!isDemo && (
              <div className="mb-5">
                <AddGoalForm />
              </div>
            )}

            {goals.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {goals.map((goal, index) => (
                  <GoalCard goal={goal} index={index} key={goal.id} />
                ))}
              </div>
            ) : (
              <Card className="rounded-[1.65rem] border-dashed border-border bg-white py-0 shadow-none">
                <CardContent className="flex flex-col items-center px-6 py-10 text-center sm:py-12">
                  <span className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-secondary text-primary">
                    <Target aria-hidden="true" className="size-5" />
                  </span>
                  <h3 className="text-base font-semibold">
                    {isDataError
                      ? "Your plans will show up here"
                      : "A goal begins with what matters to you"}
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
              <Card className="relative isolate overflow-hidden rounded-[1.8rem] border-0 bg-[#21130e] py-6 text-white shadow-[0_18px_48px_rgba(54,27,17,0.14)]">
                <span
                  aria-hidden="true"
                  className="absolute -top-20 -right-14 -z-10 size-56 rounded-full border border-white/10"
                />
                <span
                  aria-hidden="true"
                  className="absolute -top-12 -right-2 -z-10 size-40 rounded-full border border-white/10"
                />
                <CardHeader className="px-5 sm:px-6">
                  <div className="flex items-start justify-between gap-3">
                    <span className="flex size-11 items-center justify-center rounded-2xl bg-white/10 text-[#ffc394]">
                      <Sparkles aria-hidden="true" className="size-5" />
                    </span>
                    <Badge className="h-auto border border-white/20 bg-white/10 px-3 py-1 text-[10px] tracking-[0.1em] text-white uppercase">
                      Coming soon
                    </Badge>
                  </div>
                  <CardTitle
                    className="mt-3 text-xl font-semibold tracking-tight text-white"
                    id="coach-title"
                  >
                    A calmer money conversation
                  </CardTitle>
                  <p className="text-sm leading-6 text-white/80">
                    Akiba will help you learn the basics and think through a
                    plan—without telling you what to buy.
                  </p>
                </CardHeader>
                <CardContent className="px-5 sm:px-6">
                  <Button
                    className="h-11 rounded-full bg-white px-5 text-xs font-bold text-[#21130e] hover:bg-white/90"
                    disabled
                    type="button"
                  >
                    <Sparkles aria-hidden="true" />
                    Meet Akiba
                  </Button>
                  <p className="mt-3 text-xs leading-5 text-white/80">
                    Educational support only. Akiba never moves money or places
                    investments.
                  </p>
                </CardContent>
              </Card>
            </section>

            <section aria-labelledby="learning-title" id="learning">
              <div className="mb-4">
                <p className="mb-2 text-xs font-bold tracking-[0.14em] text-primary uppercase">
                  Learn at your pace
                </p>
                <h2
                  className="text-xl font-semibold tracking-tight"
                  id="learning-title"
                >
                  A little knowledge
                </h2>
              </div>
              <div className="space-y-3">
                <LearningCard
                  duration="4 min read"
                  icon={PiggyBank}
                  label="Planning basics"
                  title="Building a small emergency cushion"
                  tone="bg-[#fff0e7] text-[#b83d18]"
                />
                <LearningCard
                  duration="3 min read"
                  icon={BookOpen}
                  label="Money habits"
                  title="A simple plan for your next payday"
                  tone="bg-[#f9ecd9] text-[#89532d]"
                />
              </div>
            </section>

            <section
              aria-label="Learning tip"
              className="rounded-[1.4rem] border border-border/70 bg-white p-5"
              id="lesson-emergency"
            >
              <p className="flex items-center gap-2 text-xs font-bold text-primary">
                <Lightbulb aria-hidden="true" className="size-4" />
                A gentle reminder
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Your circumstances are unique. Take what is useful, ask
                questions, and move at a pace that works for you.
              </p>
            </section>
          </div>
        </div>

        <footer className="mt-12 rounded-[1.6rem] bg-[#21130e] px-5 py-6 text-xs leading-6 text-white/80 sm:px-7">
          <div className="mb-4 flex items-center justify-between gap-4">
            <AkibaWordmark tone="light" />
            <ShieldCheck aria-hidden="true" className="size-5 shrink-0 text-[#ffc394]" />
          </div>
          <p className="max-w-4xl">
            Akiba AI is an educational and planning tool, not a bank or licensed
            financial adviser. Goals and contributions are planning records
            only. Akiba does not hold or move money, connect to bank accounts,
            or place investments.
          </p>
        </footer>
      </main>

      <div className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-50 rounded-full border border-white/10 bg-[#21130e] p-1.5 shadow-[0_12px_40px_rgba(33,19,14,0.28)] xl:hidden">
        <NavigationLinks isDemo={isDemo} mobile />
      </div>
    </div>
  );
}
