import React from 'react';
import { Award, Pickaxe, Star, Crown, ShoppingBag, Lock, Unlock, Gift } from 'lucide-react';
import { CyberCard, CyberCardHeader, CyberCardTitle, CyberCardContent } from '@/components/ui/cyber-card';
import { CyberButton } from '@/components/ui/cyber-button';
import { useGame } from '@/contexts/GameContext';
import { cn } from '@/lib/utils';

const iconMap: Record<string, React.ElementType> = {
  Pickaxe,
  Star,
  Crown,
  ShoppingBag,
};

export const Achievements: React.FC = () => {
  const { achievements, totalClicks, totalSpent, claimAchievement } = useGame();

  const getProgress = (ach: typeof achievements[0]) => {
    let current = 0;
    if (ach.type === 'clicks') {
      current = totalClicks;
    } else if (ach.type === 'spending') {
      current = totalSpent;
    }
    return Math.min(current / ach.target, 1);
  };

  const formatProgress = (ach: typeof achievements[0]) => {
    let current = 0;
    if (ach.type === 'clicks') {
      current = totalClicks;
    } else if (ach.type === 'spending') {
      current = totalSpent;
    }
    return `${current.toLocaleString()} / ${ach.target.toLocaleString()}`;
  };

  return (
    <CyberCard>
      <CyberCardHeader>
        <CyberCardTitle className="flex items-center gap-2">
          <Award className="w-5 h-5 text-accent" />
          Achievements
        </CyberCardTitle>
      </CyberCardHeader>
      
      <CyberCardContent>
        <div className="space-y-3">
          {achievements.map((ach) => {
            const Icon = iconMap[ach.icon] || Star;
            const progress = getProgress(ach);
            
            return (
              <div
                key={ach.id}
                className={cn(
                  "relative p-4 rounded-xl border transition-all",
                  ach.unlocked && !ach.claimed
                    ? "bg-gradient-to-r from-accent/20 to-primary/20 border-accent glow-gold animate-pulse"
                    : ach.claimed
                    ? "bg-primary/10 border-primary/50"
                    : "bg-secondary/30 border-border/50"
                )}
              >
                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <div
                    className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center transition-all",
                      ach.claimed
                        ? "bg-gradient-to-br from-primary to-emerald-glow"
                        : ach.unlocked
                        ? "bg-gradient-to-br from-accent to-gold-glow animate-glow-pulse"
                        : "bg-secondary/50 border border-border/50"
                    )}
                  >
                    {ach.claimed ? (
                      <Unlock className="w-6 h-6 text-primary-foreground" />
                    ) : ach.unlocked ? (
                      <Icon className="w-6 h-6 text-accent-foreground" />
                    ) : (
                      <Lock className="w-6 h-6 text-muted-foreground" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-display font-semibold text-sm truncate">
                        {ach.name}
                      </h3>
                      <span className="text-xs text-accent font-display px-2 py-0.5 rounded-full bg-accent/20">
                        +{ach.reward} IGC
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{ach.description}</p>
                    
                    {/* Progress Bar */}
                    {!ach.unlocked && (
                      <div className="mt-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="text-primary">{formatProgress(ach)}</span>
                        </div>
                        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
                            style={{ width: `${progress * 100}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Claim Button */}
                  {ach.unlocked && !ach.claimed && (
                    <CyberButton
                      variant="gold"
                      size="sm"
                      onClick={() => claimAchievement(ach.id)}
                      className="flex-shrink-0 gap-1"
                    >
                      <Gift className="w-4 h-4" />
                      Claim
                    </CyberButton>
                  )}

                  {ach.claimed && (
                    <span className="text-xs text-primary font-display px-3 py-1 rounded-full bg-primary/20">
                      Claimed ✓
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CyberCardContent>
    </CyberCard>
  );
};
