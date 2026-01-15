import React, { useState } from 'react';
import { GameProvider } from '@/contexts/GameContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { Dashboard } from '@/pages/Dashboard';
import { BlackMarket } from '@/pages/BlackMarket';
import { Equipment } from '@/pages/Equipment';
import { TheForge } from '@/pages/TheForge';
import { Profile } from '@/pages/Profile';
import { Toaster } from '@/components/ui/sonner';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'market':
        return <BlackMarket />;
      case 'equipment':
        return <Equipment />;
      case 'forge':
        return <TheForge />;
      case 'profile':
        return <Profile />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ThemeProvider>
      <GameProvider>
        <MainLayout activeTab={activeTab} onTabChange={setActiveTab}>
          {renderContent()}
        </MainLayout>
        <Toaster position="top-right" richColors />
      </GameProvider>
    </ThemeProvider>
  );
};

export default Index;
