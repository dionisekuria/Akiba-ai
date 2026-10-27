import type { HTMLAttributes } from "react";

export function AkibaWordmark({
  tone = "dark",
  className = "",
}: {
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 font-semibold tracking-[-0.06em] ${
        tone === "light" ? "text-white" : "text-[#21130e]"
      } ${className}`}
    >
      <span className="text-[1.65rem] leading-none">akiba</span>
      <span
        className={`rounded-full px-2 py-1 text-[9px] leading-none font-bold tracking-[0.12em] ${
          tone === "light"
            ? "border border-white/50 bg-white/20 text-white"
            : "bg-[#21130e] text-white"
        }`}
      >
        AI
      </span>
    </span>
  );
}

export function HeroDiscs({
  variant = "full",
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement> & { variant?: "full" | "compact" }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      {...props}
    >
      <span
        className={`akiba-disc akiba-disc--float ${
          variant === "full"
            ? "right-[4%] top-[13%] size-64 sm:right-[8%] sm:size-[25rem] xl:right-[13%] xl:top-[12%] xl:size-[31rem]"
            : "-right-16 -top-20 size-56 sm:-right-8 sm:-top-24 sm:size-72"
        }`}
      />
      <span
        className={`akiba-disc akiba-disc--soft ${
          variant === "full"
            ? "right-[22%] top-[41%] size-28 sm:right-[29%] sm:top-[43%] sm:size-40 xl:right-[35%] xl:top-[43%] xl:size-48"
            : "right-[25%] top-[43%] size-24 sm:right-[30%] sm:top-[36%] sm:size-32"
        }`}
      />
      {variant === "full" && (
        <span className="akiba-disc akiba-disc--float akiba-disc--soft -right-[4%] bottom-[6%] size-32 sm:right-[2%] sm:bottom-[2%] sm:size-44 xl:right-[8%] xl:bottom-[3%] xl:size-52" />
      )}
    </div>
  );
}
