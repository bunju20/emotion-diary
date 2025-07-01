import React from 'react';
import { BookOpen, Lightbulb, Heart } from 'lucide-react';
import { DiaryResult as DiaryResultType } from '../types';
import { EmotionChart } from './EmotionChart';

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