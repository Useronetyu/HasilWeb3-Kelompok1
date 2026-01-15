import React, { useState } from 'react';
import { User, Crown, Send, TrendingUp, Activity, Clock, Wallet, Award, Copy, Check } from 'lucide-react';
import { CyberCard, CyberCardHeader, CyberCardTitle, CyberCardContent } from '@/components/ui/cyber-card';
import { CyberButton } from '@/components/ui/cyber-button';
import { Input } from '@/components/ui/input';
import { useGame } from '@/contexts/GameContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export const Profile: React.FC = () => {
  const { 
    walletAddress, 
    tokenBalance, 
    stakedAmount, 
    totalMined, 
    rank, 
    shopItems, 
    nfts,
    transactions,
    transferAssets,
    playSound
  } = useGame();
  const { toast } = useToast();
  
  const [transferAddress, setTransferAddress] = useState('');
  const [transferAmount, setTransferAmount] = useState('');

  const activeMultipliers = shopItems.filter(item => item.owned);
  const equippedNFTs = nfts.filter(nft => nft.equipped);
  
  const totalMultiplier = activeMultipliers.reduce((acc, item) => acc * item.multiplier, 1);

  const handleTransfer = () => {
    const amount = parseFloat(transferAmount);
    if (!transferAddress.startsWith('0x') || transferAddress.length < 10) {
      toast({
        title: "Invalid Address",
        description: "Please enter a valid wallet address starting with 0x",
        variant: "destructive"
      });
      return;
    }
    
    if (isNaN(amount) || amount <= 0 || amount > tokenBalance) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount within your balance",
        variant: "destructive"
      });
      return;
    }

    const success = transferAssets(transferAddress, amount);
    if (success) {
      toast({
        title: "Transfer Successful! 🎉",
        description: `${amount} IGC sent to ${transferAddress.substring(0, 10)}...`,
      });
      setTransferAddress('');
      setTransferAmount('');
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-gradient-cyber flex items-center gap-3">
          <User className="w-8 h-8" />
          Profile
        </h1>
        <p className="text-muted-foreground font-body">Your identity and assets</p>
      </div>

      {/* Membership Card */}
      <CyberCard variant="gold" glow className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-transparent to-primary/20" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-accent/30 to-transparent rounded-full blur-3xl" />
        
        <CyberCardContent className="p-6 relative">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-accent to-primary flex items-center justify-center glow-gold">
                <Crown className="w-12 h-12 text-accent-foreground" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center border-2 border-card">
                <span className="font-display text-xs text-primary-foreground">#{rank}</span>
              </div>
            </div>
            
            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <h2 className="font-display text-2xl font-bold">Ilham</h2>
                <span className="px-2 py-0.5 rounded-full bg-accent/20 text-accent text-xs font-display">PLATINUM</span>
              </div>
              <p className="text-muted-foreground text-sm mt-1">Top Investor • Early Adopter</p>
              
              {walletAddress && (
                <div className="flex items-center gap-2 mt-3 justify-center md:justify-start">
                  <span className="font-mono text-sm text-primary">{walletAddress}</span>
                </div>
              )}
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-xs text-muted-foreground">Balance</p>
                <p className="font-display font-bold text-xl text-primary">{tokenBalance.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Staked</p>
                <p className="font-display font-bold text-xl text-accent">{stakedAmount.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </CyberCardContent>
      </CyberCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Wallet Manager */}
        <CyberCard>
          <CyberCardHeader>
            <CyberCardTitle className="flex items-center gap-2">
              <Send className="w-5 h-5 text-primary" />
              Transfer Assets
            </CyberCardTitle>
          </CyberCardHeader>
          
          <CyberCardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Recipient Address</label>
              <Input
                placeholder="0x..."
                value={transferAddress}
                onChange={(e) => setTransferAddress(e.target.value)}
                className="bg-secondary/50 border-border/50 font-mono"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Amount (IGC)</label>
              <Input
                type="number"
                placeholder="0.00"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                className="bg-secondary/50 border-border/50 font-body"
              />
              <p className="text-xs text-muted-foreground">Available: {tokenBalance.toFixed(2)} IGC</p>
            </div>
            
            <CyberButton
              variant="default"
              className="w-full"
              onClick={handleTransfer}
              disabled={!transferAddress || !transferAmount}
            >
              <Send className="w-4 h-4" />
              Send Assets
            </CyberButton>
          </CyberCardContent>
        </CyberCard>

        {/* Stats Overview */}
        <CyberCard>
          <CyberCardHeader>
            <CyberCardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-accent" />
              Stats Overview
            </CyberCardTitle>
          </CyberCardHeader>
          
          <CyberCardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-secondary/50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span className="text-xs text-muted-foreground">Total Mined</span>
                </div>
                <p className="font-display font-bold text-lg">{totalMined.toFixed(2)} IGC</p>
              </div>
              
              <div className="bg-secondary/50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Award className="w-4 h-4 text-accent" />
                  <span className="text-xs text-muted-foreground">Global Rank</span>
                </div>
                <p className="font-display font-bold text-lg">#{rank}</p>
              </div>
              
              <div className="bg-secondary/50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Wallet className="w-4 h-4 text-primary" />
                  <span className="text-xs text-muted-foreground">Net Worth</span>
                </div>
                <p className="font-display font-bold text-lg">{(tokenBalance + stakedAmount).toFixed(2)}</p>
              </div>
              
              <div className="bg-secondary/50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-accent" />
                  <span className="text-xs text-muted-foreground">Multiplier</span>
                </div>
                <p className="font-display font-bold text-lg">x{totalMultiplier.toFixed(2)}</p>
              </div>
            </div>

            {/* Active Boosts */}
            {(activeMultipliers.length > 0 || equippedNFTs.length > 0) && (
              <div className="pt-3 border-t border-border/50">
                <p className="text-xs text-muted-foreground mb-2">Active Boosts</p>
                <div className="flex flex-wrap gap-2">
                  {activeMultipliers.map(item => (
                    <span 
                      key={item.id}
                      className="px-2 py-1 rounded-full bg-primary/20 text-primary text-xs font-display"
                    >
                      {item.name}
                    </span>
                  ))}
                  {equippedNFTs.map(nft => (
                    <span 
                      key={nft.id}
                      className="px-2 py-1 rounded-full bg-accent/20 text-accent text-xs font-display"
                    >
                      {nft.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </CyberCardContent>
        </CyberCard>
      </div>

      {/* Transaction History */}
      <CyberCard>
        <CyberCardHeader>
          <CyberCardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Transaction History
          </CyberCardTitle>
        </CyberCardHeader>
        
        <CyberCardContent>
          {transactions.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No transactions yet</p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {transactions.slice(0, 20).map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center",
                      tx.type === 'mine' && "bg-primary/20 text-primary",
                      tx.type === 'stake' && "bg-accent/20 text-accent",
                      tx.type === 'unstake' && "bg-accent/20 text-accent",
                      tx.type === 'buy' && "bg-purple-500/20 text-purple-400",
                      tx.type === 'craft' && "bg-blue-500/20 text-blue-400",
                      tx.type === 'transfer' && "bg-red-500/20 text-red-400",
                      tx.type === 'claim' && "bg-green-500/20 text-green-400"
                    )}>
                      {tx.type === 'mine' && <TrendingUp className="w-4 h-4" />}
                      {tx.type === 'stake' && <Wallet className="w-4 h-4" />}
                      {tx.type === 'unstake' && <Wallet className="w-4 h-4" />}
                      {tx.type === 'buy' && <Activity className="w-4 h-4" />}
                      {tx.type === 'craft' && <Activity className="w-4 h-4" />}
                      {tx.type === 'transfer' && <Send className="w-4 h-4" />}
                      {tx.type === 'claim' && <Award className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="font-body font-medium text-sm">{tx.description}</p>
                      <p className="text-xs text-muted-foreground">{formatTime(new Date(tx.timestamp))}</p>
                    </div>
                  </div>
                  <span className={cn(
                    "font-display font-bold text-sm",
                    tx.type === 'transfer' || tx.type === 'buy' ? "text-red-400" : "text-primary"
                  )}>
                    {tx.type === 'transfer' || tx.type === 'buy' ? '-' : '+'}{tx.amount.toFixed(2)} IGC
                  </span>
                </div>
              ))}
            </div>
          )}
        </CyberCardContent>
      </CyberCard>
    </div>
  );
};
