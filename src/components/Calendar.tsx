import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, BookOpen, Heart, Calendar as CalendarIcon } from 'lucide-react';

interface DiaryEntry {
  diary: string;
  emotions: any;
  psychologyFeedback: string;
  advice: string;
  messages: any[];
  createdAt: string;
}

export const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [diaries, setDiaries] = useState<{ [key: string]: DiaryEntry }>({});
  const [selectedDiary, setSelectedDiary] = useState<DiaryEntry | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    const savedDiaries = JSON.parse(localStorage.getItem('diaries') || '{}');
    setDiaries(savedDiaries);
  }, []);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const formatDate = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const hasDiary = (day: number) => {
    if (!day) return false;
    const dateStr = formatDate(currentDate.getFullYear(), currentDate.getMonth(), day);
    return diaries[dateStr] !== undefined;
  };

  const handleDateClick = (day: number) => {
    if (!day) return;
    const dateStr = formatDate(currentDate.getFullYear(), currentDate.getMonth(), day);
    if (diaries[dateStr]) {
      setSelectedDiary(diaries[dateStr]);
      setSelectedDate(dateStr);
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getMonthStats = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    let diaryCount = 0;
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = formatDate(year, month, day);
      if (diaries[dateStr]) {
        diaryCount++;
      }
    }
    
    return {
      totalDays: daysInMonth,
      diaryDays: diaryCount,
      percentage: Math.round((diaryCount / daysInMonth) * 100)
    };
  };

  const days = getDaysInMonth(currentDate);
  const monthNames = [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월'
  ];
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  const stats = getMonthStats();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold font-korean text-gray-800">
                {currentDate.getFullYear()}년 {monthNames[currentDate.getMonth()]}
              </h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigateMonth('prev')}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  onClick={() => navigateMonth('next')}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Day Names */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {dayNames.map(day => (
                <div key={day} className="text-center py-2 text-sm font-korean text-gray-500">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => (
                <div
                  key={index}
                  onClick={() => handleDateClick(day)}
                  className={`
                    relative aspect-square flex items-center justify-center text-sm font-korean cursor-pointer rounded-lg transition-all duration-200
                    ${day ? 'hover:bg-gray-50' : ''}
                    ${hasDiary(day) ? 'bg-primary-50 border border-primary-200' : ''}
                    ${selectedDate === formatDate(currentDate.getFullYear(), currentDate.getMonth(), day) ? 'bg-primary-500 text-white' : ''}
                  `}
                >
                  {day && (
                    <>
                      <span className={selectedDate === formatDate(currentDate.getFullYear(), currentDate.getMonth(), day) ? 'text-white' : ''}>{day}</span>
                      {hasDiary(day) && (
                        <div className={`absolute top-1 right-1 w-2 h-2 rounded-full ${
                          selectedDate === formatDate(currentDate.getFullYear(), currentDate.getMonth(), day) 
                            ? 'bg-white' 
                            : 'bg-primary-500'
                        }`}></div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Stats */}
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-6 text-white mt-6">
            <div className="flex items-center space-x-3 mb-4">
              <CalendarIcon className="w-6 h-6" />
              <h3 className="text-lg font-semibold font-korean">이번 달 통계</h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.diaryDays}</div>
                <div className="text-sm opacity-90 font-korean">작성한 일기</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.percentage}%</div>
                <div className="text-sm opacity-90 font-korean">작성률</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.totalDays}</div>
                <div className="text-sm opacity-90 font-korean">총 일수</div>
              </div>
            </div>
          </div>
        </div>

        {/* Diary Preview */}
        <div className="lg:col-span-1">
          {selectedDiary ? (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-32">
              <div className="flex items-center space-x-3 mb-4">
                <BookOpen className="w-5 h-5 text-primary-500" />
                <h3 className="text-lg font-semibold font-korean text-gray-800">
                  {selectedDate && new Date(selectedDate + 'T00:00:00').toLocaleDateString('ko-KR', {
                    month: 'long',
                    day: 'numeric'
                  })} 일기
                </h3>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="font-korean text-sm text-gray-700 leading-relaxed line-clamp-6">
                    {selectedDiary.diary.substring(0, 200)}...
                  </p>
                </div>
                
                <div className="flex items-center justify-between text-xs font-korean text-gray-500">
                  <span>
                    {new Date(selectedDiary.createdAt).toLocaleTimeString('ko-KR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })} 작성
                  </span>
                  <span>{selectedDiary.messages.length}개 메시지</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-2xl p-6 text-center sticky top-32">
              <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="font-korean text-gray-500 text-sm">
                날짜를 선택하면<br />
                해당 일기를 미리볼 수 있어요
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};