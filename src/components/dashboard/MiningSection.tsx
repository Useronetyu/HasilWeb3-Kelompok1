import React, { useState, useCallback } from 'react';
import { Coins, Zap, TrendingUp, Bot, Timer } from 'lucide-react';
import { CyberCard, CyberCardHeader, CyberCardTitle, CyberCardContent } from '@/components/ui/cyber-card';
import { CyberButton } from '@/components/ui/cyber-button';
import { useGame } from '@/contexts/GameContext';
import { cn } from '@/lib/utils';
import { MiningParticles } from '@/components/effects/MiningParticles';
import { MiningSprintOverlay } from '@/components/dashboard/MiningSprintOverlay';

export const MiningSection: React.FC = () => {
  const { 
    tokenBalance, 
    miningRate, 
    mine, 
    shopItems, 
    nfts, 
    dailyStreak, 
    hasAutoMining, 
    autoMineRate,
    isSprintActive,
    sprintTimeLeft,
    startMiningSprint
  } = useGame();
  
  const [isAnimating, setIsAnimating] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const [particlePosition, setParticlePosition] = useState({ x: 0, y: 0 });
  const [lastMineAmount, setLastMineAmount] = useState(0);

  const totalMultiplier = shopItems
    .filter(item => item.owned)
    .reduce((acc, item) => acc * item.multiplier, 1);

  const equippedBoost = nfts
    .filter(nft => nft.equipped)
    .reduce((acc, nft) => acc + nft.miningBoost, 0);

  const sprintMultiplier = isSprintActive ? 2 : 1;
  const effectiveRate = miningRate * totalMultiplier * (1 + equippedBoost) * (1 + dailyStreak * 0.1) * sprintMultiplier;

  const handleMine = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    const amount = mine();
    setLastMineAmount(amount);
    setParticlePosition({ x, y });
    setShowParticles(true);
    setIsAnimating(true);
    
    setTimeout(() => setIsAnimating(false), 300);
  }, [mine]);

  const handleParticleComplete = useCallback(() => {
    setShowParticles(false);
  }, []);

  return (
    <>
      <MiningParticles 
        isActive={showParticles} 
        amount={lastMineAmount} 
        position={particlePosition}
        onComplete={handleParticleComplete}
      />
      
      <CyberCard variant="emerald" glow className="relative overflow-hidden">
        <div className="absolute inset-0 scanline pointer-events-none" />
        
        <MiningSprintOverlay timeLeft={sprintTimeLeft} isActive={isSprintActive} />
        
        <CyberCardHeader className="flex flex-row items-center justify-between">
          <CyberCardTitle className="flex items-center gap-2 text-primary">
            <Zap className="w-5 h-5" />
            Mining Simulation
          </CyberCardTitle>
          
          {/* Auto-Mining Indicator */}
          {hasAutoMining && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 border border-primary/50">
              <Bot className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-xs font-display text-primary">
                Auto +{autoMineRate}/s
              </span>
            </div>
          )}
        </CyberCardHeader>
        
        <CyberCardContent className="flex flex-col items-center space-y-6">
          {/* Token Balance Display */}
          <div className="text-center">
            <p className="text-muted-foreground text-sm font-body">Token Balance</p>
            <p className="font-display text-4xl font-bold text-gradient-cyber">
              {tokenBalance.toFixed(2)} <span className="text-lg">IGC</span>
            </p>
          </div>

          {/* Mining Button */}
          <div className="relative">
            <CyberButton
              variant="mine"
              size="mine"
              onClick={handleMine}
              className={cn(
                "relative z-10",
                isAnimating && "animate-coin-pop",
                isSprintActive && "ring-4 ring-accent ring-opacity-50"
              )}
            >
              <div className="flex flex-col items-center">
                <Coins className="w-12 h-12 mb-2" />
                <span>MINE IGC</span>
                {isSprintActive && (
                  <span className="text-xs text-accent mt-1">2X ACTIVE!</span>
                )}
              </div>
            </CyberButton>
          </div>

          {/* Mining Sprint Button */}
          <CyberButton
            variant="gold"
            size="sm"
            onClick={startMiningSprint}
            disabled={isSprintActive}
            className="gap-2"
          >
            <Timer className="w-4 h-4" />
            {isSprintActive ? `Sprint Active: ${sprintTimeLeft}s` : 'Start Mining Sprint'}
          </CyberButton>

          {/* Mining Stats */}
          <div className="w-full grid grid-cols-2 gap-3">
            <div className="bg-secondary/50 rounded-lg p-3 text-center">
              <TrendingUp className="w-4 h-4 mx-auto mb-1 text-primary" />
              <p className="text-xs text-muted-foreground">Rate</p>
              <p className="font-display font-bold text-primary">{effectiveRate.toFixed(2)}/click</p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-3 text-center">
              <Zap className="w-4 h-4 mx-auto mb-1 text-accent" />
              <p className="text-xs text-muted-foreground">Multiplier</p>
              <p className="font-display font-bold text-accent">x{totalMultiplier.toFixed(2)}</p>
            </div>
          </div>
        </CyberCardContent>
      </CyberCard>
    </>
  );
};
