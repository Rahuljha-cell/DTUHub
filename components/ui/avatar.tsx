import { cn, getInitials } from "@/lib/utils";
import Image from "next/image";

interface AvatarProps {
  src?: string | null;
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function Avatar({
  src,
  name,
  size = "md",
  className,
}: AvatarProps) {
  const sizes = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-14 w-14 text-lg",
  };

  const imgSizes = { sm: 32, md: 40, lg: 56 };

  if (src) {
    return (
      <Image
        src={src}
        alt={name}
        width={imgSizes[size]}
        height={imgSizes[size]}
        className={cn("rounded-xl object-cover ring-2 ring-white/20", sizes[size], className)}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-xl bg-gradient-to-br from-primary-400 to-purple-400 font-bold text-white ring-2 ring-white/20",
        sizes[size],
        className
      )}
    >
      {getInitials(name)}
    </div>
  );
}
