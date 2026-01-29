import { FC } from 'react';

interface HeaderProps {
  username: string;
  todaySSR: boolean;
  isWritingFocused: boolean;
  onUsernameChange: (name: string) => void;
}

export const Header: FC<HeaderProps> = ({ username, todaySSR, isWritingFocused, onUsernameChange }) => {
  // 获取首字母或首汉字
  const avatar = username.charAt(0).toUpperCase();
  
  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
      <div className="flex items-center gap-3">
        {/* 胶囊头像 */}
        <div className="relative flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
            {avatar}
          </div>
          <input
            type="text"
            value={username}
            onChange={(e) => onUsernameChange(e.target.value)}
            className="bg-transparent border-none outline-none text-sm font-medium w-20 text-foreground"
            placeholder="旅人"
          />
          {/* SSR 标志 */}
          {todaySSR && (
            <span 
              className={`text-lg ${isWritingFocused ? 'ssr-breathe-reduced' : 'ssr-breathe'}`}
              title="今日已抽到SSR！"
            >
              ✨
            </span>
          )}
        </div>
      </div>
      
      <div className="text-lg font-bold text-primary">
        灵感抽卡机
        <span className="text-xs font-normal text-muted-foreground ml-2">剧情发牌器</span>
      </div>
    </header>
  );
};
