import { FC, useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { GachaState, CollectionState, PointsLogEntry, GachaLogEntry, ExportData, MetaState } from '@/lib/gacha/types';
import { exportAllData, importAllData, exportPointsCSV, exportGachaCSV, loadMeta, saveMeta } from '@/lib/gacha/storage';
import { toast } from '@/hooks/use-toast';
import { Download, Upload } from 'lucide-react';

interface ExportImportModalProps {
  state: GachaState;
  history: { points: PointsLogEntry[]; gacha: GachaLogEntry[] };
  collection: CollectionState;
  onImport: (data: ExportData) => void;
}

export const ExportImportModal: FC<ExportImportModalProps> = ({
  state,
  history,
  collection,
  onImport
}) => {
  const [open, setOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJSON = () => {
    const data = exportAllData();
    downloadFile(JSON.stringify(data, null, 2), `灵感抽卡机_备份_${new Date().toISOString().split('T')[0]}.json`, 'application/json');
    toast({ title: '备份导出完成' });
  };

  const handleExportPointsCSV = () => {
    const csv = exportPointsCSV();
    downloadFile(csv, `积分记录_${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
    toast({ title: '积分记录导出完成' });
  };

  const handleExportGachaCSV = () => {
    const csv = exportGachaCSV();
    downloadFile(csv, `抽卡记录_${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
    toast({ title: '抽卡记录导出完成' });
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text) as ExportData;

      // 验证数据结构
      if (!data.state || !data.history || !data.collection || !data.meta) {
        throw new Error('无效的备份文件格式');
      }

      const success = importAllData(data);
      if (success) {
        onImport(data);
        toast({ title: '导入成功！数据已恢复' });
        setOpen(false);
      } else {
        toast({ title: '导入失败', variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: '导入失败：文件格式错误', variant: 'destructive' });
    }

    // 清空input以便重复选择同一文件
    e.target.value = '';
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-1" />
          导出/导入
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>数据管理</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* 导出区 */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-foreground">导出备份</h4>
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" size="sm" onClick={handleExportJSON}>
                完整备份 (JSON)
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportPointsCSV}>
                积分记录 (CSV)
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportGachaCSV}>
                抽卡记录 (CSV)
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              完整备份包含所有数据，可用于恢复；CSV仅用于查看记录。
            </p>
          </div>

          <div className="border-t border-border" />

          {/* 导入区 */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-foreground">导入备份</h4>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
            <Button variant="default" size="sm" onClick={handleImportClick}>
              <Upload className="w-4 h-4 mr-1" />
              选择JSON备份文件
            </Button>
            <p className="text-xs text-muted-foreground">
              导入将覆盖当前所有数据，请先导出备份。
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
