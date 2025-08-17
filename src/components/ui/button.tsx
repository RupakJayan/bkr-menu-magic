import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-elegant hover:shadow-glow hover:scale-105",
        hero: "bg-gradient-to-r from-primary to-primary-glow text-primary-foreground hover:scale-105 shadow-glow font-semibold",
        warm: "bg-gradient-to-r from-secondary to-bg-warm text-secondary-foreground border border-border hover:shadow-card",
        fresh: "bg-gradient-to-r from-accent to-bg-fresh text-accent-foreground hover:shadow-card",
        premium: "bg-gradient-to-r from-primary to-primary-glow text-primary-foreground shadow-glow hover:shadow-xl overflow-hidden relative before:absolute before:inset-0 before:bg-primary/20 before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700",
        elegant: "bg-card text-card-foreground border border-border hover:shadow-card hover:scale-105",
        outline: "border-2 border-primary text-primary bg-background hover:bg-primary hover:text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "text-primary hover:bg-primary/10",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        success: "bg-green-600 text-white hover:bg-green-700",
        warning: "bg-yellow-600 text-white hover:bg-yellow-700",
        glow: "bg-primary text-primary-foreground shadow-glow hover:shadow-xl animate-pulse",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded px-3 text-xs",
        lg: "h-12 rounded-lg px-8 text-base",
        xl: "h-14 rounded-lg px-10 text-lg font-semibold",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
