"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg"
  variant?: "default" | "secondary"
}

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size = "md", variant = "default", ...props }, ref) => {
    const sizeClasses = {
      sm: "h-4 w-4 border-2",
      md: "h-8 w-8 border-3",
      lg: "h-12 w-12 border-4",
    }

    const variantClasses = {
      default: "border-t-primary",
      secondary: "border-t-secondary",
    }

    return (
      <div
        ref={ref}
        className={cn(
          "animate-spin rounded-full border-solid border-gray-200",
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        {...props}
      />
    )
  }
)

Spinner.displayName = "Spinner"

export { Spinner }