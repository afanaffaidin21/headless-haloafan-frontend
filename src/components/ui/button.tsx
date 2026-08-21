import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Variant = "primary" | "ghost";
type Size = "md" | "lg";

const variantClasses: Record<Variant, string> = {
  primary:
    "border border-ink bg-accent text-[#0a0a0c] shadow-hard hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none",
  ghost: "border border-line text-ink hover:border-accent",
};

const sizeClasses: Record<Size, string> = {
  md: "px-7 py-3.5 text-[15px]",
  lg: "px-7 py-4 text-[15px]",
};

interface ButtonProps {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
}

export function Button({
  children,
  variant = "ghost",
  size = "md",
  className,
  href,
  onClick,
  type,
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center gap-2.5 font-medium transition-all",
    variantClasses[variant],
    sizeClasses[size],
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type ?? "button"} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}