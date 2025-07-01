import React from 'react';
import { BookOpen, Lightbulb, Heart, MessageCircle, Sparkles } from 'lucide-react';
import { DiaryResult as DiaryResultType } from '../types';
import { EmotionChart } from './EmotionChart';
import { DiaryReply } from './DiaryReply';

interface DiaryResultProps {
  result: DiaryResultType;
  onStartNew: () => void;
}

export const DiaryResult: React.FC<DiaryResultProps> = ({ result, onStartNew }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Diary Section */}
      <div className="bg-gradient-to-br from-white to-primary-50 rounded-2xl p-8 shadow-sm border border-primary-100">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 font-korean">오늘의 일기</h2>
        </div>
        
        <div className="prose prose-gray max-w-none">
          {result.diary.split('\n\n').map((paragraph, index) => (
            <p key={index} className="font-korean text-gray-700 leading-relaxed mb-4 text-base">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      {/* AI Reply to Diary */}
      <DiaryReply diary={result.diary} />

      {/* Emotion Analysis */}
      <div className="animate-fade-in">
        <EmotionChart emotions={result.emotions} />
      </div>

      {/* Psychology Feedback */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <Heart className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 font-korean">심리 분석</h3>
        </div>
        <p className="font-korean text-gray-700 leading-relaxed">
          {result.psychologyFeedback}
        </p>
      </div>

      {/* Advice */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-6 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <Lightbulb className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-lg font-semibold font-korean">오늘을 위한 조언</h3>
        </div>
        <p className="font-korean leading-relaxed opacity-90">
          {result.advice}
        </p>
      </div>

      {/* Mood Summary Card */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 font-korean">오늘의 기분 요약</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-white/50 rounded-xl">
            <div className="text-2xl mb-2">{getMoodEmoji(result.emotions)}</div>
            <p className="text-sm font-korean text-gray-600">전체적인 기분</p>
            <p className="text-xs font-korean text-gray-500 mt-1">{getMoodDescription(result.emotions)}</p>
          </div>
          <div className="text-center p-4 bg-white/50 rounded-xl">
            <div className="text-2xl mb-2">💪</div>
            <p className="text-sm font-korean text-gray-600">에너지 레벨</p>
            <p className="text-xs font-korean text-gray-500 mt-1">{getEnergyLevel(result.emotions)}</p>
          </div>
          <div className="text-center p-4 bg-white/50 rounded-xl">
            <div className="text-2xl mb-2">🌟</div>
            <p className="text-sm font-korean text-gray-600">성장 포인트</p>
            <p className="text-xs font-korean text-gray-500 mt-1">자기 성찰</p>
          </div>
        </div>
      </div>

      {/* New Day Button */}
      <div className="text-center pt-4">
        <button
          onClick={onStartNew}
          className="px-8 py-3 bg-white border-2 border-primary-500 text-primary-600 rounded-full hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-300 transition-all duration-200 font-korean font-medium"
        >
          새로운 하루 시작하기
        </button>
      </div>
    </div>
  );
};

// Helper functions
const getMoodEmoji = (emotions: any) => {
  const maxEmotion = Object.entries(emotions).reduce((a, b) => 
    emotions[a[0] as keyof typeof emotions] > emotions[b[0] as keyof typeof emotions] ? a : b
  );
  
  const emojiMap: { [key: string]: string } = {
    happy: '😊',
    sad: '😢',
    angry: '😠',
    anxious: '😰',
    peaceful: '😌',
    tired: '😴'
  };
  
  return emojiMap[maxEmotion[0]] || '😊';
};

const getMoodDescription = (emotions: any) => {
  const maxEmotion = Object.entries(emotions).reduce((a, b) => 
    emotions[a[0] as keyof typeof emotions] > emotions[b[0] as keyof typeof emotions] ? a : b
  );
  
  const descriptionMap: { [key: string]: string } = {
    happy: '기분 좋은 하루',
    sad: '조금 우울한 하루',
    angry: '화가 났던 하루',
    anxious: '불안했던 하루',
    peaceful: '평온한 하루',
    tired: '피곤했던 하루'
  };
  
  return descriptionMap[maxEmotion[0]] || '평범한 하루';
};

const getEnergyLevel = (emotions: any) => {
  const energyScore = emotions.happy + emotions.peaceful - emotions.tired - emotions.sad;
  if (energyScore > 20) return '높음';
  if (energyScore > 0) return '보통';
  return '낮음';
};