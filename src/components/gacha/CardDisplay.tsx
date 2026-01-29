import { FC, useState, useEffect } from 'react';
import { Card, Rarity } from '@/lib/gacha/types';

interface CardDisplayProps {
  cards: Card[];
  onComplete: () => void;
}

const getRarityClass = (rarity: Rarity): string => {
  const classes: Record<Rarity, string> = {
    SSR: 'rarity-ssr',
    SR: 'rarity-sr',
    R: 'rarity-r',
    N: 'rarity-n'
  };
  return classes[rarity];
};

export const CardDisplay: FC<CardDisplayProps> = ({ cards, onComplete }) => {
  const [revealedCount, setRevealedCount] = useState(0);
  const [showGoldenOverlay, setShowGoldenOverlay] = useState(false);
  const [pendingSSRIndex, setPendingSSRIndex] = useState<number | null>(null);
  const [phase, setPhase] = useState<'backs' | 'revealing' | 'complete'>('backs');

  const isTenPull = cards.length === 10;
  const hasSSR = cards.some(c => c.rarity === 'SSR');

  // 找到第一个SSR的位置（如果有）
  const ssrIndex = cards.findIndex(c => c.rarity === 'SSR');

  const handleStartReveal = () => {
    setPhase('revealing');
    revealNext(0);
  };

  const revealNext = (index: number) => {
    if (index >= cards.length) {
      setPhase('complete');
      return;
    }

    // 如果是SSR，暂停并显示金色遮罩
    if (cards[index].rarity === 'SSR' && pendingSSRIndex !== index) {
      setPendingSSRIndex(index);
      setShowGoldenOverlay(true);
      return;
    }

    setRevealedCount(index + 1);
    
    // 延迟后继续下一张
    if (index < cards.length - 1) {
      setTimeout(() => revealNext(index + 1), isTenPull ? 200 : 500);
    } else {
      setTimeout(() => setPhase('complete'), 500);
    }
  };

  const handleSSRConfirm = () => {
    setShowGoldenOverlay(false);
    if (pendingSSRIndex !== null) {
      setRevealedCount(pendingSSRIndex + 1);
      if (pendingSSRIndex < cards.length - 1) {
        setTimeout(() => revealNext(pendingSSRIndex + 1), 500);
      } else {
        setTimeout(() => setPhase('complete'), 500);
      }
    }
  };

  // 单抽直接显示
  useEffect(() => {
    if (!isTenPull) {
      if (hasSSR) {
        setShowGoldenOverlay(true);
        setPendingSSRIndex(0);
      } else {
        setRevealedCount(1);
        setPhase('complete');
      }
    }
  }, []);

  return (
    <div className="relative bg-card rounded-lg border border-border p-6 min-h-[300px]">
      {/* 金色SSR遮罩 */}
      {showGoldenOverlay && (
        <div 
          className="absolute inset-0 z-20 flex items-center justify-center rounded-lg golden-overlay bg-rarity-ssr/20 backdrop-blur-sm cursor-pointer"
          onClick={handleSSRConfirm}
        >
          <div className="text-center">
            <div className="text-4xl mb-2">✨</div>
            <div className="text-xl font-bold text-rarity-ssr">SSR 降临！</div>
            <div className="text-sm text-muted-foreground mt-2">点击揭晓</div>
          </div>
        </div>
      )}

      {/* 十连：卡背阶段 */}
      {isTenPull && phase === 'backs' && (
        <div className="space-y-4">
          <div className="grid grid-cols-5 gap-2">
            {cards.map((_, i) => (
              <div 
                key={i}
                className="aspect-[3/4] rounded-lg card-back-pattern border-2 border-primary/30"
              />
            ))}
          </div>
          <div className="text-center">
            <button
              onClick={handleStartReveal}
              className="px-6 py-2 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              开始揭示
            </button>
          </div>
        </div>
      )}

      {/* 揭示中 / 完成后显示卡片 */}
      {(phase === 'revealing' || phase === 'complete' || !isTenPull) && (
        <div className={`grid ${isTenPull ? 'grid-cols-5' : 'grid-cols-1'} gap-2`}>
          {cards.map((card, i) => {
            const isRevealed = i < revealedCount;
            return (
              <div 
                key={i}
                className={`aspect-[3/4] rounded-lg border-2 overflow-hidden transition-all duration-300 ${
                  isRevealed 
                    ? `${getRarityClass(card.rarity)} border-transparent` 
                    : 'card-back-pattern border-primary/30'
                }`}
              >
                {isRevealed && (
                  <div className="h-full flex flex-col p-2 fade-slide-in">
                    <div className="text-xs font-bold opacity-80">{card.rarity}</div>
                    <div className={`font-bold ${isTenPull ? 'text-xs' : 'text-lg'} mt-1`}>
                      {card.title}
                    </div>
                    {!isTenPull && (
                      <>
                        <p className="text-xs opacity-80 mt-2 italic">「{card.flavor}」</p>
                        <p className="text-xs mt-2 flex-1">{card.prompt}</p>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 完成按钮 */}
      {phase === 'complete' && (
        <div className="mt-4 text-center">
          <button
            onClick={onComplete}
            className="px-6 py-2 rounded-full bg-secondary text-secondary-foreground font-medium hover:bg-secondary/80 transition-colors"
          >
            确认
          </button>
        </div>
      )}

      {/* 十连结果列表（完成后显示详情） */}
      {isTenPull && phase === 'complete' && (
        <div className="mt-4 space-y-2 max-h-40 overflow-y-auto">
          {cards.map((card, i) => (
            <div 
              key={i}
              className={`flex items-center gap-2 p-2 rounded text-xs ${getRarityClass(card.rarity)}`}
            >
              <span className="font-bold">{card.rarity}</span>
              <span>{card.title}</span>
              <span className="opacity-70 truncate flex-1">{card.flavor}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
