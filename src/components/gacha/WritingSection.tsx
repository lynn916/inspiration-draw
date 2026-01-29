import { FC, useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, GachaState, CollectionState } from '@/lib/gacha/types';
import { getCardById } from '@/lib/gacha/cardPool';
import { validateWriting } from '@/lib/gacha/engine';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';

interface WritingSectionProps {
  state: GachaState;
  collection: CollectionState;
  onToggleCard: (cardId: string) => void;
  onSynopsisReward: () => boolean;
  onWritingReward: () => boolean;
  onFocusChange: (focused: boolean) => void;
}

export const WritingSection: FC<WritingSectionProps> = ({
  state,
  collection,
  onToggleCard,
  onSynopsisReward,
  onWritingReward,
  onFocusChange
}) => {
  const [synopsis, setSynopsis] = useState('');
  const [writing, setWriting] = useState('');
  const [writingStartTime, setWritingStartTime] = useState<number | null>(null);
  const [elapsedMinutes, setElapsedMinutes] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const ownedCardIds = Object.keys(collection.owned);
  const selectedCards = state.selectedCards.map(id => getCardById(id)).filter(Boolean) as Card[];

  // 计时器
  useEffect(() => {
    if (writingStartTime) {
      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - writingStartTime) / 60000);
        setElapsedMinutes(elapsed);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [writingStartTime]);

  const handleWritingFocus = () => {
    onFocusChange(true);
    if (!writingStartTime) {
      setWritingStartTime(Date.now());
    }
  };

  const handleWritingBlur = () => {
    onFocusChange(false);
  };

  // 生成梗概
  const generateSynopsis = () => {
    if (selectedCards.length === 0) {
      toast({ title: '请先选择主牌', variant: 'destructive' });
      return;
    }

    const prompts = selectedCards.map(c => c.prompt).join('；');
    const generated = `基于【${selectedCards.map(c => c.title).join('、')}】构思：\n${prompts}\n\n请在此基础上发挥你的创意...`;
    setSynopsis(generated);
    toast({ title: '梗概已生成' });
  };

  // 保存/复制梗概
  const saveSynopsis = () => {
    if (!synopsis) {
      toast({ title: '请先生成梗概', variant: 'destructive' });
      return;
    }
    
    navigator.clipboard.writeText(synopsis);
    
    if (state.synopsisCountToday < 2) {
      const success = onSynopsisReward();
      if (success) {
        toast({ title: '梗概已复制，+15积分！' });
      } else {
        toast({ title: '梗概已复制（今日奖励已达上限）' });
      }
    } else {
      toast({ title: '梗概已复制（今日奖励已达上限）' });
    }
  };

  // 提交写作
  const submitWriting = () => {
    const validation = validateWriting(writing);
    
    if (!validation.valid) {
      toast({ title: `提交无效：${validation.reason}`, variant: 'destructive' });
      return;
    }

    if (elapsedMinutes < 3) {
      toast({ title: '提交无效：写作时间不足3分钟', variant: 'destructive' });
      return;
    }

    if (state.writingSubmitToday) {
      toast({ title: '今日写作奖励已领取' });
      return;
    }

    const success = onWritingReward();
    if (success) {
      toast({ title: '写作提交成功，+20积分！' });
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4 space-y-4">
      <h3 className="font-bold text-foreground">写作工坊</h3>

      {/* 选择主牌 */}
      <div className="space-y-2">
        <div className="text-sm text-muted-foreground">
          选择主牌（最多3张）：已选 {state.selectedCards.length}/3
        </div>
        
        {ownedCardIds.length === 0 ? (
          <p className="text-xs text-muted-foreground italic">暂无卡牌，快去抽卡吧~</p>
        ) : (
          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
            {ownedCardIds.map(cardId => {
              const card = getCardById(cardId);
              if (!card) return null;
              const isSelected = state.selectedCards.includes(cardId);
              const rarityClass = {
                SSR: 'text-rarity-ssr border-rarity-ssr',
                SR: 'text-rarity-sr border-rarity-sr',
                R: 'text-rarity-r border-rarity-r',
                N: 'text-rarity-n border-rarity-n'
              }[card.rarity];

              return (
                <label 
                  key={cardId}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded border cursor-pointer text-xs transition-colors ${
                    isSelected ? `${rarityClass} bg-secondary` : 'border-border hover:border-primary/50'
                  }`}
                >
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => onToggleCard(cardId)}
                    disabled={!isSelected && state.selectedCards.length >= 3}
                    className="w-3 h-3"
                  />
                  <span className={rarityClass}>{card.rarity}</span>
                  <span>{card.title}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* 梗概区 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">梗概生成（今日 {state.synopsisCountToday}/2）</span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={generateSynopsis}>
              生成梗概
            </Button>
            <Button size="sm" variant="secondary" onClick={saveSynopsis} disabled={!synopsis}>
              复制并领分
            </Button>
          </div>
        </div>
        <Textarea
          value={synopsis}
          onChange={(e) => setSynopsis(e.target.value)}
          placeholder='选择主牌后点击"生成梗概"...'
          className="min-h-[80px] text-sm resize-none"
        />
      </div>

      {/* 写作区 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            写作提交（{writing.length}字 | {elapsedMinutes}分钟）
            {state.writingSubmitToday && <span className="ml-2 text-xs text-rarity-ssr">今日已领</span>}
          </span>
          <Button 
            size="sm" 
            onClick={submitWriting}
            disabled={state.writingSubmitToday || writing.length < 300}
          >
            提交 (+20分)
          </Button>
        </div>
        <Textarea
          value={writing}
          onChange={(e) => setWriting(e.target.value)}
          onFocus={handleWritingFocus}
          onBlur={handleWritingBlur}
          placeholder="在此写作，≥300字且用时≥3分钟可获得20积分..."
          className="min-h-[120px] text-sm resize-none"
        />
        <p className="text-xs text-muted-foreground">
          提示：需≥300字、用时≥3分钟、非重复内容，每日限1次
        </p>
      </div>
    </div>
  );
};
