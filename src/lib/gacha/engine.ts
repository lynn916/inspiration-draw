// 灵感抽卡机 - 抽卡引擎

import { Card, Rarity, DrawResult, GachaLogEntry, PointsLogEntry, GachaState, CollectionState } from './types';
import { cardPool, getCardsByRarity } from './cardPool';

// 概率配置
const RATES: Record<Rarity, number> = {
  SSR: 0.01,  // 1.0%
  SR: 0.05,   // 5.0%
  R: 0.22,    // 22.0%
  N: 0.72     // 72.0%
};

const PITY_MAX = 120;

// 生成唯一ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
};

// 按概率抽取稀有度
const rollRarity = (pity: number): { rarity: Rarity; pityTriggered: boolean } => {
  // 保底检查
  if (pity >= PITY_MAX - 1) {
    return { rarity: 'SSR', pityTriggered: true };
  }
  
  const rand = Math.random();
  let cumulative = 0;
  
  for (const [rarity, rate] of Object.entries(RATES) as [Rarity, number][]) {
    cumulative += rate;
    if (rand < cumulative) {
      return { rarity, pityTriggered: false };
    }
  }
  
  return { rarity: 'N', pityTriggered: false };
};

// 从指定稀有度随机抽一张卡
const rollCard = (rarity: Rarity): Card => {
  const pool = getCardsByRarity(rarity);
  const index = Math.floor(Math.random() * pool.length);
  return pool[index];
};

// 单抽
export const drawSingle = (
  state: GachaState,
  collection: CollectionState,
  mode: 'single' | 'free'
): DrawResult | null => {
  const { rarity, pityTriggered } = rollRarity(state.pitySSR);
  const card = rollCard(rarity);
  const hasSSR = rarity === 'SSR';
  
  const pityBefore = state.pitySSR;
  const pityAfter = hasSSR ? 0 : pityBefore + 1;
  
  const gachaId = generateId();
  
  const gachaLog: GachaLogEntry = {
    gacha_id: gachaId,
    timestamp: new Date().toISOString(),
    mode,
    cost_type: mode === 'free' ? 'free' : (state.tickets > 0 ? 'tickets' : 'points'),
    cost_amount: mode === 'free' ? 0 : (state.tickets > 0 ? 1 : 10),
    result_card_ids: card.card_id,
    result_rarities: rarity,
    has_ssr: hasSSR,
    pity_triggered: pityTriggered,
    pity_before: pityBefore,
    pity_after: pityAfter
  };
  
  const pointsLog: PointsLogEntry = {
    id: generateId(),
    timestamp: new Date().toISOString(),
    action: mode === 'free' ? '免费抽卡' : '单抽',
    points_delta: mode === 'free' ? 0 : (state.tickets > 0 ? 0 : -10),
    tickets_delta: mode === 'free' ? 0 : (state.tickets > 0 ? -1 : 0),
    pity_before: pityBefore,
    pity_after: pityAfter,
    note: `抽到 ${rarity} - ${card.title}${pityTriggered ? ' (保底)' : ''}`,
    related_gacha_id: gachaId
  };
  
  return {
    cards: [card],
    hasSSR,
    pityTriggered,
    gachaLog,
    pointsLog
  };
};

// 十连
export const drawTen = (
  state: GachaState,
  collection: CollectionState
): DrawResult | null => {
  const cards: Card[] = [];
  let hasSSR = false;
  let pityTriggered = false;
  let currentPity = state.pitySSR;
  const pityBefore = state.pitySSR;
  
  for (let i = 0; i < 10; i++) {
    const { rarity, pityTriggered: pt } = rollRarity(currentPity);
    const card = rollCard(rarity);
    cards.push(card);
    
    if (rarity === 'SSR') {
      hasSSR = true;
      if (pt) pityTriggered = true;
      currentPity = 0;
    } else {
      currentPity++;
    }
  }
  
  const pityAfter = currentPity;
  const gachaId = generateId();
  
  const gachaLog: GachaLogEntry = {
    gacha_id: gachaId,
    timestamp: new Date().toISOString(),
    mode: 'ten',
    cost_type: state.tickets >= 10 ? 'tickets' : 'points',
    cost_amount: state.tickets >= 10 ? 10 : 90,
    result_card_ids: cards.map(c => c.card_id).join('|'),
    result_rarities: cards.map(c => c.rarity).join('|'),
    has_ssr: hasSSR,
    pity_triggered: pityTriggered,
    pity_before: pityBefore,
    pity_after: pityAfter
  };
  
  const rarityCount = cards.reduce((acc, c) => {
    acc[c.rarity] = (acc[c.rarity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const raritySummary = Object.entries(rarityCount)
    .map(([r, n]) => `${r}×${n}`)
    .join(' ');
  
  const pointsLog: PointsLogEntry = {
    id: generateId(),
    timestamp: new Date().toISOString(),
    action: '十连抽',
    points_delta: state.tickets >= 10 ? 0 : -90,
    tickets_delta: state.tickets >= 10 ? -10 : 0,
    pity_before: pityBefore,
    pity_after: pityAfter,
    note: `结果: ${raritySummary}${pityTriggered ? ' (含保底)' : ''}`,
    related_gacha_id: gachaId
  };
  
  return {
    cards,
    hasSSR,
    pityTriggered,
    gachaLog,
    pointsLog
  };
};

// 按稀有度排序（高到低）
export const sortCardsByRarity = (cards: Card[]): Card[] => {
  const order: Record<Rarity, number> = { SSR: 0, SR: 1, R: 2, N: 3 };
  return [...cards].sort((a, b) => order[a.rarity] - order[b.rarity]);
};

// 生成每日签语
export const generateDailyQuote = (): string => {
  const quotes = [
    '今日灵感如泉涌，落笔成章不需愁。',
    '笔下乾坤自在心，一字一句皆风景。',
    '故事在等你，别让它久候。',
    '每一张卡都是命运的低语。',
    '抽到什么不重要，写出什么才重要。',
    '今天的灵感，明天的经典。',
    '让文字带你去从未去过的地方。',
    '好的故事，从一个念头开始。',
    '把想象变成文字，是最美的魔法。',
    '今日宜：落笔生花，文思泉涌。',
    '灵感是礼物，写作是修行。',
    '每个角色都在等待被你唤醒。',
    '故事的种子已经播下，静待花开。',
    '今天的你，会写出怎样的传奇？',
    '让心流淌，让笔飞舞。'
  ];
  
  // 用日期作为种子
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const index = seed % quotes.length;
  
  return quotes[index];
};

// 检查写作内容是否有效（非重复/灌水）
export const validateWriting = (content: string): { valid: boolean; reason?: string } => {
  if (content.length < 300) {
    return { valid: false, reason: '字数不足300字' };
  }
  
  // 检查重复字符
  const charCount: Record<string, number> = {};
  for (const char of content) {
    charCount[char] = (charCount[char] || 0) + 1;
  }
  
  const maxRepeat = Math.max(...Object.values(charCount));
  if (maxRepeat > content.length * 0.3) {
    return { valid: false, reason: '检测到重复内容' };
  }
  
  // 检查连续重复
  const repeatedPattern = /(.)\1{9,}/;
  if (repeatedPattern.test(content)) {
    return { valid: false, reason: '检测到连续重复字符' };
  }
  
  return { valid: true };
};
