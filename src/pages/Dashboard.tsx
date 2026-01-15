import React from 'react';
import { WalletHeader } from '@/components/dashboard/WalletHeader';
import { MiningSection } from '@/components/dashboard/MiningSection';
import { StakingSection } from '@/components/dashboard/StakingSection';
import { DailyStreak } from '@/components/dashboard/DailyStreak';
import { ReferralCard } from '@/components/dashboard/ReferralCard';
import { Leaderboard } from '@/components/dashboard/Leaderboard';
import { Achievements } from '@/components/dashboard/Achievements';
import { NewsTicker } from '@/components/dashboard/NewsTicker';

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <WalletHeader />
      
      {/* News Ticker */}
      <NewsTicker />
      
      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MiningSection />
        <StakingSection />
      </div>

      {/* Retention Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DailyStreak />
        <ReferralCard />
      </div>

      {/* Gamification */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Leaderboard />
        <Achievements />
      </div>
    </div>
  );
};
