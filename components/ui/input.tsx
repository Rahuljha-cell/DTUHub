"use client";

import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            "w-full rounded-xl border border-gray-200/50 bg-white/80 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 backdrop-blur-sm transition-all duration-300",
            "focus:border-primary-500/50 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:bg-white",
            "dark:border-gray-600/50 dark:bg-gray-800/80 dark:text-white dark:placeholder-gray-500 dark:focus:bg-gray-800",
            error && "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20",
            className
          )}
          {...props}
        />
        {error && <p className="mt-1.5 text-xs font-medium text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
