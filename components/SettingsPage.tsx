import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Settings } from '../types';

interface SettingsPageProps {
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
}

export function SettingsPage({ settings, onSettingsChange }: SettingsPageProps) {
  const [monthlyBudget, setMonthlyBudget] = useState(settings.monthlyBudget);
  const [stressWarningThreshold, setStressWarningThreshold] = useState(settings.stressWarningThreshold);
  const [purchaseDelayMinutes, setPurchaseDelayMinutes] = useState(settings.purchaseDelayMinutes);
  const [notifications, setNotifications] = useState(true);
  const [delayReminders, setDelayReminders] = useState(true);

  const handleSave = () => {
    onSettingsChange({
      monthlyBudget,
      stressWarningThreshold,
      purchaseDelayMinutes
    });
  };

  const delayOptions = [
    { value: 1, label: '1분 (테스트용)' },
    { value: 5, label: '5분 (테스트용)' },
    { value: 10, label: '10분' },
    { value: 30, label: '30분' },
    { value: 60, label: '1시간' },
    { value: 120, label: '2시간' },
    { value: 360, label: '6시간' },
    { value: 1440, label: '24시간' }
  ];

  return (
    <div className="pb-20 p-4 space-y-6">
      <h1>설정</h1>

      {/* 예산 설정 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            💰
            월간 예산 설정
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="budget">월간 예산 (원)</Label>
            <div className="relative mt-2">
              <Input
                id="budget"
                type="number"
                value={monthlyBudget}
                onChange={(e) => setMonthlyBudget(Number(e.target.value))}
                placeholder="예: 500000"
                className="pr-10"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
                원
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              예산을 초과하면 구매 전 경고를 보여드릴게요
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 구매 대기 시간 설정 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            ⏰
            구매 대기 시간 설정
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>구매 대기 시간</Label>
            <Select
              value={purchaseDelayMinutes.toString()}
              onValueChange={(value) => setPurchaseDelayMinutes(Number(value))}
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="대기 시간을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {delayOptions.map(option => (
                  <SelectItem key={option.value} value={option.value.toString()}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-2">
              찜한 상품을 구매하기 전 대기해야 하는 시간입니다.<br />
              충동구매를 방지하고 신중한 결정을 도와드려요.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 감정 알림 설정 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            ⚠️
            감정 소비 경고 설정
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>스트레스 소비 경고 기준</Label>
            <div className="mt-4 mb-2">
              <Slider
                value={[stressWarningThreshold]}
                onValueChange={(value) => setStressWarningThreshold(value[0])}
                max={50}
                min={10}
                step={5}
                className="w-full"
              />
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>10%</span>
              <span className="font-medium">
                {stressWarningThreshold}% 이상
              </span>
              <span>50%</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              스트레스성 소비가 이 비율을 넘으면 구매를 제한합니다
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 알림 설정 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🔔
            알림 설정
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>구매 지연 알림</Label>
              <p className="text-xs text-muted-foreground">
                24시간 후 찜한 상품을 다시 알려드려요
              </p>
            </div>
            <Switch
              checked={delayReminders}
              onCheckedChange={setDelayReminders}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label>소비 분석 알림</Label>
              <p className="text-xs text-muted-foreground">
                주간 소비 패턴을 분석해서 알려드려요
              </p>
            </div>
            <Switch
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          </div>
        </CardContent>
      </Card>

      {/* 정보 카드 */}
      <Card>
        <CardContent className="p-4">
          <div className="text-center space-y-2">
            <div className="text-2xl">🌱</div>
            <h3>현명한 소비 습관 만들기</h3>
            <p className="text-sm text-muted-foreground">
              작은 변화가 큰 차이를 만듭니다.<br />
              자신을 판단하지 말고, 이해하려고 노력해보세요.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 저장 버튼 */}
      <Button onClick={handleSave} className="w-full">
        💾 설정 저장
      </Button>
    </div>
  );
}