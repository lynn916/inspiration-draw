// 灵感抽卡机 - localStorage 管理

import { GachaState, PointsLogEntry, GachaLogEntry, CollectionState, MetaState, ExportData } from './types';

const STORAGE_KEYS = {
  state: 'ni_state_v1',
  history: 'ni_history_v1',
  collection: 'ni_collection_v1',
  meta: 'ni_meta_v1'
};

const getToday = (): string => {
  return new Date().toISOString().split('T')[0];
};

// 初始状态
const getDefaultState = (): GachaState => ({
  username: '旅人',
  points: 100,
  tickets: 5,
  pitySSR: 0,
  freeDrawToday: true,
  todaySSR: false,
  lastActiveDate: getToday(),
  synopsisCountToday: 0,
  writingSubmitToday: false,
  selectedCards: []
});

const getDefaultHistory = (): { points: PointsLogEntry[]; gacha: GachaLogEntry[] } => ({
  points: [],
  gacha: []
});

const getDefaultCollection = (): CollectionState => ({
  owned: {}
});

const getDefaultMeta = (): MetaState => ({
  version: '1.0.0',
  createdAt: new Date().toISOString(),
  lastExport: null
});

// 加载数据
export const loadState = (): GachaState => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.state);
    if (data) {
      const state = JSON.parse(data) as GachaState;
      // 检查是否跨天
      if (state.lastActiveDate !== getToday()) {
        return {
          ...state,
          freeDrawToday: true,
          todaySSR: false,
          lastActiveDate: getToday(),
          synopsisCountToday: 0,
          writingSubmitToday: false
        };
      }
      return state;
    }
  } catch (e) {
    console.error('Failed to load state:', e);
  }
  return getDefaultState();
};

export const loadHistory = (): { points: PointsLogEntry[]; gacha: GachaLogEntry[] } => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.history);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load history:', e);
  }
  return getDefaultHistory();
};

export const loadCollection = (): CollectionState => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.collection);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load collection:', e);
  }
  return getDefaultCollection();
};

export const loadMeta = (): MetaState => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.meta);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load meta:', e);
  }
  return getDefaultMeta();
};

// 保存数据
export const saveState = (state: GachaState): void => {
  localStorage.setItem(STORAGE_KEYS.state, JSON.stringify(state));
};

export const saveHistory = (history: { points: PointsLogEntry[]; gacha: GachaLogEntry[] }): void => {
  localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(history));
};

export const saveCollection = (collection: CollectionState): void => {
  localStorage.setItem(STORAGE_KEYS.collection, JSON.stringify(collection));
};

export const saveMeta = (meta: MetaState): void => {
  localStorage.setItem(STORAGE_KEYS.meta, JSON.stringify(meta));
};

// 导出全部数据
export const exportAllData = (): ExportData => {
  const meta = loadMeta();
  meta.lastExport = new Date().toISOString();
  saveMeta(meta);
  
  return {
    state: loadState(),
    history: loadHistory(),
    collection: loadCollection(),
    meta
  };
};

// 导入数据（覆盖）
export const importAllData = (data: ExportData): boolean => {
  try {
    saveState(data.state);
    saveHistory(data.history);
    saveCollection(data.collection);
    saveMeta({
      ...data.meta,
      createdAt: data.meta.createdAt
    });
    return true;
  } catch (e) {
    console.error('Failed to import data:', e);
    return false;
  }
};

// 导出CSV
export const exportPointsCSV = (): string => {
  const history = loadHistory();
  const headers = ['id', 'timestamp', 'action', 'points_delta', 'tickets_delta', 'pity_before', 'pity_after', 'note', 'related_gacha_id'];
  const rows = history.points.map(p => [
    p.id,
    p.timestamp,
    p.action,
    p.points_delta,
    p.tickets_delta,
    p.pity_before,
    p.pity_after,
    `"${p.note.replace(/"/g, '""')}"`,
    p.related_gacha_id || ''
  ].join(','));
  
  return [headers.join(','), ...rows].join('\n');
};

export const exportGachaCSV = (): string => {
  const history = loadHistory();
  const headers = ['gacha_id', 'timestamp', 'mode', 'cost_type', 'cost_amount', 'result_card_ids', 'result_rarities', 'has_ssr', 'pity_triggered', 'pity_before', 'pity_after'];
  const rows = history.gacha.map(g => [
    g.gacha_id,
    g.timestamp,
    g.mode,
    g.cost_type,
    g.cost_amount,
    `"${g.result_card_ids}"`,
    `"${g.result_rarities}"`,
    g.has_ssr,
    g.pity_triggered,
    g.pity_before,
    g.pity_after
  ].join(','));
  
  return [headers.join(','), ...rows].join('\n');
};

// 检查跨天并重置
export const checkAndResetDaily = (currentState: GachaState): { state: GachaState; crossed: boolean } => {
  const today = getToday();
  if (currentState.lastActiveDate !== today) {
    return {
      state: {
        ...currentState,
        freeDrawToday: true,
        todaySSR: false,
        lastActiveDate: today,
        synopsisCountToday: 0,
        writingSubmitToday: false
      },
      crossed: true
    };
  }
  return { state: currentState, crossed: false };
};
