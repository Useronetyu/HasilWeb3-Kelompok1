import React, { useState, useEffect } from 'react';
import { Radio, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

const newsItems = [
  { text: "🚀 IGC Token surges 20%! Markets going bullish!", type: "positive" },
  { text: "⚠️ Market Crash incoming! Whales moving assets!", type: "warning" },
  { text: "💎 New NFT collection drops in 24 hours", type: "neutral" },
  { text: "📈 Mining difficulty decreased by 15%", type: "positive" },
  { text: "🔥 Flash sale at Black Market - 50% off bots!", type: "neutral" },
  { text: "🐋 Whale Alert: 1M IGC transferred to unknown wallet", type: "warning" },
  { text: "✨ Legendary GPU Rig spotted in The Forge", type: "positive" },
  { text: "📊 Daily trading volume hits all-time high", type: "positive" },
  { text: "⚡ New mining algorithm update coming soon", type: "neutral" },
  { text: "🎯 Top miner reaches 1M total IGC mined!", type: "positive" },
];

export const NewsTicker: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % newsItems.length);
        setIsAnimating(false);
      }, 500);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const currentNews = newsItems[currentIndex];

  return (
    <div className="bg-secondary/50 border border-border/50 rounded-lg overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-2">
        <div className="flex items-center gap-2 flex-shrink-0">
          <Radio className="w-4 h-4 text-primary animate-pulse" />
          <span className="text-xs font-display font-semibold text-primary uppercase tracking-wider">
            Live Feed
          </span>
        </div>
        
        <div className="h-4 w-px bg-border" />
        
        <div className="flex-1 overflow-hidden">
          <div
            className={cn(
              "flex items-center gap-2 transition-all duration-500",
              isAnimating ? "opacity-0 -translate-y-4" : "opacity-100 translate-y-0"
            )}
          >
            {currentNews.type === 'positive' && (
              <TrendingUp className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            )}
            {currentNews.type === 'warning' && (
              <TrendingDown className="w-4 h-4 text-destructive flex-shrink-0" />
            )}
            {currentNews.type === 'neutral' && (
              <AlertTriangle className="w-4 h-4 text-accent flex-shrink-0" />
            )}
            <span className={cn(
              "text-sm font-body truncate",
              currentNews.type === 'positive' && "text-emerald-400",
              currentNews.type === 'warning' && "text-destructive",
              currentNews.type === 'neutral' && "text-foreground"
            )}>
              {currentNews.text}
            </span>
          </div>
        </div>

        <div className="flex gap-1 flex-shrink-0">
          {newsItems.map((_, idx) => (
            <div
              key={idx}
              className={cn(
                "w-1.5 h-1.5 rounded-full transition-colors duration-300",
                idx === currentIndex ? "bg-primary" : "bg-muted-foreground/30"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
