import React from 'react';
import { Package, Cpu, Fan, Zap, Microchip, Battery } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ForgeItem {
  id: string;
  name: string;
  icon: React.ElementType;
  rarity: 'common' | 'rare' | 'epic';
  type: 'material';
}

export const forgeItems: ForgeItem[] = [
  { id: 'raw-silicon', name: 'Raw Silicon', icon: Package, rarity: 'common', type: 'material' },
  { id: 'cooling-fan', name: 'Cooling Fan', icon: Fan, rarity: 'common', type: 'material' },
  { id: 'overclock-chip', name: 'Overclock Chip', icon: Microchip, rarity: 'rare', type: 'material' },
  { id: 'power-cell', name: 'Power Cell', icon: Battery, rarity: 'common', type: 'material' },
  { id: 'quantum-core', name: 'Quantum Core', icon: Cpu, rarity: 'epic', type: 'material' },
  { id: 'flux-capacitor', name: 'Flux Capacitor', icon: Zap, rarity: 'rare', type: 'material' },
];

const rarityColors = {
  common: 'from-gray-400 to-gray-600 border-gray-500',
  rare: 'from-blue-400 to-blue-600 border-blue-500',
  epic: 'from-purple-400 to-purple-600 border-purple-500',
};

interface ForgeInventoryProps {
  onSelectItem: (item: ForgeItem) => void;
  selectedItems: (ForgeItem | null)[];
  onClose: () => void;
}

export const ForgeInventory: React.FC<ForgeInventoryProps> = ({
  onSelectItem,
  selectedItems,
  onClose
}) => {
  const availableItems = forgeItems.filter(
    item => !selectedItems.some(selected => selected?.id === item.id)
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold">Select Material</h3>
        <button 
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          ✕
        </button>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {availableItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onSelectItem(item)}
              className={cn(
                "p-4 rounded-xl border-2 transition-all hover:scale-105",
                "bg-gradient-to-br",
                rarityColors[item.rarity]
              )}
            >
              <Icon className="w-8 h-8 mx-auto mb-2 text-white drop-shadow-lg" />
              <p className="text-xs font-display font-semibold text-white text-center truncate">
                {item.name}
              </p>
              <p className="text-xs text-white/70 text-center capitalize">
                {item.rarity}
              </p>
            </button>
          );
        })}
      </div>

      {availableItems.length === 0 && (
        <p className="text-center text-muted-foreground py-4">
          No more materials available
        </p>
      )}
    </div>
  );
};
