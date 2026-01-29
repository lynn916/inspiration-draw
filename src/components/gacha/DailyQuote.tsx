import { FC } from 'react';
import { generateDailyQuote } from '@/lib/gacha/engine';

export const DailyQuote: FC = () => {
  const quote = generateDailyQuote();
  
  return (
    <div className="text-center py-4 px-6 bg-secondary/50 border-y border-border">
      <p className="text-sm text-muted-foreground italic">
        「{quote}」
      </p>
    </div>
  );
};
