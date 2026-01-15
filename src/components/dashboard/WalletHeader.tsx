import React from 'react';
import { Wallet, LogOut, Power } from 'lucide-react';
import { CyberButton } from '@/components/ui/cyber-button';
import { useGame } from '@/contexts/GameContext';

export const WalletHeader: React.FC = () => {
  const { walletConnected, walletAddress, connectWallet, disconnectWallet } = useGame();

  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-gradient-cyber">
          Command Center
        </h1>
        <p className="text-muted-foreground font-body">Welcome back, Commander</p>
      </div>
      
      {walletConnected ? (
        <div className="flex items-center gap-2">
          <div className="hidden sm:block bg-secondary/50 rounded-lg px-3 py-2 border border-primary/30">
            <p className="text-xs text-muted-foreground">Connected</p>
            <p className="font-mono text-sm text-primary">{walletAddress}</p>
          </div>
          <CyberButton variant="ghost" size="icon" onClick={disconnectWallet}>
            <LogOut className="w-4 h-4" />
          </CyberButton>
        </div>
      ) : (
        <CyberButton variant="gradient" onClick={connectWallet}>
          <Wallet className="w-4 h-4" />
          Connect Wallet
        </CyberButton>
      )}
    </div>
  );
};
