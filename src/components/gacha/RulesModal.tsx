import { FC, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';

export const RulesModal: FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <HelpCircle className="w-4 h-4 mr-1" />
          规则说明
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>灵感抽卡机 · 规则说明</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4 text-sm">
          <section>
            <h4 className="font-bold text-foreground mb-2">🎴 抽卡系统</h4>
            <ul className="space-y-1 text-muted-foreground list-disc list-inside">
              <li>每日免费抽卡1次（跨天刷新）</li>
              <li>单抽：消耗1抽卡券 或 10积分（券优先）</li>
              <li>十连：消耗10抽卡券 或 90积分（券优先）</li>
            </ul>
          </section>

          <section>
            <h4 className="font-bold text-foreground mb-2">✨ 稀有度与概率</h4>
            <ul className="space-y-1 text-muted-foreground list-disc list-inside">
              <li><span className="text-rarity-ssr font-medium">SSR</span> - 1.0%（传说灵感）</li>
              <li><span className="text-rarity-sr">SR</span> - 5.0%（稀有灵感）</li>
              <li><span className="text-rarity-r">R</span> - 22.0%（优质灵感）</li>
              <li><span className="text-rarity-n">N</span> - 72.0%（常见灵感）</li>
            </ul>
          </section>

          <section>
            <h4 className="font-bold text-foreground mb-2">🔒 保底机制</h4>
            <ul className="space-y-1 text-muted-foreground list-disc list-inside">
              <li>120抽大保底：累计120抽必出SSR</li>
              <li>抽到SSR后保底计数器清零</li>
              <li>单抽/免费抽+1，十连+10</li>
            </ul>
          </section>

          <section>
            <h4 className="font-bold text-foreground mb-2">📝 写作闭环</h4>
            <ul className="space-y-1 text-muted-foreground list-disc list-inside">
              <li>选择1-3张主牌生成故事梗概</li>
              <li>保存/复制梗概：+15积分（每日最多2次）</li>
              <li>写作提交：≥300字 + 用时≥3分钟 = +20积分（每日1次）</li>
              <li>重复内容/灌水不给积分</li>
            </ul>
          </section>

          <section>
            <h4 className="font-bold text-foreground mb-2">📊 每日重置</h4>
            <ul className="space-y-1 text-muted-foreground list-disc list-inside">
              <li>免费抽卡次数</li>
              <li>今日SSR标记</li>
              <li>梗概生成次数</li>
              <li>写作提交次数</li>
              <li>今日签语</li>
            </ul>
          </section>

          <section>
            <h4 className="font-bold text-foreground mb-2">💾 数据存储</h4>
            <ul className="space-y-1 text-muted-foreground list-disc list-inside">
              <li>所有数据保存在浏览器本地（localStorage）</li>
              <li>建议定期导出备份以防数据丢失</li>
              <li>支持JSON完整备份/恢复</li>
              <li>支持CSV记录导出（仅查看）</li>
            </ul>
          </section>

          <div className="border-t border-border pt-4 text-xs text-muted-foreground">
            <p>灵感抽卡机 v1.0 · 剧情发牌器</p>
            <p>让抽卡为你的故事带来意外的灵感火花 ✨</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
