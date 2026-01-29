import { useState, useEffect } from 'react';
import { Header } from '@/components/gacha/Header';
import { DailyQuote } from '@/components/gacha/DailyQuote';
import { GachaControls } from '@/components/gacha/GachaControls';
import { CardDisplay } from '@/components/gacha/CardDisplay';
import { WritingSection } from '@/components/gacha/WritingSection';
import { LogPanel } from '@/components/gacha/LogPanel';
import { ExportImportModal } from '@/components/gacha/ExportImportModal';
import { RulesModal } from '@/components/gacha/RulesModal';
import { useGacha, Card, ExportData, checkAndResetDaily, loadState, loadHistory, loadCollection } from '@/lib/gacha';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const {
    state,
    history,
    collection,
    canDrawSingle,
    canDrawTen,
    canDrawFree,
    performSingleDraw,
    performTenDraw,
    performFreeDraw,
    claimSynopsisReward,
    claimWritingReward,
    toggleCardSelection,
    updateUsername,
    isWritingFocused,
    setIsWritingFocused,
    setState,
    setHistory,
    setCollection
  } = useGacha();

  const [drawResult, setDrawResult] = useState<Card[] | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // 检查跨天
  useEffect(() => {
    const checkDaily = () => {
      const current = loadState();
      const { crossed } = checkAndResetDaily(current);
      if (crossed) {
        toast({ title: '新的一天开始了！免费抽卡已刷新 ✨' });
        // 重新加载
        setState(loadState());
        setHistory(loadHistory());
        setCollection(loadCollection());
      }
    };

    // 每分钟检查一次
    const interval = setInterval(checkDaily, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleSingleDraw = () => {
    if (!canDrawSingle) {
      toast({ title: state.tickets > 0 ? '抽卡券不足' : '积分不足', variant: 'destructive' });
      return;
    }
    setIsDrawing(true);
    const result = performSingleDraw();
    if (result) {
      setDrawResult(result.cards);
      if (result.hasSSR) {
        toast({ title: '🎉 恭喜抽到 SSR！今日运势爆棚！' });
      }
    }
  };

  const handleTenDraw = () => {
    if (!canDrawTen) {
      toast({ title: state.tickets >= 10 ? '抽卡券不足' : '积分不足', variant: 'destructive' });
      return;
    }
    setIsDrawing(true);
    const result = performTenDraw();
    if (result) {
      setDrawResult(result.cards);
      if (result.hasSSR) {
        toast({ title: '🎉 十连出金！SSR 降临！' });
      }
    }
  };

  const handleFreeDraw = () => {
    if (!canDrawFree) {
      toast({ title: '今日免费抽卡已用', variant: 'destructive' });
      return;
    }
    setIsDrawing(true);
    const result = performFreeDraw();
    if (result) {
      setDrawResult(result.cards);
      if (result.hasSSR) {
        toast({ title: '🎉 免费出金！欧皇附体！' });
      }
    }
  };

  const handleDrawComplete = () => {
    setDrawResult(null);
    setIsDrawing(false);
  };

  const handleImport = (data: ExportData) => {
    setState(data.state);
    setHistory(data.history);
    setCollection(data.collection);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 顶栏 */}
      <Header 
        username={state.username}
        todaySSR={state.todaySSR}
        isWritingFocused={isWritingFocused}
        onUsernameChange={updateUsername}
      />

      {/* 今日签语 */}
      <DailyQuote />

      {/* 主内容区 */}
      <main className="max-w-2xl mx-auto p-4 space-y-4">
        {/* 工具栏 */}
        <div className="flex items-center justify-end gap-2">
          <ExportImportModal
            state={state}
            history={history}
            collection={collection}
            onImport={handleImport}
          />
          <RulesModal />
        </div>

        {/* 抽卡控制区 */}
        <GachaControls
          state={state}
          canDrawSingle={canDrawSingle}
          canDrawTen={canDrawTen}
          canDrawFree={canDrawFree}
          isDrawing={isDrawing}
          onSingleDraw={handleSingleDraw}
          onTenDraw={handleTenDraw}
          onFreeDraw={handleFreeDraw}
        />

        {/* 抽卡结果展示 */}
        {drawResult && (
          <CardDisplay 
            cards={drawResult} 
            onComplete={handleDrawComplete}
          />
        )}

        {/* 写作区 */}
        <WritingSection
          state={state}
          collection={collection}
          onToggleCard={toggleCardSelection}
          onSynopsisReward={claimSynopsisReward}
          onWritingReward={claimWritingReward}
          onFocusChange={setIsWritingFocused}
        />

        {/* 流水记录 */}
        <LogPanel
          pointsLog={history.points}
          gachaLog={history.gacha}
        />
      </main>

      {/* 页脚 */}
      <footer className="text-center py-6 text-xs text-muted-foreground border-t border-border mt-8">
        灵感抽卡机 · 剧情发牌器 · v1.0
      </footer>
    </div>
  );
};

export default Index;
