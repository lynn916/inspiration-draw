// 灵感抽卡机 - React Hooks

import { useState, useEffect, useCallback } from 'react';
import { GachaState, CollectionState, PointsLogEntry, GachaLogEntry, ExportData } from './types';
import {
  loadState,
  loadHistory,
  loadCollection,
  loadMeta,
  saveState,
  saveHistory,
  saveCollection,
  checkAndResetDaily
} from './storage';
import { drawSingle, drawTen, generateId, sortCardsByRarity } from './engine';
import { Card } from './types';

export const useGacha = () => {
  const [state, setState] = useState<GachaState>(loadState);
  const [history, setHistory] = useState(loadHistory);
  const [collection, setCollection] = useState<CollectionState>(loadCollection);
  const [isWritingFocused, setIsWritingFocused] = useState(false);

  // 初始化时检查跨天
  useEffect(() => {
    const { state: newState, crossed } = checkAndResetDaily(state);
    if (crossed) {
      setState(newState);
      saveState(newState);
    }
  }, []);

  // 保存状态
  useEffect(() => {
    saveState(state);
  }, [state]);

  useEffect(() => {
    saveHistory(history);
  }, [history]);

  useEffect(() => {
    saveCollection(collection);
  }, [collection]);

  // 添加卡到收藏
  const addToCollection = useCallback((cards: Card[]) => {
    setCollection(prev => {
      const newOwned = { ...prev.owned };
      cards.forEach(card => {
        newOwned[card.card_id] = (newOwned[card.card_id] || 0) + 1;
      });
      return { owned: newOwned };
    });
  }, []);

  // 添加日志
  const addLogs = useCallback((pointsLog: PointsLogEntry, gachaLog: GachaLogEntry) => {
    setHistory(prev => ({
      points: [pointsLog, ...prev.points],
      gacha: [gachaLog, ...prev.gacha]
    }));
  }, []);

  // 能否抽卡
  const canDrawSingle = state.tickets > 0 || state.points >= 10;
  const canDrawTen = state.tickets >= 10 || state.points >= 90;
  const canDrawFree = state.freeDrawToday;

  // 执行单抽
  const performSingleDraw = useCallback(() => {
    if (!canDrawSingle) return null;
    
    const result = drawSingle(state, collection, 'single');
    if (!result) return null;

    const newState = {
      ...state,
      points: state.tickets > 0 ? state.points : state.points - 10,
      tickets: state.tickets > 0 ? state.tickets - 1 : state.tickets,
      pitySSR: result.cards[0].rarity === 'SSR' ? 0 : state.pitySSR + 1,
      todaySSR: state.todaySSR || result.hasSSR
    };

    setState(newState);
    addToCollection(result.cards);
    addLogs(result.pointsLog, result.gachaLog);

    return result;
  }, [state, collection, canDrawSingle, addToCollection, addLogs]);

  // 执行免费抽
  const performFreeDraw = useCallback(() => {
    if (!canDrawFree) return null;

    const result = drawSingle(state, collection, 'free');
    if (!result) return null;

    const newState = {
      ...state,
      freeDrawToday: false,
      pitySSR: result.cards[0].rarity === 'SSR' ? 0 : state.pitySSR + 1,
      todaySSR: state.todaySSR || result.hasSSR
    };

    setState(newState);
    addToCollection(result.cards);
    addLogs(result.pointsLog, result.gachaLog);

    return result;
  }, [state, collection, canDrawFree, addToCollection, addLogs]);

  // 执行十连
  const performTenDraw = useCallback(() => {
    if (!canDrawTen) return null;

    const result = drawTen(state, collection);
    if (!result) return null;

    // 计算最终 pity
    let finalPity = state.pitySSR;
    result.cards.forEach(card => {
      if (card.rarity === 'SSR') {
        finalPity = 0;
      } else {
        finalPity++;
      }
    });

    const newState = {
      ...state,
      points: state.tickets >= 10 ? state.points : state.points - 90,
      tickets: state.tickets >= 10 ? state.tickets - 10 : state.tickets,
      pitySSR: finalPity,
      todaySSR: state.todaySSR || result.hasSSR
    };

    setState(newState);
    addToCollection(result.cards);
    addLogs(result.pointsLog, result.gachaLog);

    return {
      ...result,
      cards: sortCardsByRarity(result.cards)
    };
  }, [state, collection, canDrawTen, addToCollection, addLogs]);

  // 添加积分（写作奖励）
  const addPoints = useCallback((amount: number, action: string, note: string) => {
    const log: PointsLogEntry = {
      id: generateId(),
      timestamp: new Date().toISOString(),
      action,
      points_delta: amount,
      tickets_delta: 0,
      pity_before: state.pitySSR,
      pity_after: state.pitySSR,
      note,
      related_gacha_id: null
    };

    setState(prev => ({
      ...prev,
      points: prev.points + amount
    }));

    setHistory(prev => ({
      ...prev,
      points: [log, ...prev.points]
    }));
  }, [state.pitySSR]);

  // 生成梗概奖励
  const claimSynopsisReward = useCallback(() => {
    if (state.synopsisCountToday >= 2) return false;

    addPoints(15, '生成梗概', '梗概生成奖励');
    setState(prev => ({
      ...prev,
      synopsisCountToday: prev.synopsisCountToday + 1
    }));

    return true;
  }, [state.synopsisCountToday, addPoints]);

  // 写作提交奖励
  const claimWritingReward = useCallback(() => {
    if (state.writingSubmitToday) return false;

    addPoints(20, '写作提交', '每日写作奖励');
    setState(prev => ({
      ...prev,
      writingSubmitToday: true
    }));

    return true;
  }, [state.writingSubmitToday, addPoints]);

  // 选择/取消选择卡
  const toggleCardSelection = useCallback((cardId: string) => {
    setState(prev => {
      const selected = prev.selectedCards.includes(cardId);
      if (selected) {
        return {
          ...prev,
          selectedCards: prev.selectedCards.filter(id => id !== cardId)
        };
      } else if (prev.selectedCards.length < 3) {
        return {
          ...prev,
          selectedCards: [...prev.selectedCards, cardId]
        };
      }
      return prev;
    });
  }, []);

  // 更新用户名
  const updateUsername = useCallback((name: string) => {
    setState(prev => ({ ...prev, username: name.trim() || '旅人' }));
  }, []);

  return {
    state,
    history,
    collection,
    canDrawSingle,
    canDrawTen,
    canDrawFree,
    performSingleDraw,
    performTenDraw,
    performFreeDraw,
    addPoints,
    claimSynopsisReward,
    claimWritingReward,
    toggleCardSelection,
    updateUsername,
    isWritingFocused,
    setIsWritingFocused,
    setState,
    setHistory,
    setCollection
  };
};
