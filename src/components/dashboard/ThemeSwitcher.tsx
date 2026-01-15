import React from 'react';
import { Settings, Palette } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { CyberButton } from '@/components/ui/cyber-button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from '@/lib/utils';

export const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <CyberButton variant="ghost" size="sm" className="gap-2">
          <Settings className="w-4 h-4" />
          <span className="hidden sm:inline">Theme</span>
        </CyberButton>
      </PopoverTrigger>
      <PopoverContent className="w-64 bg-card border-border" align="end">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-primary" />
            <span className="font-display font-semibold text-sm">Theme Selector</span>
          </div>
          
          <div className="space-y-2">
            <button
              onClick={() => setTheme('matrix')}
              className={cn(
                "w-full p-3 rounded-lg border-2 transition-all flex items-center gap-3",
                theme === 'matrix' 
                  ? "border-emerald-500 bg-emerald-500/10" 
                  : "border-border hover:border-emerald-500/50"
              )}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex-shrink-0" />
              <div className="text-left">
                <p className="font-display font-semibold text-sm">Matrix Protocol</p>
                <p className="text-xs text-muted-foreground">Black & Emerald Green</p>
              </div>
            </button>

            <button
              onClick={() => setTheme('cyberblade')}
              className={cn(
                "w-full p-3 rounded-lg border-2 transition-all flex items-center gap-3",
                theme === 'cyberblade' 
                  ? "border-purple-500 bg-purple-500/10" 
                  : "border-border hover:border-purple-500/50"
              )}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-blue-600 flex-shrink-0" />
              <div className="text-left">
                <p className="font-display font-semibold text-sm">Cyber Blade</p>
                <p className="text-xs text-muted-foreground">Blue, Pink & Purple</p>
              </div>
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
