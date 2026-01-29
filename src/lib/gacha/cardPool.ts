// 灵感抽卡机 - 卡池数据

import { Card } from './types';

export const cardPool: Card[] = [
  // SSR 卡 (共3张)
  {
    card_id: 'ssr_001',
    pool: 'core',
    rarity: 'SSR',
    title: '命运交汇',
    flavor: '两条本不相交的命运线，在此刻缠绕成结',
    prompt: '主角在最意想不到的时刻，遇见了改变一生的人/事物'
  },
  {
    card_id: 'ssr_002',
    pool: 'core',
    rarity: 'SSR',
    title: '真相碎片',
    flavor: '每一片都是谎言，拼在一起却成了真相',
    prompt: '故事中的一个关键信息被分散隐藏，收集齐全后揭示惊人真相'
  },
  {
    card_id: 'ssr_003',
    pool: 'core',
    rarity: 'SSR',
    title: '时间悖论',
    flavor: '改变过去的代价，是失去未来的自己',
    prompt: '涉及时间循环或时间旅行，主角面临无法两全的抉择'
  },

  // SR 卡 (共5张)
  {
    card_id: 'sr_001',
    pool: 'core',
    rarity: 'SR',
    title: '双面镜',
    flavor: '镜中人笑了，镜外人却没有',
    prompt: '角色有不为人知的另一面，在关键时刻显露'
  },
  {
    card_id: 'sr_002',
    pool: 'core',
    rarity: 'SR',
    title: '旧物重逢',
    flavor: '物品还是那个物品，人却已不是那个人',
    prompt: '一件来自过去的物品重新出现，触发回忆或转折'
  },
  {
    card_id: 'sr_003',
    pool: 'core',
    rarity: 'SR',
    title: '暗夜独白',
    flavor: '只有月亮听到的秘密，最为沉重',
    prompt: '角色在深夜独自面对内心，进行重要的自我对话'
  },
  {
    card_id: 'sr_004',
    pool: 'core',
    rarity: 'SR',
    title: '错位重逢',
    flavor: '我们都变了，却假装一切如常',
    prompt: '曾经亲密的人多年后重逢，发现彼此已截然不同'
  },
  {
    card_id: 'sr_005',
    pool: 'core',
    rarity: 'SR',
    title: '雨中承诺',
    flavor: '被雨水打湿的誓言，反而更加清晰',
    prompt: '在雨中场景下，角色做出重要承诺或决定'
  },

  // R 卡 (共8张)
  {
    card_id: 'r_001',
    pool: 'core',
    rarity: 'R',
    title: '信件',
    flavor: '迟到的信，永远等不到回复',
    prompt: '一封信（或消息）在故事中起到关键作用'
  },
  {
    card_id: 'r_002',
    pool: 'core',
    rarity: 'R',
    title: '第三者视角',
    flavor: '旁观者看得最清楚',
    prompt: '通过配角的视角展示主线剧情'
  },
  {
    card_id: 'r_003',
    pool: 'core',
    rarity: 'R',
    title: '误会',
    flavor: '最伤人的往往是未说出口的解释',
    prompt: '角色间产生误会，推动剧情发展'
  },
  {
    card_id: 'r_004',
    pool: 'core',
    rarity: 'R',
    title: '追逐戏',
    flavor: '逃跑的人心里也有想被追上的部分',
    prompt: '安排一段追逐场景（物理或心理层面）'
  },
  {
    card_id: 'r_005',
    pool: 'core',
    rarity: 'R',
    title: '窗边',
    flavor: '窗内是安全，窗外是自由',
    prompt: '以窗户为意象，表现角色的内心状态'
  },
  {
    card_id: 'r_006',
    pool: 'core',
    rarity: 'R',
    title: '倒叙',
    flavor: '从结局开始讲起的故事，每一步都是倒计时',
    prompt: '使用倒叙手法讲述这段剧情'
  },
  {
    card_id: 'r_007',
    pool: 'core',
    rarity: 'R',
    title: '对话',
    flavor: '真正重要的话，都藏在寒暄之下',
    prompt: '用纯对话推进一个重要场景'
  },
  {
    card_id: 'r_008',
    pool: 'core',
    rarity: 'R',
    title: '隐喻',
    flavor: '不直说，是因为直说太轻了',
    prompt: '在场景中加入一个贯穿的隐喻意象'
  },

  // N 卡 (共10张)
  {
    card_id: 'n_001',
    pool: 'core',
    rarity: 'N',
    title: '清晨',
    flavor: '新的一天，旧的烦恼',
    prompt: '场景设定在清晨时分'
  },
  {
    card_id: 'n_002',
    pool: 'core',
    rarity: 'N',
    title: '雨天',
    flavor: '雨声是最好的背景音',
    prompt: '加入雨天作为背景氛围'
  },
  {
    card_id: 'n_003',
    pool: 'core',
    rarity: 'N',
    title: '沉默',
    flavor: '有时候不说话才是在说话',
    prompt: '安排一段有意义的沉默'
  },
  {
    card_id: 'n_004',
    pool: 'core',
    rarity: 'N',
    title: '微笑',
    flavor: '笑容背后藏着什么？',
    prompt: '描写一个意味深长的微笑'
  },
  {
    card_id: 'n_005',
    pool: 'core',
    rarity: 'N',
    title: '门',
    flavor: '推开或是关上，都是选择',
    prompt: '用门作为场景转换的道具'
  },
  {
    card_id: 'n_006',
    pool: 'core',
    rarity: 'N',
    title: '旧照片',
    flavor: '定格的笑容，流逝的时光',
    prompt: '让一张旧照片出现在故事中'
  },
  {
    card_id: 'n_007',
    pool: 'core',
    rarity: 'N',
    title: '陌生人',
    flavor: '擦肩而过的，可能是另一个故事',
    prompt: '安排一个陌生人短暂出场'
  },
  {
    card_id: 'n_008',
    pool: 'core',
    rarity: 'N',
    title: '等待',
    flavor: '等待本身就是一种煎熬',
    prompt: '描写一段等待的过程'
  },
  {
    card_id: 'n_009',
    pool: 'core',
    rarity: 'N',
    title: '独处',
    flavor: '一个人的时候，最诚实',
    prompt: '安排角色独处的场景'
  },
  {
    card_id: 'n_010',
    pool: 'core',
    rarity: 'N',
    title: '夜色',
    flavor: '夜晚总是更适合袒露心声',
    prompt: '场景设定在夜晚'
  }
];

export const getCardById = (id: string): Card | undefined => {
  return cardPool.find(c => c.card_id === id);
};

export const getCardsByRarity = (rarity: string): Card[] => {
  return cardPool.filter(c => c.rarity === rarity);
};
