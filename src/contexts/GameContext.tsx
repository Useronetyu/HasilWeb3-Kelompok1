import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';

// Ethereum type declarations
declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on: (event: string, callback: (...args: unknown[]) => void) => void;
      removeListener: (event: string, callback: (...args: unknown[]) => void) => void;
    };
  }
}

interface NFTItem {
  id: string;
  name: string;
  type: 'rig' | 'resource';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  miningBoost: number;
  image: string;
  equipped: boolean;
}

interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  type: 'bot' | 'multiplier';
  multiplier: number;
  owned: boolean;
  icon: string;
  autoMineRate?: number;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  target: number;
  reward: number;
  unlocked: boolean;
  claimed: boolean;
  icon: string;
  type: 'clicks' | 'spending';
}

interface Transaction {
  id: string;
  type: 'mine' | 'stake' | 'unstake' | 'buy' | 'craft' | 'transfer' | 'claim';
  amount: number;
  timestamp: Date;
  description: string;
}

interface GameState {
  walletConnected: boolean;
  walletAddress: string;
  tokenBalance: number;
  stakedAmount: number;
  claimableRewards: number;
  miningRate: number;
  dailyStreak: number;
  lastClaimDate: string | null;
  referralCode: string;
  nfts: NFTItem[];
  shopItems: ShopItem[];
  achievements: Achievement[];
  transactions: Transaction[];
  totalMined: number;
  totalClicks: number;
  totalSpent: number;
  rank: number;
  isSprintActive: boolean;
  sprintTimeLeft: number;
}

interface GameContextType extends GameState {
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  mine: () => number;
  stake: (amount: number) => void;
  unstake: (amount: number) => void;
  claimRewards: () => void;
  claimDailyBonus: () => void;
  buyShopItem: (itemId: string) => void;
  mintNFT: () => void;
  equipNFT: (nftId: string) => void;
  craftItems: (item1Id: string, item2Id: string) => NFTItem | null;
  transferAssets: (address: string, amount: number) => boolean;
  playSound: (type: 'mine' | 'craft' | 'transaction' | 'achievement') => void;
  startMiningSprint: () => void;
  claimAchievement: (achievementId: string) => void;
  hasAutoMining: boolean;
  autoMineRate: number;
}

const initialShopItems: ShopItem[] = [
  { id: 'bot1', name: 'Basic Trader', description: 'Automated trading with basic strategies', price: 100, type: 'bot', multiplier: 1.1, owned: false, icon: 'Bot', autoMineRate: 1 },
  { id: 'bot2', name: 'Algo Trader', description: 'Advanced algorithmic trading patterns', price: 500, type: 'bot', multiplier: 1.25, owned: false, icon: 'Cpu', autoMineRate: 2 },
  { id: 'bot3', name: 'Quant Engine', description: 'Quantitative analysis powerhouse', price: 2000, type: 'bot', multiplier: 1.5, owned: false, icon: 'Brain', autoMineRate: 5 },
  { id: 'bot4', name: 'AI Analyst', description: 'AI-powered market predictions', price: 5000, type: 'bot', multiplier: 2, owned: false, icon: 'Sparkles', autoMineRate: 10 },
  { id: 'bot5', name: 'Whale Tracker', description: 'Follow the big money moves', price: 10000, type: 'bot', multiplier: 3, owned: false, icon: 'Fish', autoMineRate: 25 },
  { id: 'mult1', name: 'Insider Tips', description: 'Exclusive market intelligence', price: 750, type: 'multiplier', multiplier: 1.2, owned: false, icon: 'Eye' },
  { id: 'mult2', name: 'Hedge Fund Access', description: 'Premium institutional strategies', price: 3000, type: 'multiplier', multiplier: 1.75, owned: false, icon: 'Shield' },
];

