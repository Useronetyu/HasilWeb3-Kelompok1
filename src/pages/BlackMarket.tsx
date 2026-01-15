import React from 'react';
import { Store, Bot, Cpu, Brain, Sparkles, Fish, Eye, Shield, Check, Lock } from 'lucide-react';
import { CyberCard, CyberCardHeader, CyberCardTitle, CyberCardContent } from '@/components/ui/cyber-card';
import { CyberButton } from '@/components/ui/cyber-button';
import { useGame } from '@/contexts/GameContext';
import { cn } from '@/lib/utils';

const iconMap: Record<string, React.ElementType> = {
  Bot,
  Cpu,
  Brain,
  Sparkles,
  Fish,
  Eye,
  Shield,
};

export const BlackMarket: React.FC = () => {
  const { shopItems, tokenBalance, buyShopItem } = useGame();

  const tradingBots = shopItems.filter(item => item.type === 'bot');
  const multipliers = shopItems.filter(item => item.type === 'multiplier');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-gradient-cyber flex items-center gap-3">
            <Store className="w-8 h-8" />
            Black Market
          </h1>
          <p className="text-muted-foreground font-body">Acquire powerful trading tools</p>
        </div>
        <div className="bg-secondary/50 rounded-lg px-4 py-2 border border-border/50">
          <p className="text-xs text-muted-foreground">Balance</p>
          <p className="font-display font-bold text-primary">{tokenBalance.toFixed(2)} IGC</p>
        </div>
      </div>

      {/* Trading Bots */}
      <div className="space-y-4">
        <h2 className="font-display text-xl font-semibold text-foreground flex items-center gap-2">
          <Bot className="w-5 h-5 text-primary" />
          Trading Bots
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {tradingBots.map((item) => {
            const Icon = iconMap[item.icon] || Bot;
            const canAfford = tokenBalance >= item.price;
            
            return (
              <CyberCard
                key={item.id}
                variant={item.owned ? 'emerald' : 'default'}
                glow={item.owned}
                className={cn(
                  "relative overflow-hidden transition-transform hover:scale-[1.02]",
                  item.owned && "border-primary/50"
                )}
              >
                {item.owned && (
                  <div className="absolute top-2 right-2">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </div>
                  </div>
                )}
                
                <CyberCardContent className="p-4 space-y-3">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center",
                    item.owned 
                      ? "bg-primary/20" 
                      : "bg-secondary"
                  )}>
                    <Icon className={cn(
                      "w-6 h-6",
                      item.owned ? "text-primary" : "text-muted-foreground"
                    )} />
                  </div>
                  
                  <div>
                    <h3 className="font-display font-semibold">{item.name}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-accent font-display">x{item.multiplier} boost</span>
                    <span className="font-display font-bold text-sm">{item.price} IGC</span>
                  </div>
                  
                  <CyberButton
                    variant={item.owned ? "ghost" : canAfford ? "default" : "ghost"}
                    size="sm"
                    className="w-full"
                    onClick={() => buyShopItem(item.id)}
                    disabled={item.owned || !canAfford}
                  >
                    {item.owned ? (
                      <>
                        <Check className="w-4 h-4" />
                        Owned
                      </>
                    ) : canAfford ? (
                      'Buy Now'
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        Locked
                      </>
                    )}
                  </CyberButton>
                </CyberCardContent>
              </CyberCard>
            );
          })}
        </div>
      </div>

      {/* Multipliers */}
      <div className="space-y-4">
        <h2 className="font-display text-xl font-semibold text-foreground flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-accent" />
          Premium Multipliers
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {multipliers.map((item) => {
            const Icon = iconMap[item.icon] || Sparkles;
            const canAfford = tokenBalance >= item.price;
            
            return (
              <CyberCard
                key={item.id}
                variant={item.owned ? 'gold' : 'default'}
                glow={item.owned}
                className="relative overflow-hidden"
              >
                {item.owned && (
                  <div className="absolute top-3 right-3">
                    <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center">
                      <Check className="w-4 h-4 text-accent-foreground" />
                    </div>
                  </div>
                )}
                
                <CyberCardContent className="p-4 flex items-center gap-4">
                  <div className={cn(
                    "w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0",
                    item.owned 
                      ? "bg-accent/20" 
                      : "bg-secondary"
                  )}>
                    <Icon className={cn(
                      "w-8 h-8",
                      item.owned ? "text-accent" : "text-muted-foreground"
                    )} />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-display font-semibold text-lg">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-sm text-accent font-display">x{item.multiplier} boost</span>
                      <span className="font-display font-bold">{item.price} IGC</span>
                    </div>
                  </div>
                  
                  <CyberButton
                    variant={item.owned ? "ghost" : canAfford ? "gold" : "ghost"}
                    onClick={() => buyShopItem(item.id)}
                    disabled={item.owned || !canAfford}
                  >
                    {item.owned ? 'Active' : canAfford ? 'Buy' : 'Locked'}
                  </CyberButton>
                </CyberCardContent>
              </CyberCard>
            );
          })}
        </div>
      </div>
    </div>
  );
};
