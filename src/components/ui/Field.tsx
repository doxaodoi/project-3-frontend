import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Label({
  children,
  htmlFor,
  hint,
}: {
  children: ReactNode;
  htmlFor?: string;
  hint?: ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-[7px] flex items-center justify-between text-[12.5px] font-semibold text-ink2"
    >
      <span>{children}</span>
      {hint}
    </label>
  );
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  trailing?: ReactNode;
}

export function Input({ className, trailing, ...props }: InputProps) {
  return (
    <div className="relative">
      <input
        className={cn(
          "w-full rounded-[9px] border border-line bg-card px-[15px] py-[13px] text-sm text-ink",
          "placeholder:text-muted focus:border-rust focus:outline-none",
          !!trailing && "pr-11",
          className,
        )}
        {...props}
      />
      {trailing && (
        <div className="absolute inset-y-0 right-3 flex items-center text-muted">
          {trailing}
        </div>
      )}
    </div>
  );
}
