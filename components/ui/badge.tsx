import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger" | "info";
}

export default function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  const variants = {
    default:
      "bg-gray-100/80 text-gray-700 border-gray-200/50 dark:bg-gray-700/50 dark:text-gray-300 dark:border-gray-600/50",
    success:
      "bg-emerald-50/80 text-emerald-700 border-emerald-200/50 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700/50",
    warning:
      "bg-amber-50/80 text-amber-700 border-amber-200/50 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700/50",
    danger:
      "bg-red-50/80 text-red-700 border-red-200/50 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700/50",
    info:
      "bg-blue-50/80 text-blue-700 border-blue-200/50 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700/50",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-lg border px-2.5 py-0.5 text-xs font-semibold backdrop-blur-sm",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
