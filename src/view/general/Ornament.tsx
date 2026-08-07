import { cn } from "@/view/styling/cn";

type OrnamentProps = {
  className?: string;
  variant?: "rule" | "diamond" | "trinity";
};

export function Ornament({ className, variant = "diamond" }: OrnamentProps) {
  if (variant === "rule") {
    return (
      <hr
        aria-hidden="true"
        className={cn("border-0 border-t border-rule mx-auto w-full max-w-[18rem]", className)}
      />
    );
  }

  if (variant === "trinity") {
    return (
      <div
        aria-hidden="true"
        className={cn("flex items-center justify-center gap-3 select-none", className)}
      >
        <span className="h-px w-16 bg-rule" />
        <span className="display-italic text-terracotta text-lg leading-none">·</span>
        <span className="display-italic text-terracotta text-2xl leading-none">✦</span>
        <span className="display-italic text-terracotta text-lg leading-none">·</span>
        <span className="h-px w-16 bg-rule" />
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className={cn("flex items-center justify-center gap-5 select-none", className)}
    >
      <span className="h-px w-20 bg-rule" />
      <span className="display text-terracotta text-xl leading-none tracking-[0.5em] -mr-[0.5em]">
        ⁂
      </span>
      <span className="h-px w-20 bg-rule" />
    </div>
  );
}
