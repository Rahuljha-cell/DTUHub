import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/20 bg-white/80 shadow-glass backdrop-blur-xl transition-all duration-500 hover:shadow-glass-lg hover:-translate-y-1 dark:border-white/10 dark:bg-gray-800/80",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: CardProps) {
  return <div className={cn("px-5 pt-5", className)} {...props} />;
}

export function CardContent({ className, ...props }: CardProps) {
  return <div className={cn("px-5 py-4", className)} {...props} />;
}

export function CardFooter({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "flex items-center px-5 pb-5 pt-0",
        className
      )}
      {...props}
    />
  );
}
