import React, { useState } from 'react';
import { Hammer, Plus, ArrowRight, Sparkles, Zap, AlertCircle } from 'lucide-react';
import { CyberCard, CyberCardHeader, CyberCardTitle, CyberCardContent } from '@/components/ui/cyber-card';
import { CyberButton } from '@/components/ui/cyber-button';
import { useGame } from '@/contexts/GameContext';
import { cn } from '@/lib/utils';
import { ForgeInventory, forgeItems, ForgeItem } from '@/components/forge/ForgeInventory';

const rarityColors = {
  common: 'from-gray-400 to-gray-600',
  rare: 'from-blue-400 to-blue-600',
  epic: 'from-purple-400 to-purple-600',
  legendary: 'from-amber-400 to-orange-500',
};

export const TheForge: React.FC = () => {
  const { nfts, craftItems, playSound } = useGame();
  const [slot1, setSlot1] = useState<ForgeItem | null>(null);
  const [slot2, setSlot2] = useState<ForgeItem | null>(null);
  const [result, setResult] = useState<typeof nfts[0] | null>(null);
  const [isCrafting, setIsCrafting] = useState(false);
  const [showSelection, setShowSelection] = useState<1 | 2 | null>(null);
  const [craftingPhase, setCraftingPhase] = useState<'idle' | 'processing' | 'complete'>('idle');

  const handleSelectItem = (item: ForgeItem) => {
    if (showSelection === 1) {
      setSlot1(item);
    } else if (showSelection === 2) {
      setSlot2(item);
    }
    setShowSelection(null);
    setResult(null);
  };

  const handleCraft = async () => {
    if (!slot1 || !slot2) return;
    
    setIsCrafting(true);
    setCraftingPhase('processing');
    playSound('craft');
    
    // 2-second fusion animation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Create a mock "Super GPU" result
    const craftedItem = {
      id: Date.now().toString(),
      name: 'Super GPU',
      type: 'rig' as const,
      rarity: 'epic' as const,
      miningBoost: 0.75,
      image: '/placeholder.svg',
      equipped: false
    };
    
    setCraftingPhase('complete');
    setResult(craftedItem);
    setSlot1(null);
    setSlot2(null);
    setIsCrafting(false);
  };

  const clearSlots = () => {
    setSlot1(null);
    setSlot2(null);
    setResult(null);
    setCraftingPhase('idle');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-gradient-cyber flex items-center gap-3">
          <Hammer className="w-8 h-8" />
          The Forge
        </h1>
        <p className="text-muted-foreground font-body">Combine materials to create powerful upgrades</p>
      </div>

      {/* Crafting Station */}
      <CyberCard variant="gradient" className="relative overflow-hidden">
        <div className="absolute inset-0 scanline pointer-events-none" />
        
        <CyberCardHeader>
          <CyberCardTitle className="text-center">Fusion Chamber</CyberCardTitle>
        </CyberCardHeader>
        
        <CyberCardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
            {/* Slot 1 */}
            <div
              onClick={() => !isCrafting && setShowSelection(1)}
              className={cn(
                "w-32 h-40 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all",
                slot1 
                  ? "border-primary bg-primary/10" 
                  : "border-muted-foreground/50 hover:border-primary/50 hover:bg-primary/5",
                isCrafting && "animate-forge-shake pointer-events-none",
                craftingPhase === 'processing' && "glow-emerald"
              )}
            >
              {slot1 ? (
                <div className="text-center p-2">
                  <div className={cn(
                    "w-16 h-16 rounded-lg bg-gradient-to-br flex items-center justify-center mx-auto mb-2",
                    rarityColors[slot1.rarity]
                  )}>
                    <slot1.icon className="w-8 h-8 text-white" />
                  </div>
                  <p className="font-display text-xs font-semibold truncate w-full">{slot1.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{slot1.rarity}</p>
                </div>
              ) : (
                <>
                  <Plus className="w-8 h-8 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground mt-2">Input Slot 1</p>
                </>
              )}
            </div>

            {/* Plus Sign */}
            <div className="flex items-center justify-center">
              <div className={cn(
                "w-10 h-10 rounded-full bg-secondary flex items-center justify-center",
                craftingPhase === 'processing' && "animate-pulse bg-primary"
              )}>
                <Plus className="w-5 h-5 text-primary" />
              </div>
            </div>

            {/* Slot 2 */}
            <div
              onClick={() => !isCrafting && setShowSelection(2)}
              className={cn(
                "w-32 h-40 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all",
                slot2 
                  ? "border-accent bg-accent/10" 
                  : "border-muted-foreground/50 hover:border-accent/50 hover:bg-accent/5",
                isCrafting && "animate-forge-shake pointer-events-none",
                craftingPhase === 'processing' && "glow-gold"
              )}
            >
              {slot2 ? (
                <div className="text-center p-2">
                  <div className={cn(
                    "w-16 h-16 rounded-lg bg-gradient-to-br flex items-center justify-center mx-auto mb-2",
                    rarityColors[slot2.rarity]
                  )}>
                    <slot2.icon className="w-8 h-8 text-white" />
                  </div>
                  <p className="font-display text-xs font-semibold truncate w-full">{slot2.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{slot2.rarity}</p>
                </div>
              ) : (
                <>
                  <Plus className="w-8 h-8 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground mt-2">Input Slot 2</p>
                </>
              )}
            </div>

            {/* Arrow */}
            <div className="flex items-center justify-center">
              <ArrowRight className={cn(
                "w-8 h-8 transition-all",
                isCrafting ? "text-primary animate-pulse" : "text-muted-foreground"
              )} />
            </div>

            {/* Result Slot */}
            <div className={cn(
              "w-32 h-40 rounded-xl border-2 flex flex-col items-center justify-center transition-all",
              result 
                ? "border-accent bg-gradient-to-br from-accent/20 to-primary/20 glow-gold" 
                : "border-muted-foreground/30 bg-secondary/30"
            )}>
              {result ? (
                <div className="text-center p-2 animate-coin-pop">
                  <div className={cn(
                    "w-16 h-16 rounded-lg bg-gradient-to-br flex items-center justify-center mx-auto mb-2",
                    rarityColors[result.rarity]
                  )}>
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <p className="font-display text-xs font-semibold truncate w-full">{result.name}</p>
                  <p className="text-xs text-accent capitalize">{result.rarity}</p>
                  <p className="text-xs text-primary">+{(result.miningBoost * 100).toFixed(0)}%</p>
                </div>
              ) : craftingPhase === 'processing' ? (
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-2" />
                  <p className="text-xs text-primary font-display">Fusing...</p>
                </div>
              ) : (
                <>
                  <Sparkles className="w-8 h-8 text-muted-foreground/50" />
                  <p className="text-xs text-muted-foreground mt-2">Result</p>
                </>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-center gap-4 mt-8">
            <CyberButton
              variant="ghost"
              onClick={clearSlots}
              disabled={isCrafting || (!slot1 && !slot2 && !result)}
            >
              Clear
            </CyberButton>
            <CyberButton
              variant="gradient"
              size="lg"
              onClick={handleCraft}
              disabled={!slot1 || !slot2 || isCrafting}
              className="min-w-[150px]"
            >
              {isCrafting ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  Forging...
                </div>
              ) : (
                <>
                  <Hammer className="w-5 h-5" />
                  Craft Item
                </>
              )}
            </CyberButton>
          </div>

          {/* Warning */}
          <div className="flex items-center justify-center gap-2 mt-4 text-xs text-muted-foreground">
            <AlertCircle className="w-4 h-4" />
            <span>Warning: Input items will be consumed in the fusion process</span>
          </div>
        </CyberCardContent>
      </CyberCard>

      {/* Item Selection Modal */}
      {showSelection && (
        <CyberCard className="p-4">
          <CyberCardContent>
            <ForgeInventory
              onSelectItem={handleSelectItem}
              selectedItems={[slot1, slot2]}
              onClose={() => setShowSelection(null)}
            />
          </CyberCardContent>
        </CyberCard>
      )}
    </div>
  );
};
