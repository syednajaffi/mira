import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-teal text-paper hover:bg-teal-deep active:bg-teal-deep border border-teal-deep/30",
  secondary:
    "bg-amber text-ink hover:bg-amber-deep hover:text-paper border border-amber-deep/30",
  ghost: "bg-transparent text-ink-soft hover:bg-paper-soft border border-transparent",
  outline:
    "bg-transparent text-ink hover:bg-paper-soft border border-paper-line"
};

const sizeStyles: Record<Size, string> = {
  sm: "h-8 px-3 text-sm rounded",
  md: "h-10 px-5 text-sm rounded",
  lg: "h-12 px-7 text-base rounded-lg"
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-medium transition-colors duration-60 disabled:opacity-50 disabled:cursor-not-allowed",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
