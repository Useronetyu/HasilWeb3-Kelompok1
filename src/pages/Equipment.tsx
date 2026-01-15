import React, { useState } from 'react';
import { Boxes, Sparkles, Zap, Check, Package } from 'lucide-react';
import { CyberCard, CyberCardHeader, CyberCardTitle, CyberCardContent } from '@/components/ui/cyber-card';
import { CyberButton } from '@/components/ui/cyber-button';
import { useGame } from '@/contexts/GameContext';
import { cn } from '@/lib/utils';

const rarityColors = {
  common: 'from-gray-400 to-gray-600',
  rare: 'from-blue-400 to-blue-600',
  epic: 'from-purple-400 to-purple-600',
  legendary: 'from-amber-400 to-orange-500',
};

const rarityBorders = {
  common: 'border-gray-500/50',
  rare: 'border-blue-500/50',
  epic: 'border-purple-500/50',
  legendary: 'border-amber-500/50 glow-gold',
};

export const Equipment: React.FC = () => {
  const { nfts, tokenBalance, mintNFT, equipNFT } = useGame();
  const [isMinting, setIsMinting] = useState(false);
  const [newNFT, setNewNFT] = useState<string | null>(null);

  const handleMint = async () => {
    if (tokenBalance < 50) return;
    
    setIsMinting(true);
    setNewNFT(null);
    
    // Simulate minting animation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const prevLength = nfts.length;
    mintNFT();
    
    setIsMinting(false);
    
    // Show the new NFT
    setTimeout(() => {
      if (nfts.length > prevLength) {
        setNewNFT(nfts[nfts.length - 1]?.id || null);
      }
    }, 100);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-gradient-cyber flex items-center gap-3">
            <Boxes className="w-8 h-8" />
            Equipment Bay
          </h1>
          <p className="text-muted-foreground font-body">Mint and equip powerful mining rigs</p>
        </div>
        <div className="bg-secondary/50 rounded-lg px-4 py-2 border border-border/50">
          <p className="text-xs text-muted-foreground">Balance</p>
          <p className="font-display font-bold text-primary">{tokenBalance.toFixed(2)} IGC</p>
        </div>
      </div>

      {/* Gacha Mint Section */}
      <CyberCard variant="gradient" glow className="relative overflow-hidden">
        <div className="absolute inset-0 scanline pointer-events-none" />
        
        <CyberCardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h2 className="font-display text-xl font-bold text-foreground mb-2">NFT Gacha Machine</h2>
            <p className="text-muted-foreground">Roll for a random mining rig! Legendary rigs are super rare.</p>
            <div className="flex gap-2 mt-3 justify-center md:justify-start">
              <span className="text-xs px-2 py-1 rounded bg-gray-500/20 text-gray-400">Common 60%</span>
              <span className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-400">Rare 25%</span>
              <span className="text-xs px-2 py-1 rounded bg-purple-500/20 text-purple-400">Epic 12%</span>
              <span className="text-xs px-2 py-1 rounded bg-amber-500/20 text-amber-400">Legend 3%</span>
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-3">
            <CyberButton
              variant="gradient"
              size="xl"
              onClick={handleMint}
              disabled={tokenBalance < 50 || isMinting}
              className={cn(
                "relative min-w-[180px]",
                isMinting && "animate-pulse"
              )}
            >
              {isMinting ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  Minting...
                </div>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Mint Random NFT
                </>
              )}
            </CyberButton>
            <p className="text-sm text-muted-foreground">Cost: 50 IGC</p>
          </div>
        </CyberCardContent>
      </CyberCard>

      {/* Inventory */}
      <div className="space-y-4">
        <h2 className="font-display text-xl font-semibold text-foreground flex items-center gap-2">
          <Package className="w-5 h-5 text-primary" />
          Your Inventory ({nfts.length} NFTs)
        </h2>
        
        {nfts.length === 0 ? (
          <CyberCard className="p-8 text-center">
            <Boxes className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">No NFTs yet. Mint your first one!</p>
          </CyberCard>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {nfts.map((nft) => (
              <CyberCard
                key={nft.id}
                className={cn(
                  "relative overflow-hidden transition-all duration-300 hover:scale-[1.03]",
                  rarityBorders[nft.rarity],
                  nft.equipped && "ring-2 ring-primary",
                  newNFT === nft.id && "animate-coin-pop"
                )}
              >
                {nft.equipped && (
                  <div className="absolute top-2 right-2 z-10">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center glow-emerald">
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </div>
                  </div>
                )}
                
                <div className={cn(
                  "h-24 bg-gradient-to-br flex items-center justify-center",
                  rarityColors[nft.rarity]
                )}>
                  <Zap className="w-12 h-12 text-white/80" />
                </div>
                
                <CyberCardContent className="p-3 space-y-2">
                  <div>
                    <p className={cn(
                      "text-xs font-display uppercase tracking-wider",
                      nft.rarity === 'legendary' && "text-amber-400",
                      nft.rarity === 'epic' && "text-purple-400",
                      nft.rarity === 'rare' && "text-blue-400",
                      nft.rarity === 'common' && "text-gray-400"
                    )}>
                      {nft.rarity}
                    </p>
                    <h3 className="font-display font-semibold text-sm truncate">{nft.name}</h3>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Boost</span>
                    <span className="text-primary font-display">+{(nft.miningBoost * 100).toFixed(0)}%</span>
                  </div>
                  
                  <CyberButton
                    variant={nft.equipped ? "outline" : "default"}
                    size="sm"
                    className="w-full"
                    onClick={() => equipNFT(nft.id)}
                  >
                    {nft.equipped ? 'Unequip' : 'Equip'}
                  </CyberButton>
                </CyberCardContent>
              </CyberCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
