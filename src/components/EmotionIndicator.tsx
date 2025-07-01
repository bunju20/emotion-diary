import React from 'react';

interface EmotionIndicatorProps {
  emotion: string;
}

export const EmotionIndicator: React.FC<EmotionIndicatorProps> = ({ emotion }) => {
  const getEmotionData = (emotion: string) => {
    const emotionMap = {
      happy: { emoji: '😊', color: 'text-yellow-500', bg: 'bg-yellow-50', text: '기분이 좋으시네요!' },
      sad: { emoji: '😢', color: 'text-blue-500', bg: 'bg-blue-50', text: '힘든 일이 있으셨나요?' },
      angry: { emoji: '😠', color: 'text-red-500', bg: 'bg-red-50', text: '화가 나셨군요.' },
      anxious: { emoji: '😰', color: 'text-purple-500', bg: 'bg-purple-50', text: '불안하신 것 같아요.' },
      tired: { emoji: '😴', color: 'text-gray-500', bg: 'bg-gray-50', text: '많이 피곤하시겠어요.' },
      peaceful: { emoji: '😌', color: 'text-green-500', bg: 'bg-green-50', text: '마음이 편안하시네요.' },
      neutral: { emoji: '🙂', color: 'text-gray-400', bg: 'bg-gray-50', text: '어떤 이야기든 들어드릴게요.' }
    };

    return emotionMap[emotion as keyof typeof emotionMap] || emotionMap.neutral;
  };

  const emotionData = getEmotionData(emotion);

  return (
    <div className={`flex items-center justify-center space-x-2 py-2 px-4 rounded-full ${emotionData.bg} transition-all duration-300`}>
      <span className="text-2xl animate-pulse">{emotionData.emoji}</span>
      <span className={`text-sm font-korean ${emotionData.color} font-medium`}>
        {emotionData.text}
      </span>
    </div>
  );
};