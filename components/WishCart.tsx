import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { emotionLabels } from '../data/mockData';
import { WishItem } from '../types';

interface WishCartProps {
  wishList: WishItem[];
  onRemoveFromWishList: (id: string) => void;
  onPurchaseAttempt: (product: WishItem) => void;
}

export function WishCart({ wishList, onRemoveFromWishList, onPurchaseAttempt }: WishCartProps) {
  const [editingMemo, setEditingMemo] = useState<string | null>(null);
  const [memoText, setMemoText] = useState('');
  const [currentTime, setCurrentTime] = useState(Date.now());

  // 매초마다 현재 시간 업데이트
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const canPurchase = (addedAt: Date) => {
    const millisecondsRemaining = addedAt.getTime() + (5 * 60 * 1000) - currentTime; // 5분 딜레이
    return millisecondsRemaining <= 0;
  };

  const getTimeRemaining = (addedAt: Date) => {
    const millisecondsRemaining = addedAt.getTime() + (5 * 60 * 1000) - currentTime;
    
    if (millisecondsRemaining <= 0) {
      return { minutes: 0, seconds: 0, totalSeconds: 0 };
    }

    const totalSeconds = Math.floor(millisecondsRemaining / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return { minutes, seconds, totalSeconds };
  };

  const formatTimeRemaining = (time: { minutes: number; seconds: number; totalSeconds: number }) => {
    if (time.totalSeconds <= 0) {
      return "구매 가능";
    }

    if (time.minutes > 0) {
      return `${time.minutes}분 ${time.seconds}초`;
    } else {
      return `${time.seconds}초`;
    }
  };

  const handleSaveMemo = (id: string) => {
    // 메모 저장 로직 (상위 컴포넌트에서 처리)
    setEditingMemo(null);
    setMemoText('');
  };

  const startEditingMemo = (id: string, currentMemo: string) => {
    setEditingMemo(id);
    setMemoText(currentMemo || '');
  };

  if (wishList.length === 0) {
    return (
      <div className="pb-20 p-4">
        <h1 className="mb-6">찜 목록</h1>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🤍</div>
          <h3 className="mb-2">아직 찜한 상품이 없어요</h3>
          <p className="text-muted-foreground">
            마음에 드는 상품을 찜해보세요.<br />
            신중하게 생각할 시간을 드릴게요.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20 p-4">
      <div className="flex justify-between items-center mb-6">
        <h1>찜 목록</h1>
        <Badge variant="secondary">{wishList.length}개</Badge>
      </div>

      <div className="space-y-4">
        {wishList.map(item => {
          const emotion = emotionLabels[item.emotionTag];
          const purchasable = canPurchase(item.addedAt);
          const timeRemaining = getTimeRemaining(item.addedAt);

          return (
            <Card key={item.id}>
              <CardHeader className="pb-3">
                <div className="flex gap-3">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <CardTitle className="text-base line-clamp-2 mb-1">
                      {item.title}
                    </CardTitle>
                    <p className="font-semibold">
                      {item.price.toLocaleString()}원
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveFromWishList(item.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    🗑️
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                {/* 감정 태그 */}
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={emotion.color}>
                    <span>{emotion.emoji}</span>
                    <span className="ml-1">{emotion.label}</span>
                  </Badge>
                </div>

                {/* 메모 섹션 */}
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">
                    메모
                  </label>
                  
                  {editingMemo === item.id ? (
                    <div className="space-y-2">
                      <Textarea
                        value={memoText}
                        onChange={(e) => setMemoText(e.target.value)}
                        placeholder="이 상품이 필요한 이유나 감정을 적어보세요..."
                        className="min-h-[80px]"
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleSaveMemo(item.id)}>
                          저장
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setEditingMemo(null)}
                        >
                          취소
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => startEditingMemo(item.id, item.memo || '')}
                      className="min-h-[80px] p-3 border rounded-md bg-muted/50 cursor-pointer hover:bg-muted transition-colors"
                    >
                      {item.memo ? (
                        <p className="text-sm">{item.memo}</p>
                      ) : (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <span className="text-sm">💬 메모를 추가해보세요</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* 구매 버튼 */}
                <div className="pt-2">
                  {purchasable ? (
                    <Button 
                      className="w-full"
                      onClick={() => onPurchaseAttempt(item)}
                    >
                      🛒 구매하기
                    </Button>
                  ) : (
                    <div className="text-center space-y-2">
                      <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <span className="text-sm">⏰</span>
                        <span className="text-sm font-mono">
                          {formatTimeRemaining(timeRemaining)} 후 구매 가능
                        </span>
                      </div>
                      
                      {/* 진행 상황 표시 바 */}
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-1000 ease-out"
                          style={{ 
                            width: `${Math.max(0, Math.min(100, ((5 * 60 - timeRemaining.totalSeconds) / (5 * 60)) * 100))}%` 
                          }}
                        />
                      </div>
                      
                      <p className="text-xs text-muted-foreground">
                        잠시 시간을 갖고 정말 필요한지 생각해보세요 ✨
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}