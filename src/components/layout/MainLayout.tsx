import React from 'react';
import { LayoutDashboard, Store, Boxes, Hammer, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeSwitcher } from '@/components/dashboard/ThemeSwitcher';

interface MainLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'market', label: 'Black Market', icon: Store },
  { id: 'equipment', label: 'Equipment', icon: Boxes },
  { id: 'forge', label: 'The Forge', icon: Hammer },
  { id: 'profile', label: 'Profile', icon: User },
];

export const MainLayout: React.FC<MainLayoutProps> = ({ children, activeTab, onTabChange }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Desktop Header */}
      <header className="hidden md:flex items-center justify-between px-6 py-4 border-b border-border/50 glass-card">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-emerald">
            <span className="font-display font-bold text-primary-foreground">I</span>
          </div>
          <h1 className="font-display text-xl font-bold text-gradient-cyber">ILHAM CRYPTO</h1>
        </div>
        
        <nav className="flex items-center gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg font-body font-semibold text-sm transition-all duration-300",
                activeTab === tab.id
                  ? "bg-primary/20 text-primary glow-emerald"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>

        <ThemeSwitcher />
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 pb-24 md:pb-6 overflow-auto">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass-card border-t border-border/50 px-2 py-2 z-50">
        <div className="flex items-center justify-around">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-300",
                activeTab === tab.id
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              <div className={cn(
                "p-2 rounded-lg transition-all duration-300",
                activeTab === tab.id && "bg-primary/20 glow-emerald"
              )}>
                <tab.icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-body font-medium">{tab.label.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};
