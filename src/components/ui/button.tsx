import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "tp-pressable inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-btn font-body text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acc focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-acc text-accink shadow-theme-sm hover:-translate-y-px",
        hero: "bg-acc text-accink shadow-theme hover:-translate-y-px",
        outline:
          "border border-line bg-surf text-ink hover:border-acc hover:text-acc",
        secondary: "bg-surf2 text-ink hover:-translate-y-px",
        ghost: "bg-transparent text-ink hover:bg-surf2",
        destructive: "bg-danger text-accink shadow-theme-sm hover:-translate-y-px",
        link: "bg-transparent text-acc underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-10 px-4 text-xs",
        lg: "h-12 px-7",
        xl: "h-14 px-9 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
