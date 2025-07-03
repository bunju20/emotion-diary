import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Product } from '../types';

interface PurchaseInterceptDialogProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  delayMinutes: number;
  onConfirmPurchase: (product: Product, emotionTag: 'need' | 'desire' | 'stress') => void;
}

export function PurchaseInterceptDialog({
  isOpen,
  onClose,
  product,
  delayMinutes,
  onConfirmPurchase
}: PurchaseInterceptDialogProps) {
  const [timeRemaining, setTimeRemaining] = useState(delayMinutes * 60);
  const [reflectionStep, setReflectionStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selectedEmotionTag, setSelectedEmotionTag] = useState<'need' | 'desire' | 'stress'>('desire');
  const [monthlySpending] = useState(234500);
  const [monthlyBudget] = useState(500000);

  // 타이머 효과
  useEffect(() => {
    if (isOpen && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isOpen, timeRemaining]);

  // 다이얼로그 열릴 때 상태 리셋
  useEffect(() => {
    if (isOpen) {
      setTimeRemaining(delayMinutes * 60);
      setReflectionStep(0);
      setAnswers([]);
      setSelectedEmotionTag('desire');
    }
  }, [isOpen, delayMinutes]);

  if (!product) return null;

  const spendingPercentage = (monthlySpending / monthlyBudget) * 100;
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  const reflectionQuestions = [
    {
      question: "이 상품을 구매하는 진짜 이유는 무엇인가요?",
      options: [
        "정말 필요해서",
        "기분이 안 좋아서",
        "할인 혜택 때문에",
        "다른 사람들이 가지고 있어서"
      ]
    },
    {
      question: "이 상품 없이도 일상생활에 문제가 없나요?",
      options: [
        "없으면 정말 불편할 것 같다",
        "없어도 괜찮긴 하다",
        "사실 비슷한 게 이미 있다",
        "잘 모르겠다"
      ]
    },
    {
      question: "일주일 후에도 같은 마음일 것 같나요?",
      options: [
        "당연히 여전히 갖고 싶을 것이다",
        "아마도 그럴 것이다",
        "잘 모르겠다",
        "지금 당장만 갖고 싶은 것 같다"
      ]
    }
  ];

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (reflectionStep < reflectionQuestions.length - 1) {
      setReflectionStep(reflectionStep + 1);
    } else {
      setReflectionStep(reflectionQuestions.length);
    }
  };

  const handleConfirmPurchase = () => {
    onConfirmPurchase(product, selectedEmotionTag);
  };

  const getSuggestion = () => {
    const impulseAnswers = answers.filter(answer => 
      answer.includes('기분이 안 좋아서') || 
      answer.includes('할인 혜택') ||
      answer.includes('다른 사람들이') ||
      answer.includes('없어도 괜찮긴') ||
      answer.includes('지금 당장만')
    ).length;

    if (impulseAnswers >= 2) {
      return {
        type: 'warning',
        message: '감정적이거나 충동적인 구매일 가능성이 높아요. 하루만 더 기다려보시는 건 어떨까요?',
        icon: '⚠️'
      };
    } else {
      return {
        type: 'positive',
        message: '신중하게 생각해보신 것 같네요. 현명한 선택이 될 것 같아요!',
        icon: '🧠'
      };
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            ⏰ 잠깐, 정말 구매하시겠어요?
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* 타이머 */}
          {timeRemaining > 0 && (
            <Card>
              <CardContent className="p-4">
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-red-500">
                    ⏱️ {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                  </div>
                  <p className="text-sm text-gray-600">
                    마음을 차분히 하고 정말 필요한 구매인지 생각해보세요
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 상품 정보 */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-3">
                <ImageWithFallback
                  src={product.image}
                  alt={product.title}
                  className="w-16 h-16 object-cover rounded-md"
                />
                <div className="flex-1">
                  <h4 className="font-medium mb-1">{product.title}</h4>
                  <p className="text-lg font-bold text-purple-600">{product.price.toLocaleString()}원</p>
                  <Badge variant="outline" className="mt-2 text-xs">
                    {product.category}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 이번 달 지출 현황 */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">💰</span>
                <span className="font-medium">이번 달 지출 현황</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>현재: {monthlySpending.toLocaleString()}원</span>
                  <span>예산: {monthlyBudget.toLocaleString()}원</span>
                </div>
                <Progress value={spendingPercentage} className="h-2" />
                <p className="text-xs text-gray-600">
                  예산의 {Math.round(spendingPercentage)}% 사용 중
                  {spendingPercentage > 80 && (
                    <span className="text-orange-600 ml-1">⚠️ 예산 초과 주의</span>
                  )}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 성찰 질문 */}
          {reflectionStep < reflectionQuestions.length ? (
            <Card>
              <CardContent className="p-4">
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500">
                      질문 {reflectionStep + 1} / {reflectionQuestions.length}
                    </span>
                    <Progress 
                      value={((reflectionStep + 1) / reflectionQuestions.length) * 100} 
                      className="w-20 h-1"
                    />
                  </div>
                  <h4 className="font-medium mb-3">{reflectionQuestions[reflectionStep].question}</h4>
                </div>
                
                <div className="space-y-2">
                  {reflectionQuestions[reflectionStep].options.map((option, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full justify-start h-auto p-3 text-left text-sm"
                      onClick={() => handleAnswer(option)}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            /* 결과 및 추천 */
            <Card>
              <CardContent className="p-4">
                <div className="text-center space-y-3">
                  <div className="text-2xl">🤔</div>
                  <h4 className="font-medium">성찰 완료!</h4>
                  
                  {(() => {
                    const suggestion = getSuggestion();
                    return (
                      <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-md">
                        <span className="text-lg">{suggestion.icon}</span>
                        <p className="text-sm text-left">{suggestion.message}</p>
                      </div>
                    );
                  })()}

                  {/* 감정 태그 선택 */}
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">이 구매의 감정 상태를 선택해주세요:</p>
                    <div className="flex gap-2 justify-center">
                      {[
                        { value: 'need', label: '필요', emoji: '🧠', color: 'bg-green-100 text-green-700' },
                        { value: 'desire', label: '욕망', emoji: '💖', color: 'bg-pink-100 text-pink-700' },
                        { value: 'stress', label: '스트레스', emoji: '⚡', color: 'bg-red-100 text-red-700' }
                      ].map((tag) => (
                        <Button
                          key={tag.value}
                          variant={selectedEmotionTag === tag.value ? "default" : "outline"}
                          onClick={() => setSelectedEmotionTag(tag.value as 'need' | 'desire' | 'stress')}
                          className="text-xs"
                        >
                          {tag.emoji} {tag.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 액션 버튼 */}
          {reflectionStep >= reflectionQuestions.length && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                🕐 내일 다시 생각해볼게요
              </Button>
              <Button
                onClick={handleConfirmPurchase}
                disabled={timeRemaining > 0}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                💳 {timeRemaining > 0 ? '잠시만요...' : '구매할게요'}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}