import React, { useState } from 'react';
import { Users, Copy, Check, Share2 } from 'lucide-react';
import { CyberCard, CyberCardHeader, CyberCardTitle, CyberCardContent } from '@/components/ui/cyber-card';
import { CyberButton } from '@/components/ui/cyber-button';
import { useGame } from '@/contexts/GameContext';
import { useToast } from '@/hooks/use-toast';

export const ReferralCard: React.FC = () => {
  const { referralCode, playSound } = useGame();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const referralLink = `https://ilham.crypto/ref/${referralCode}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(referralLink);
    setCopied(true);
    playSound('transaction');
    toast({
      title: "Link Copied!",
      description: "Referral link copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <CyberCard>
      <CyberCardHeader>
        <CyberCardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          Referral Program
        </CyberCardTitle>
      </CyberCardHeader>
      
      <CyberCardContent className="space-y-4">
        <div className="bg-secondary/50 rounded-lg p-3">
          <p className="text-xs text-muted-foreground mb-2">Your Invite Code</p>
          <p className="font-display font-bold text-xl text-gradient-cyber">{referralCode}</p>
        </div>

        <div className="bg-secondary/50 rounded-lg p-3">
          <p className="text-xs text-muted-foreground mb-2">Invite Link</p>
          <p className="font-body text-sm text-foreground/80 truncate">{referralLink}</p>
        </div>

        <CyberButton
          variant="outline"
          className="w-full"
          onClick={handleCopy}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy Invite Link
            </>
          )}
        </CyberButton>

        <div className="text-center text-sm text-muted-foreground">
          <p>Earn <span className="text-accent font-bold">50 IGC</span> for each friend who joins!</p>
        </div>
      </CyberCardContent>
    </CyberCard>
  );
};
