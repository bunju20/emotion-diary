import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { emotionLabels } from '../data/mockData';
import { SpendingRecord, Settings } from '../types';

interface SpendingDashboardProps {
  spendingHistory: SpendingRecord[];
  settings: Settings;
}

export function SpendingDashboard({ spendingHistory, settings }: SpendingDashboardProps) {
  // 이번 달 소비 분석
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthlyRecords = spendingHistory.filter(record => {
    const recordDate = new Date(record.date);
    return recordDate.getMonth() === currentMonth && recordDate.getFullYear() === currentYear;
  });

  const totalSpending = monthlyRecords.reduce((total, record) => total + record.amount, 0);

  // 감정별 소비 분석
  const emotionSpending = Object.keys(emotionLabels).reduce((acc, emotion) => {
    const amount = monthlyRecords
      .filter(record => record.emotionTag === emotion)
      .reduce((sum, record) => sum + record.amount, 0);
    
    acc[emotion] = amount;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(emotionSpending).map(([emotion, amount]) => ({
    name: emotionLabels[emotion as keyof typeof emotionLabels].label,
    value: amount,
    color: emotion === 'need' ? '#10b981' : emotion === 'desire' ? '#ec4899' : '#ef4444'
  }));

  // 주간 소비 패턴 (최근 7일)
  const weeklyData = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    const daySpending = spendingHistory
      .filter(record => {
        const recordDate = new Date(record.date);
        return recordDate.toDateString() === date.toDateString();
      })
      .reduce((sum, record) => sum + record.amount, 0);
      
    weeklyData.push({
      day: date.toLocaleDateString('ko-KR', { weekday: 'short' }),
      amount: daySpending
    });
  }

  const stressSpendingRatio = totalSpending > 0 
    ? (emotionSpending.stress / totalSpending) * 100 
    : 0;

  const getSpendingInsight = () => {
    if (stressSpendingRatio > 30) {
      return {
        type: 'warning',
        message: '스트레스성 소비가 많아요. 감정을 돌아보는 시간을 가져보세요.',
        icon: '⚠️',
        color: 'text-red-600'
      };
    } else if (emotionSpending.need > emotionSpending.desire + emotionSpending.stress) {
      return {
        type: 'good',
        message: '필요에 따른 합리적인 소비를 하고 계시네요!',
        icon: '💚',
        color: 'text-green-600'
      };
    } else {
      return {
        type: 'neutral',
        message: '감정과 필요의 균형을 맞춰보세요.',
        icon: '📈',
        color: 'text-blue-600'
      };
    }
  };

  const insight = getSpendingInsight();

  return (
    <div className="pb-20 p-4 space-y-6">
      <h1>소비 분석</h1>

      {/* 월간 소비 요약 */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              💰
              이번 달 총 소비
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-2xl font-bold">
              {totalSpending.toLocaleString()}원
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {monthlyRecords.length}건의 구매
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              ⚠️
              스트레스 소비율
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-2xl font-bold">
              {stressSpendingRatio.toFixed(1)}%
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {emotionSpending.stress.toLocaleString()}원
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 감정별 소비 분석 */}
      <Card>
        <CardHeader>
          <CardTitle>감정별 소비 패턴</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="space-y-2">
            {Object.entries(emotionSpending).map(([emotion, amount]) => {
              const emotionData = emotionLabels[emotion as keyof typeof emotionLabels];
              const percentage = totalSpending > 0 ? (amount / totalSpending) * 100 : 0;
              
              return (
                <div key={emotion} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span>{emotionData.emoji}</span>
                    <span className="text-sm">{emotionData.label}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {amount.toLocaleString()}원
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {percentage.toFixed(1)}%
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 주간 소비 패턴 */}
      <Card>
        <CardHeader>
          <CardTitle>이번 주 소비 패턴</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <XAxis dataKey="day" />
                <YAxis />
                <Bar dataKey="amount" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* 소비 인사이트 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className={`text-lg ${insight.color}`}>{insight.icon}</span>
            이번 달 당신의 소비 경향
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">
            {insight.message}
          </p>
          
          <div className="space-y-2">
            <Badge variant="outline" className="mr-2">
              💡 팁: 구매 전 {settings.purchaseDelayMinutes}분을 기다려보세요
            </Badge>
            <Badge variant="outline">
              🧘‍♀️ 감정 일기를 써보는 것도 도움이 됩니다
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}