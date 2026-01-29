import { FC } from 'react';
import { Button } from '@/components/ui/button';
import { GachaState } from '@/lib/gacha/types';

interface GachaControlsProps {
  state: GachaState;
  canDrawSingle: boolean;
  canDrawTen: boolean;
  canDrawFree: boolean;
  isDrawing: boolean;
  onSingleDraw: () => void;
  onTenDraw: () => void;
  onFreeDraw: () => void;
}

export const GachaControls: FC<GachaControlsProps> = ({
  state,
  canDrawSingle,
  canDrawTen,
  canDrawFree,
  isDrawing,
  onSingleDraw,
  onTenDraw,
  onFreeDraw
}) => {
  return (
    <div className="bg-card rounded-lg border border-border p-4 space-y-4">
      {/* 资源显示 */}
      <div className="flex items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">积分</span>
          <span className="font-bold text-lg text-primary">{state.points}</span>
        </div>
        <div className="h-4 w-px bg-border" />
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">抽卡券</span>
          <span className="font-bold text-lg text-primary">{state.tickets}</span>
        </div>
        <div className="h-4 w-px bg-border" />
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">保底</span>
          <span className="font-bold text-lg text-rarity-ssr">{state.pitySSR}/120</span>
        </div>
      </div>

      {/* 抽卡按钮 */}
      <div className="flex items-center justify-center gap-3 flex-wrap">
        <Button
          onClick={onFreeDraw}
          disabled={!canDrawFree || isDrawing}
          variant={canDrawFree ? "default" : "outline"}
          className={canDrawFree ? "bg-rarity-ssr hover:bg-rarity-ssr/90 text-foreground" : ""}
        >
          {canDrawFree ? '免费一抽' : '免费已用'}
        </Button>
        
        <Button
          onClick={onSingleDraw}
          disabled={!canDrawSingle || isDrawing}
          variant="outline"
        >
          单抽 ({state.tickets > 0 ? '1券' : '10分'})
        </Button>
        
        <Button
          onClick={onTenDraw}
          disabled={!canDrawTen || isDrawing}
          variant="secondary"
        >
          十连 ({state.tickets >= 10 ? '10券' : '90分'})
        </Button>
      </div>

      {/* 概率说明 */}
      <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
        <span className="text-rarity-ssr font-medium">SSR 1%</span>
        <span className="text-rarity-sr">SR 5%</span>
        <span className="text-rarity-r">R 22%</span>
        <span className="text-rarity-n">N 72%</span>
      </div>
    </div>
  );
};