const initialAchievements: Achievement[] = [
  { id: 'ach1', name: 'Novice Miner', description: 'Reach 1,000 total clicks', target: 1000, reward: 500, unlocked: false, claimed: false, icon: 'Pickaxe', type: 'clicks' },
  { id: 'ach2', name: 'Dedicated Miner', description: 'Reach 10,000 total clicks', target: 10000, reward: 2500, unlocked: false, claimed: false, icon: 'Star', type: 'clicks' },
  { id: 'ach3', name: 'Master Miner', description: 'Reach 100,000 total clicks', target: 100000, reward: 15000, unlocked: false, claimed: false, icon: 'Crown', type: 'clicks' },
  { id: 'ach4', name: 'First Purchase', description: 'Spend 1,000 coins total', target: 1000, reward: 250, unlocked: false, claimed: false, icon: 'ShoppingBag', type: 'spending' },
];

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<GameState>(() => {
    const saved = localStorage.getItem('ilhamCryptoState');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        transactions: parsed.transactions?.map((t: Transaction) => ({
          ...t,
          timestamp: new Date(t.timestamp)
        })) || [],
        totalClicks: parsed.totalClicks || 0,
        totalSpent: parsed.totalSpent || 0,
        isSprintActive: false,
        sprintTimeLeft: 0,
        achievements: parsed.achievements?.length === 4 
          ? parsed.achievements 
          : initialAchievements.map(a => ({
              ...a,
              unlocked: parsed.achievements?.find((pa: Achievement) => pa.id === a.id)?.unlocked || false,
              claimed: parsed.achievements?.find((pa: Achievement) => pa.id === a.id)?.claimed || false,
            }))
      };
    }
    return {
      walletConnected: false,
      walletAddress: '',
      tokenBalance: 0,
      stakedAmount: 0,
      claimableRewards: 0,
      miningRate: 1,
      dailyStreak: 0,
      lastClaimDate: null,
      referralCode: 'ILHAM' + Math.random().toString(36).substring(2, 8).toUpperCase(),
      nfts: [],
      shopItems: initialShopItems,
      achievements: initialAchievements,
      transactions: [],
      totalMined: 0,
      totalClicks: 0,
      totalSpent: 0,
      rank: 1,
      isSprintActive: false,
      sprintTimeLeft: 0,
    };
  });

  const sprintTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Save state to localStorage
  useEffect(() => {
    const stateToSave = { ...state };
    localStorage.setItem('ilhamCryptoState', JSON.stringify(stateToSave));
  }, [state]);

  // Passive staking rewards
  useEffect(() => {
    if (state.stakedAmount > 0) {
      const interval = setInterval(() => {
        const reward = (state.stakedAmount * 0.15) / (365 * 24 * 60);
        setState(prev => ({
          ...prev,
          claimableRewards: prev.claimableRewards + reward
        }));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [state.stakedAmount]);

  // Auto-mining from bots
  const hasAutoMining = state.shopItems.some(item => item.type === 'bot' && item.owned);
  const autoMineRate = state.shopItems
    .filter(item => item.type === 'bot' && item.owned)
    .reduce((acc, item) => acc + (item.autoMineRate || 0), 0);

  useEffect(() => {
    if (hasAutoMining && autoMineRate > 0) {
      const interval = setInterval(() => {
        setState(prev => ({
          ...prev,
          tokenBalance: prev.tokenBalance + autoMineRate,
          totalMined: prev.totalMined + autoMineRate
        }));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [hasAutoMining, autoMineRate]);

  // Check achievements
  useEffect(() => {
    setState(prev => {
      let hasNewUnlock = false;
      const updatedAchievements = prev.achievements.map(ach => {
        if (ach.unlocked) return ach;
        
        let progress = 0;
        if (ach.type === 'clicks') {
          progress = prev.totalClicks;
        } else if (ach.type === 'spending') {
          progress = prev.totalSpent;
        }
        
        if (progress >= ach.target && !ach.unlocked) {
          hasNewUnlock = true;
          return { ...ach, unlocked: true };
        }
        return ach;
      });

      if (hasNewUnlock) {
        const unlockedAch = updatedAchievements.find(a => a.unlocked && !prev.achievements.find(pa => pa.id === a.id && pa.unlocked));
        if (unlockedAch) {
          toast.success(`🏆 Achievement Unlocked: ${unlockedAch.name}!`, {
            description: `Reward: +${unlockedAch.reward} IGC available to claim!`
          });
        }
        return { ...prev, achievements: updatedAchievements };
      }
      return prev;
    });
  }, [state.totalClicks, state.totalSpent]);

  const playSound = useCallback((type: 'mine' | 'craft' | 'transaction' | 'achievement') => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    switch (type) {
      case 'mine':
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.15);
        break;
      case 'craft':
        oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.2);
        oscillator.frequency.exponentialRampToValueAtTime(1600, audioContext.currentTime + 0.4);
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
        break;
      case 'transaction':
        oscillator.frequency.setValueAtTime(523, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.2);
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
        break;
      case 'achievement':
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(523, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.15);
        oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.3);
        oscillator.frequency.setValueAtTime(1047, audioContext.currentTime + 0.45);
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.6);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.6);
        break;
    }
  }, []);

  const addTransaction = (type: Transaction['type'], amount: number, description: string) => {
    const transaction: Transaction = {
      id: Date.now().toString(),
      type,
      amount,
      timestamp: new Date(),
      description
    };
    setState(prev => ({
      ...prev,
      transactions: [transaction, ...prev.transactions].slice(0, 50)
    }));
  };

  // Helper to truncate address
  const truncateAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Connect to MetaMask wallet
  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      toast.error('MetaMask Not Found', { 
        description: 'Please install MetaMask to continue.' 
      });
      return;
    }

    try {
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      }) as string[];
      
      if (accounts && accounts.length > 0) {
        const address = accounts[0];
        const displayAddress = truncateAddress(address);
        
        setState(prev => ({ 
          ...prev, 
          walletConnected: true, 
          walletAddress: displayAddress 
        }));
        
        // Store full address for persistence
        localStorage.setItem('connectedWalletAddress', address);
        
        playSound('transaction');
        toast.success('Wallet Connected!', { description: displayAddress });
      }
    } catch (error: unknown) {
      const err = error as { code?: number; message?: string };
      if (err.code === 4001) {
        toast.error('Connection Rejected', { 
          description: 'You rejected the connection request.' 
        });
      } else {
        toast.error('Connection Failed', { 
          description: err.message || 'Failed to connect wallet.' 
        });
      }
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setState(prev => ({ ...prev, walletConnected: false, walletAddress: '' }));
    localStorage.removeItem('connectedWalletAddress');
    toast.info('Wallet Disconnected');
  };

  // Listen for account changes in MetaMask
  useEffect(() => {
    if (typeof window.ethereum === 'undefined') return;

    const handleAccountsChanged = (accounts: unknown) => {
      const accountList = accounts as string[];
      if (accountList.length === 0) {
        // User disconnected from MetaMask
        disconnectWallet();
      } else if (state.walletConnected) {
        // User switched accounts
        const newAddress = accountList[0];
        const displayAddress = truncateAddress(newAddress);
        
        setState(prev => ({ 
          ...prev, 
          walletAddress: displayAddress 
        }));
        localStorage.setItem('connectedWalletAddress', newAddress);
        toast.info('Account Changed', { description: displayAddress });
      }
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);

    return () => {
      window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
    };
  }, [state.walletConnected]);

  // Check for existing connection on page load
  useEffect(() => {
    const checkExistingConnection = async () => {
      if (typeof window.ethereum === 'undefined') return;

      const savedAddress = localStorage.getItem('connectedWalletAddress');
      if (!savedAddress) return;

      try {
        const accounts = await window.ethereum.request({ 
          method: 'eth_accounts' 
        }) as string[];

        if (accounts && accounts.length > 0 && accounts[0].toLowerCase() === savedAddress.toLowerCase()) {
          const displayAddress = truncateAddress(accounts[0]);
          setState(prev => ({ 
            ...prev, 
            walletConnected: true, 
            walletAddress: displayAddress 
          }));
        } else {
          // Saved address doesn't match current MetaMask account
          localStorage.removeItem('connectedWalletAddress');
        }
      } catch (error) {
        console.error('Failed to check existing connection:', error);
        localStorage.removeItem('connectedWalletAddress');
      }
    };

    checkExistingConnection();
  }, []);

  const mine = (): number => {
    const miningMultiplier = state.shopItems
      .filter(item => item.owned)
      .reduce((acc, item) => acc * item.multiplier, 1);
    
    const equippedBoost = state.nfts
      .filter(nft => nft.equipped)
      .reduce((acc, nft) => acc + nft.miningBoost, 0);
    
    const baseAmount = state.miningRate * miningMultiplier * (1 + equippedBoost);
    const streakBonus = 1 + (state.dailyStreak * 0.1);
    const sprintBonus = state.isSprintActive ? 2 : 1;
    const amount = baseAmount * streakBonus * sprintBonus;
    
    setState(prev => ({
      ...prev,
      tokenBalance: prev.tokenBalance + amount,
      totalMined: prev.totalMined + amount,
      totalClicks: prev.totalClicks + 1
    }));
    
    addTransaction('mine', amount, `Mined ${amount.toFixed(2)} IGC`);
    playSound('mine');
    
    return amount;
  };

  const stake = (amount: number) => {
    if (amount <= state.tokenBalance) {
      setState(prev => ({
        ...prev,
        tokenBalance: prev.tokenBalance - amount,
        stakedAmount: prev.stakedAmount + amount
      }));
      addTransaction('stake', amount, `Staked ${amount.toFixed(2)} IGC`);
      playSound('transaction');
    }
  };

  const unstake = (amount: number) => {
    if (amount <= state.stakedAmount) {
      setState(prev => ({
        ...prev,
        tokenBalance: prev.tokenBalance + amount,
        stakedAmount: prev.stakedAmount - amount
      }));
      addTransaction('unstake', amount, `Unstaked ${amount.toFixed(2)} IGC`);
      playSound('transaction');
    }
  };

  const claimRewards = () => {
    if (state.claimableRewards > 0) {
      const rewards = state.claimableRewards;
      setState(prev => ({
        ...prev,
        tokenBalance: prev.tokenBalance + rewards,
        claimableRewards: 0
      }));
      addTransaction('claim', rewards, `Claimed ${rewards.toFixed(4)} IGC staking rewards`);
      playSound('transaction');
    }
  };

  const claimDailyBonus = () => {
    const today = new Date().toDateString();
    if (state.lastClaimDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const newStreak = state.lastClaimDate === yesterday.toDateString() 
        ? Math.min(state.dailyStreak + 1, 7) 
        : 1;
      
      const bonus = 10 * newStreak;
      
      setState(prev => ({
        ...prev,
        tokenBalance: prev.tokenBalance + bonus,
        dailyStreak: newStreak,
        lastClaimDate: today
      }));
      addTransaction('claim', bonus, `Daily bonus Day ${newStreak}: +${bonus} IGC`);
      playSound('achievement');
      toast.success(`Day ${newStreak} Bonus Claimed!`, { description: `+${bonus} IGC` });
    }
  };

  const buyShopItem = (itemId: string) => {
    const item = state.shopItems.find(i => i.id === itemId);
    if (item && !item.owned && state.tokenBalance >= item.price) {
      setState(prev => ({
        ...prev,
        tokenBalance: prev.tokenBalance - item.price,
        totalSpent: prev.totalSpent + item.price,
        shopItems: prev.shopItems.map(i => 
          i.id === itemId ? { ...i, owned: true } : i
        )
      }));
      addTransaction('buy', item.price, `Purchased ${item.name}`);
      playSound('transaction');
      
      if (item.type === 'bot') {
        toast.success(`${item.name} Activated!`, { 
          description: `Auto-mining at +${item.autoMineRate} IGC/sec` 
        });
      } else {
        toast.success(`${item.name} Purchased!`, { 
          description: `x${item.multiplier} boost active` 
        });
      }
    }
  };

  const mintNFT = () => {
    const cost = 50;
    if (state.tokenBalance >= cost) {
      const rigNames = ['GPU Rig', 'ASIC Miner', 'Quantum Node', 'Neural Network', 'Solar Farm', 'Hydro Station'];
      const rarities: NFTItem['rarity'][] = ['common', 'rare', 'epic', 'legendary'];
      const rarityWeights = [0.6, 0.25, 0.12, 0.03];
      
      const rand = Math.random();
      let rarity: NFTItem['rarity'] = 'common';
      let cumulative = 0;
      for (let i = 0; i < rarityWeights.length; i++) {
        cumulative += rarityWeights[i];
        if (rand < cumulative) {
          rarity = rarities[i];
          break;
        }
      }
      
      const boostMultipliers = { common: 0.1, rare: 0.25, epic: 0.5, legendary: 1 };
      
      const nft: NFTItem = {
        id: Date.now().toString(),
        name: rigNames[Math.floor(Math.random() * rigNames.length)],
        type: 'rig',
        rarity,
        miningBoost: boostMultipliers[rarity],
        image: `/placeholder.svg`,
        equipped: false
      };
      
      setState(prev => ({
        ...prev,
        tokenBalance: prev.tokenBalance - cost,
        totalSpent: prev.totalSpent + cost,
        nfts: [...prev.nfts, nft]
      }));
      addTransaction('buy', cost, `Minted ${rarity} ${nft.name}`);
      playSound('craft');
      toast.success(`NFT Minted!`, { description: `${rarity.toUpperCase()} ${nft.name}` });
    }
  };

  const equipNFT = (nftId: string) => {
    setState(prev => ({
      ...prev,
      nfts: prev.nfts.map(nft => 
        nft.id === nftId ? { ...nft, equipped: !nft.equipped } : nft
      )
    }));
    playSound('transaction');
  };

  const craftItems = (item1Id: string, item2Id: string): NFTItem | null => {
    const item1 = state.nfts.find(n => n.id === item1Id);
    const item2 = state.nfts.find(n => n.id === item2Id);
    
    if (!item1 || !item2 || item1.id === item2.id) return null;
    
    const craftedNames = ['Super GPU', 'Fusion Core', 'Hyper Processor', 'Dark Matter Engine'];
    const newRarity = Math.random() > 0.7 ? 'legendary' : 'epic';
    
    const newNFT: NFTItem = {
      id: Date.now().toString(),
      name: craftedNames[Math.floor(Math.random() * craftedNames.length)],
      type: 'rig',
      rarity: newRarity as NFTItem['rarity'],
      miningBoost: item1.miningBoost + item2.miningBoost + 0.2,
      image: `/placeholder.svg`,
      equipped: false
    };
    
    setState(prev => ({
      ...prev,
      nfts: [...prev.nfts.filter(n => n.id !== item1Id && n.id !== item2Id), newNFT]
    }));
    
    addTransaction('craft', 0, `Crafted ${newNFT.rarity} ${newNFT.name}`);
    playSound('craft');
    toast.success('Item Crafted Successfully!', { 
      description: `Created ${newNFT.rarity.toUpperCase()} ${newNFT.name}` 
    });
    
    return newNFT;
  };

  const transferAssets = (address: string, amount: number): boolean => {
    if (amount <= state.tokenBalance && address.startsWith('0x')) {
      setState(prev => ({
        ...prev,
        tokenBalance: prev.tokenBalance - amount
      }));
      addTransaction('transfer', amount, `Transferred ${amount} IGC to ${address.substring(0, 10)}...`);
      playSound('transaction');
      toast.success('Transfer Complete!', { description: `${amount} IGC sent to ${address.substring(0, 10)}...` });
      return true;
    }
    return false;
  };

  const startMiningSprint = () => {
    if (state.isSprintActive) return;

    setState(prev => ({ ...prev, isSprintActive: true, sprintTimeLeft: 30 }));
    toast('⚡ Mining Sprint Started!', { description: 'All clicks are worth 2x for 30 seconds!' });
    playSound('achievement');

    if (sprintTimerRef.current) clearInterval(sprintTimerRef.current);

    sprintTimerRef.current = setInterval(() => {
      setState(prev => {
        if (prev.sprintTimeLeft <= 1) {
          if (sprintTimerRef.current) clearInterval(sprintTimerRef.current);
          toast('Mining Sprint Ended!', { description: 'Great mining session!' });
          return { ...prev, isSprintActive: false, sprintTimeLeft: 0 };
        }
        return { ...prev, sprintTimeLeft: prev.sprintTimeLeft - 1 };
      });
    }, 1000);
  };

  const claimAchievement = (achievementId: string) => {
    const achievement = state.achievements.find(a => a.id === achievementId);
    if (achievement && achievement.unlocked && !achievement.claimed) {
      setState(prev => ({
        ...prev,
        tokenBalance: prev.tokenBalance + achievement.reward,
        achievements: prev.achievements.map(a => 
          a.id === achievementId ? { ...a, claimed: true } : a
        )
      }));
      addTransaction('claim', achievement.reward, `Achievement reward: ${achievement.name}`);
      playSound('achievement');
      toast.success(`Reward Claimed!`, { description: `+${achievement.reward} IGC` });
    }
  };

  return (
    <GameContext.Provider value={{
      ...state,
      connectWallet,
      disconnectWallet,
      mine,
      stake,
      unstake,
      claimRewards,
      claimDailyBonus,
      buyShopItem,
      mintNFT,
      equipNFT,
      craftItems,
      transferAssets,
      playSound,
      startMiningSprint,
      claimAchievement,
      hasAutoMining,
      autoMineRate
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
