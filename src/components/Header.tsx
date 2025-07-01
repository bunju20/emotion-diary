import React from 'react';
import { Heart, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white/90 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-center space-x-2">
          <div className="flex items-center space-x-2">
            <Heart className="w-6 h-6 text-primary-400 animate-bounce-gentle" />
            <h1 className="text-xl font-bold font-korean text-gray-800">마음일기</h1>
            <Sparkles className="w-5 h-5 text-primary-300" />
          </div>
        </div>
        <p className="text-center text-sm text-gray-500 mt-1">
          오늘 하루를 자유롭게 이야기해보세요
        </p>
      </div>
    </header>
  );
};