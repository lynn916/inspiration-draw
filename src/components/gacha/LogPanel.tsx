import { FC, useState } from 'react';
import { PointsLogEntry, GachaLogEntry } from '@/lib/gacha/types';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface LogPanelProps {
  pointsLog: PointsLogEntry[];
  gachaLog: GachaLogEntry[];
}

export const LogPanel: FC<LogPanelProps> = ({ pointsLog, gachaLog }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'points' | 'gacha'>('points');

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('zh-CN', { 
      month: '2-digit', 
      day: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      {/* 折叠头 */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-secondary/50 transition-colors"
      >
        <span className="font-medium text-foreground">流水记录</span>
        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {/* 展开内容 */}
      {isExpanded && (
        <div className="border-t border-border">
          {/* Tab 切换 */}
          <div className="flex border-b border-border">
            <button
              onClick={() => setActiveTab('points')}
              className={`flex-1 py-2 text-sm font-medium transition-colors ${
                activeTab === 'points' 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              积分记录 ({pointsLog.length})
            </button>
            <button
              onClick={() => setActiveTab('gacha')}
              className={`flex-1 py-2 text-sm font-medium transition-colors ${
                activeTab === 'gacha' 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              抽卡记录 ({gachaLog.length})
            </button>
          </div>

          {/* 记录列表 */}
          <div className="max-h-60 overflow-y-auto">
            {activeTab === 'points' ? (
              pointsLog.length === 0 ? (
                <p className="p-4 text-center text-muted-foreground text-sm">暂无记录</p>
              ) : (
                <table className="w-full text-xs">
                  <thead className="bg-secondary/50 sticky top-0">
                    <tr>
                      <th className="px-2 py-1.5 text-left">时间</th>
                      <th className="px-2 py-1.5 text-left">操作</th>
                      <th className="px-2 py-1.5 text-right">积分</th>
                      <th className="px-2 py-1.5 text-right">券</th>
                      <th className="px-2 py-1.5 text-left">备注</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pointsLog.slice(0, 50).map((log, i) => (
                      <tr key={log.id} className={i % 2 === 0 ? 'bg-background' : 'bg-secondary/30'}>
                        <td className="px-2 py-1.5 text-muted-foreground">{formatTime(log.timestamp)}</td>
                        <td className="px-2 py-1.5">{log.action}</td>
                        <td className={`px-2 py-1.5 text-right ${log.points_delta >= 0 ? 'text-green-600' : 'text-destructive'}`}>
                          {log.points_delta >= 0 ? '+' : ''}{log.points_delta}
                        </td>
                        <td className={`px-2 py-1.5 text-right ${log.tickets_delta >= 0 ? 'text-green-600' : 'text-destructive'}`}>
                          {log.tickets_delta !== 0 && (log.tickets_delta >= 0 ? '+' : '')}{log.tickets_delta || '-'}
                        </td>
                        <td className="px-2 py-1.5 text-muted-foreground truncate max-w-[120px]">{log.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
            ) : (
              gachaLog.length === 0 ? (
                <p className="p-4 text-center text-muted-foreground text-sm">暂无记录</p>
              ) : (
                <table className="w-full text-xs">
                  <thead className="bg-secondary/50 sticky top-0">
                    <tr>
                      <th className="px-2 py-1.5 text-left">时间</th>
                      <th className="px-2 py-1.5 text-left">类型</th>
                      <th className="px-2 py-1.5 text-left">消耗</th>
                      <th className="px-2 py-1.5 text-left">结果</th>
                      <th className="px-2 py-1.5 text-right">保底</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gachaLog.slice(0, 50).map((log, i) => (
                      <tr key={log.gacha_id} className={i % 2 === 0 ? 'bg-background' : 'bg-secondary/30'}>
                        <td className="px-2 py-1.5 text-muted-foreground">{formatTime(log.timestamp)}</td>
                        <td className="px-2 py-1.5">
                          {log.mode === 'single' ? '单抽' : log.mode === 'ten' ? '十连' : '免费'}
                        </td>
                        <td className="px-2 py-1.5">
                          {log.cost_type === 'free' ? '免费' : `${log.cost_amount}${log.cost_type === 'points' ? '分' : '券'}`}
                        </td>
                        <td className="px-2 py-1.5">
                          <span className={log.has_ssr ? 'text-rarity-ssr font-bold' : ''}>
                            {log.result_rarities.split('|').join(' ')}
                          </span>
                          {log.pity_triggered && <span className="ml-1 text-rarity-ssr">(保底)</span>}
                        </td>
                        <td className="px-2 py-1.5 text-right text-muted-foreground">
                          {log.pity_before}→{log.pity_after}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};
