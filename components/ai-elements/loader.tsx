import { cn } from "@/lib/utils";
import { RiLoader2Line } from "@remixicon/react";
import type { HTMLAttributes } from "react";

export type LoaderProps = HTMLAttributes<HTMLDivElement> & {
  size?: number;
};

export const Loader = ({ className, size = 16, ...props }: LoaderProps) => (
  <div
    className={cn(
      "inline-flex animate-spin items-center justify-center",
      className
    )}
    {...props}
  >
    <RiLoader2Line size={size} />
  </div>
);
