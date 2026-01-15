import * as React from "react";
import { cn } from "@/lib/utils";

interface CyberCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'gold' | 'emerald' | 'gradient';
  glow?: boolean;
}

const CyberCard = React.forwardRef<HTMLDivElement, CyberCardProps>(
  ({ className, variant = 'default', glow = false, ...props }, ref) => {
    const variants = {
      default: "bg-card/80 border-border/50",
      gold: "bg-gradient-to-br from-accent/20 to-accent/5 border-accent/30",
      emerald: "bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30",
      gradient: "bg-gradient-to-br from-primary/10 via-card to-accent/10 border-primary/20",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl border backdrop-blur-xl p-4 transition-all duration-300",
          variants[variant],
          glow && variant === 'emerald' && "glow-emerald",
          glow && variant === 'gold' && "glow-gold",
          className
        )}
        {...props}
      />
    );
  }
);
CyberCard.displayName = "CyberCard";

const CyberCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 pb-4", className)}
    {...props}
  />
));
CyberCardHeader.displayName = "CyberCardHeader";

const CyberCardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("font-display text-lg font-semibold tracking-wide", className)}
    {...props}
  />
));
CyberCardTitle.displayName = "CyberCardTitle";

const CyberCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("", className)} {...props} />
));
CyberCardContent.displayName = "CyberCardContent";

export { CyberCard, CyberCardHeader, CyberCardTitle, CyberCardContent };
