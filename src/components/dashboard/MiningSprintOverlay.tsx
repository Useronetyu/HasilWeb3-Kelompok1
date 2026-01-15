import React from 'react';
import { Timer, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MiningSprintOverlayProps {
  timeLeft: number;
  isActive: boolean;
}

export const MiningSprintOverlay: React.FC<MiningSprintOverlayProps> = ({ timeLeft, isActive }) => {
  if (!isActive) return null;

  const progress = (timeLeft / 30) * 100;
  const isUrgent = timeLeft <= 10;

  return (
    <div className="absolute inset-0 pointer-events-none z-20 flex flex-col items-center justify-start pt-4">
      {/* Timer Display */}
      <div className={cn(
        "bg-card/95 border-2 rounded-xl px-6 py-3 flex items-center gap-3 backdrop-blur-sm",
        isUrgent ? "border-destructive animate-pulse" : "border-primary"
      )}>
        <Timer className={cn(
          "w-6 h-6",
          isUrgent ? "text-destructive" : "text-primary"
        )} />
        <div className="text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Mining Sprint</p>
          <p className={cn(
            "font-display text-3xl font-bold",
            isUrgent ? "text-destructive" : "text-primary"
          )}>
            {timeLeft}s
          </p>
        </div>
        <div className="flex items-center gap-1 bg-accent/20 px-3 py-1 rounded-full">
          <Zap className="w-4 h-4 text-accent" />
          <span className="font-display font-bold text-accent">2x</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-xs mt-3 px-4">
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div 
            className={cn(
              "h-full transition-all duration-1000 ease-linear rounded-full",
              isUrgent ? "bg-destructive" : "bg-gradient-to-r from-primary to-accent"
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Floating 2x Badge */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div className="text-8xl font-display font-bold text-primary/10 animate-pulse">
          2X
        </div>
      </div>
    </div>
  );
};
