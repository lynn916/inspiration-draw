// 灵感抽卡机 - 类型定义

export type Rarity = 'SSR' | 'SR' | 'R' | 'N';

export interface Card {
  card_id: string;
  pool: string;
  rarity: Rarity;
  title: string;
  flavor: string;
  prompt: string;
}

export interface GachaState {
  username: string;
  points: number;
  tickets: number;
  pitySSR: number; // 0-120
  freeDrawToday: boolean;
  todaySSR: boolean;
  lastActiveDate: string; // YYYY-MM-DD
  synopsisCountToday: number; // 每日生成梗概次数 max 2
  writingSubmitToday: boolean; // 今日是否已提交写作
  selectedCards: string[]; // 选中的主牌 card_ids
}

export interface PointsLogEntry {
  id: string;
  timestamp: string;
  action: string;
  points_delta: number;
  tickets_delta: number;
  pity_before: number;
  pity_after: number;
  note: string;
  related_gacha_id: string | null;
}

export interface GachaLogEntry {
  gacha_id: string;
  timestamp: string;
  mode: 'single' | 'ten' | 'free';
  cost_type: 'points' | 'tickets' | 'free';
  cost_amount: number;
  result_card_ids: string; // "|" 分隔
  result_rarities: string; // "|" 分隔
  has_ssr: boolean;
  pity_triggered: boolean;
  pity_before: number;
  pity_after: number;
}

export interface CollectionState {
  owned: Record<string, number>; // card_id -> count
}

export interface MetaState {
  version: string;
  createdAt: string;
  lastExport: string | null;
}

export interface DrawResult {
  cards: Card[];
  hasSSR: boolean;
  pityTriggered: boolean;
  gachaLog: GachaLogEntry;
  pointsLog: PointsLogEntry;
}

export interface ExportData {
  state: GachaState;
  history: {
    points: PointsLogEntry[];
    gacha: GachaLogEntry[];
  };
  collection: CollectionState;
  meta: MetaState;
}
