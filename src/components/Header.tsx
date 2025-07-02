import React from 'react';
import { Heart, Sparkles, Calendar as CalendarIcon, MessageCircle } from 'lucide-react';

interface HeaderProps {
  currentView: 'chat' | 'result' | 'calendar';
  onViewChange: (view: 'chat' | 'result' | 'calendar') => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onViewChange }) => {
  return (
    <header className="bg-white/90 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Heart className="w-6 h-6 text-primary-400 animate-bounce-gentle" />
            <h1 className="text-xl font-bold font-korean text-gray-800">마음일기</h1>
            <Sparkles className="w-5 h-5 text-primary-300" />
          </div>
          
          <nav className="flex items-center space-x-1">
            <button
              onClick={() => onViewChange('chat')}
              className={`px-4 py-2 rounded-full text-sm font-korean transition-all duration-200 flex items-center space-x-2 ${
                currentView === 'chat'
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <MessageCircle className="w-4 h-4" />
              <span>일기쓰기</span>
            </button>
            <button
              onClick={() => onViewChange('calendar')}
              className={`px-4 py-2 rounded-full text-sm font-korean transition-all duration-200 flex items-center space-x-2 ${
                currentView === 'calendar'
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <CalendarIcon className="w-4 h-4" />
              <span>캘린더</span>
            </button>
          </nav>
        </div>
        
        <p className="text-center text-sm text-gray-500 mt-1">
          {currentView === 'chat' && '오늘 하루를 자유롭게 이야기해보세요'}
          {currentView === 'calendar' && '지난 일기들을 확인해보세요'}
          {currentView === 'result' && '오늘의 일기가 완성되었습니다'}
        </p>
      </div>
    </header>
  );
};