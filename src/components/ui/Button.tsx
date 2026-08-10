import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-rust text-paper border border-transparent hover:bg-rustdark active:bg-rustdark",
  secondary:
    "bg-transparent text-ink2 border border-line hover:bg-panel hover:text-ink",
  ghost: "bg-transparent text-ink2 border border-transparent hover:bg-panel",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-[13px]",
  md: "px-5 py-3 text-sm",
  lg: "px-6 py-3.5 text-[15px]",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-[9px] font-bold",
        "transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust",
        "disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
