import React, { useState } from 'react';
import { Lock, Unlock, TrendingUp, Coins } from 'lucide-react';
import { CyberCard, CyberCardHeader, CyberCardTitle, CyberCardContent } from '@/components/ui/cyber-card';
import { CyberButton } from '@/components/ui/cyber-button';
import { Input } from '@/components/ui/input';
import { useGame } from '@/contexts/GameContext';

export const StakingSection: React.FC = () => {
  const { tokenBalance, stakedAmount, claimableRewards, stake, unstake, claimRewards } = useGame();
  const [stakeInput, setStakeInput] = useState('');
  const [unstakeInput, setUnstakeInput] = useState('');

  const handleStake = () => {
    const amount = parseFloat(stakeInput);
    if (!isNaN(amount) && amount > 0) {
      stake(amount);
      setStakeInput('');
    }
  };

  const handleUnstake = () => {
    const amount = parseFloat(unstakeInput);
    if (!isNaN(amount) && amount > 0) {
      unstake(amount);
      setUnstakeInput('');
    }
  };

  return (
    <CyberCard variant="gold" className="h-full">
      <CyberCardHeader>
        <CyberCardTitle className="flex items-center gap-2 text-accent">
          <Lock className="w-5 h-5" />
          Staking Vault
        </CyberCardTitle>
      </CyberCardHeader>
      
      <CyberCardContent className="space-y-4">
        {/* Staking Stats */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-secondary/50 rounded-lg p-3 text-center">
            <p className="text-xs text-muted-foreground mb-1">Total Staked</p>
            <p className="font-display font-bold text-foreground">{stakedAmount.toFixed(2)}</p>
          </div>
          <div className="bg-secondary/50 rounded-lg p-3 text-center">
            <p className="text-xs text-muted-foreground mb-1">APY</p>
            <p className="font-display font-bold text-primary">15%</p>
          </div>
          <div className="bg-secondary/50 rounded-lg p-3 text-center">
            <p className="text-xs text-muted-foreground mb-1">Claimable</p>
            <p className="font-display font-bold text-accent">{claimableRewards.toFixed(4)}</p>
          </div>
        </div>

        {/* Claim Rewards */}
        {claimableRewards > 0.0001 && (
          <CyberButton 
            variant="gold" 
            className="w-full"
            onClick={claimRewards}
          >
            <Coins className="w-4 h-4" />
            Claim {claimableRewards.toFixed(4)} IGC
          </CyberButton>
        )}

        {/* Stake Input */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Amount to stake"
              value={stakeInput}
              onChange={(e) => setStakeInput(e.target.value)}
              className="bg-secondary/50 border-border/50 font-body"
            />
            <CyberButton 
              variant="outline" 
              onClick={handleStake}
              disabled={!stakeInput || parseFloat(stakeInput) > tokenBalance}
            >
              <Lock className="w-4 h-4" />
              Stake
            </CyberButton>
          </div>
          <p className="text-xs text-muted-foreground">Available: {tokenBalance.toFixed(2)} IGC</p>
        </div>

        {/* Unstake Input */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Amount to unstake"
              value={unstakeInput}
              onChange={(e) => setUnstakeInput(e.target.value)}
              className="bg-secondary/50 border-border/50 font-body"
            />
            <CyberButton 
              variant="outlineGold" 
              onClick={handleUnstake}
              disabled={!unstakeInput || parseFloat(unstakeInput) > stakedAmount}
            >
              <Unlock className="w-4 h-4" />
              Unstake
            </CyberButton>
          </div>
          <p className="text-xs text-muted-foreground">Staked: {stakedAmount.toFixed(2)} IGC</p>
        </div>
      </CyberCardContent>
    </CyberCard>
  );
};
