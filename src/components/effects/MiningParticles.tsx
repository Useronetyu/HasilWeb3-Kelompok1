import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface Particle {
  id: number;
  x: number;
  y: number;
  text: string;
  type: 'text' | 'sparkle';
  delay: number;
}

interface MiningParticlesProps {
  isActive: boolean;
  amount: number;
  position: { x: number; y: number };
  onComplete: () => void;
}

export const MiningParticles: React.FC<MiningParticlesProps> = ({
  isActive,
  amount,
  position,
  onComplete
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (isActive) {
      const newParticles: Particle[] = [];
      
      // Main "+amount" text
      newParticles.push({
        id: Date.now(),
        x: position.x,
        y: position.y - 20,
        text: `+${amount.toFixed(1)}`,
        type: 'text',
        delay: 0
      });

      // Sparkle particles
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const distance = 30 + Math.random() * 40;
        newParticles.push({
          id: Date.now() + i + 1,
          x: position.x + Math.cos(angle) * distance,
          y: position.y + Math.sin(angle) * distance - 20,
          text: '✦',
          type: 'sparkle',
          delay: i * 30
        });
      }

      setParticles(newParticles);

      const timer = setTimeout(() => {
        setParticles([]);
        onComplete();
      }, 1200);

      return () => clearTimeout(timer);
    }
  }, [isActive, amount, position, onComplete]);

  if (!isActive || particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={cn(
            "absolute font-display font-bold animate-particle-rise",
            particle.type === 'text' 
              ? "text-2xl text-accent drop-shadow-[0_0_10px_hsl(var(--accent))]"
              : "text-sm text-gold-glow drop-shadow-[0_0_5px_hsl(var(--gold))]"
          )}
          style={{
            left: particle.x,
            top: particle.y,
            animationDelay: `${particle.delay}ms`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          {particle.text}
        </div>
      ))}
    </div>
  );
};
