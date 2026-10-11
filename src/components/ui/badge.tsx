import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-btn border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] focus:outline-none",
  {
    variants: {
      variant: {
        default: "border-transparent bg-acc text-accink",
        secondary: "border-transparent bg-surf2 text-ink",
        outline: "border-line bg-transparent text-ink",
        muted: "border-transparent text-mute",
        destructive: "border-transparent bg-danger text-accink",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
