import React from 'react';
import { Trophy, Medal, Crown, TrendingUp } from 'lucide-react';
import { CyberCard, CyberCardHeader, CyberCardTitle, CyberCardContent } from '@/components/ui/cyber-card';
import { useGame } from '@/contexts/GameContext';
import { cn } from '@/lib/utils';

const mockLeaders = [
  { rank: 1, name: 'CryptoKing', mined: 125000, avatar: '👑' },
  { rank: 2, name: 'WhaleHunter', mined: 98500, avatar: '🐋' },
  { rank: 3, name: 'DiamondHands', mined: 75200, avatar: '💎' },
  { rank: 4, name: 'MoonWalker', mined: 62100, avatar: '🌙' },
  { rank: 5, name: 'DegenMaster', mined: 48900, avatar: '🎰' },
];

export const Leaderboard: React.FC = () => {
  const { totalMined, rank } = useGame();

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-accent" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-300" />;
      case 3:
        return <Medal className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="font-display font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  return (
    <CyberCard>
      <CyberCardHeader>
        <CyberCardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-accent" />
          Top Miners
        </CyberCardTitle>
      </CyberCardHeader>
      
      <CyberCardContent>
        <div className="space-y-2">
          {mockLeaders.map((leader) => (
            <div
              key={leader.rank}
              className={cn(
                "flex items-center justify-between p-3 rounded-lg transition-all",
                leader.rank === 1 && "bg-accent/10 border border-accent/30",
                leader.rank === 2 && "bg-gray-400/10",
                leader.rank === 3 && "bg-amber-600/10",
                leader.rank > 3 && "bg-secondary/30"
              )}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 flex items-center justify-center">
                  {getRankIcon(leader.rank)}
                </div>
                <span className="text-2xl">{leader.avatar}</span>
                <span className="font-body font-semibold">{leader.name}</span>
              </div>
              <span className="font-display text-sm text-primary">
                {leader.mined.toLocaleString()} IGC
              </span>
            </div>
          ))}

          {/* Current User */}
          <div className="border-t border-border/50 pt-2 mt-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10 border border-primary/30">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 flex items-center justify-center">
                  <span className="font-display font-bold text-primary">#{rank}</span>
                </div>
                <span className="text-2xl">🎮</span>
                <span className="font-body font-semibold">You</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="font-display text-sm text-primary">
                  {totalMined.toFixed(0)} IGC
                </span>
              </div>
            </div>
          </div>
        </div>
      </CyberCardContent>
    </CyberCard>
  );
};
