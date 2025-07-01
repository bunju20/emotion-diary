import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { EmotionAnalysis } from '../types';

interface EmotionChartProps {
  emotions: EmotionAnalysis;
}

const EMOTION_COLORS = {
  happy: '#fbbf24',
  sad: '#60a5fa',
  angry: '#f87171',
  anxious: '#a78bfa',
  peaceful: '#34d399',
  tired: '#94a3b8',
};

const EMOTION_LABELS = {
  happy: '행복',
  sad: '슬픔',
  angry: '화남',
  anxious: '불안',
  peaceful: '평온',
  tired: '피곤',
};

export const EmotionChart: React.FC<EmotionChartProps> = ({ emotions }) => {
  const data = Object.entries(emotions)
    .filter(([_, value]) => value > 0)
    .map(([key, value]) => ({
      name: EMOTION_LABELS[key as keyof EmotionAnalysis],
      value,
      color: EMOTION_COLORS[key as keyof EmotionAnalysis],
    }))
    .sort((a, b) => b.value - a.value);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100">
          <p className="font-korean text-sm">
            <span className="font-medium">{payload[0].name}</span>: {payload[0].value}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 font-korean text-center">
        오늘의 감정 분석
      </h3>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value) => <span className="font-korean text-sm">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {data.slice(0, 4).map((emotion) => (
          <div key={emotion.name} className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: emotion.color }}
            ></div>
            <span className="text-sm font-korean text-gray-600">
              {emotion.name} {emotion.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};