import React from 'react';
import { Calendar, Gift, Flame } from 'lucide-react';
import { CyberCard, CyberCardHeader, CyberCardTitle, CyberCardContent } from '@/components/ui/cyber-card';
import { CyberButton } from '@/components/ui/cyber-button';
import { useGame } from '@/contexts/GameContext';
import { cn } from '@/lib/utils';

export const DailyStreak: React.FC = () => {
  const { dailyStreak, lastClaimDate, claimDailyBonus } = useGame();
  
  const today = new Date().toDateString();
  const canClaim = lastClaimDate !== today;
  const nextBonus = (dailyStreak + 1) * 10;

  return (
    <CyberCard variant="gradient">
      <CyberCardHeader>
        <CyberCardTitle className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-accent" />
          Daily Streak
        </CyberCardTitle>
      </CyberCardHeader>
      
      <CyberCardContent className="space-y-4">
        {/* Streak Progress */}
        <div className="flex items-center justify-between gap-1">
          {[1, 2, 3, 4, 5, 6, 7].map((day) => (
            <div
              key={day}
              className={cn(
                "flex-1 h-8 rounded-md flex items-center justify-center font-display text-xs transition-all duration-300",
                day <= dailyStreak
                  ? "bg-gradient-to-br from-primary to-accent text-primary-foreground glow-emerald"
                  : day === dailyStreak + 1 && canClaim
                  ? "bg-accent/20 border-2 border-accent border-dashed text-accent animate-pulse"
                  : "bg-secondary/50 text-muted-foreground"
              )}
            >
              {day <= dailyStreak ? (
                <Gift className="w-4 h-4" />
              ) : (
                day
              )}
            </div>
          ))}
        </div>

        {/* Streak Info */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Current Streak</p>
            <p className="font-display font-bold text-2xl text-gradient-cyber">
              {dailyStreak} Days
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Next Bonus</p>
            <p className="font-display font-bold text-xl text-accent">
              +{nextBonus} IGC
            </p>
          </div>
        </div>

        {/* Claim Button */}
        <CyberButton
          variant={canClaim ? "gradient" : "ghost"}
          className="w-full"
          onClick={claimDailyBonus}
          disabled={!canClaim}
        >
          <Gift className="w-4 h-4" />
          {canClaim ? `Claim Day ${dailyStreak + 1} Bonus` : 'Already Claimed Today'}
        </CyberButton>
      </CyberCardContent>
    </CyberCard>
  );
};
