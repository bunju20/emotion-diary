import React, { useState, useEffect } from 'react';
import { MessageCircle, Heart } from 'lucide-react';
import { aiService } from '../services/aiService';

interface DiaryReplyProps {
  diary: string;
}

export const DiaryReply: React.FC<DiaryReplyProps> = ({ diary }) => {
  const [reply, setReply] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const generateReply = async () => {
      try {
        const response = await aiService.generateDiaryReply(diary);
        setReply(response);
      } catch (error) {
        console.error('Failed to generate diary reply:', error);
        setReply('당신의 하루를 함께 나눠주셔서 고마워요. 오늘도 정말 수고 많으셨어요. 💕');
      } finally {
        setIsLoading(false);
      }
    };

    generateReply();
  }, [diary]);

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-6 border border-pink-100">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
            <MessageCircle className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 font-korean">마음일기의 답장</h3>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <span className="text-sm font-korean text-gray-500">답장을 작성하고 있어요...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-6 border border-pink-100 animate-fade-in">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
          <MessageCircle className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 font-korean">마음일기의 답장</h3>
        <Heart className="w-4 h-4 text-pink-400 animate-pulse" />
      </div>
      <div className="bg-white/60 rounded-xl p-4 border border-pink-200">
        <p className="font-korean text-gray-700 leading-relaxed italic">
          {reply}
        </p>
      </div>
    </div>
  );
};