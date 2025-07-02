import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ChatInterface } from './components/ChatInterface';
import { DiaryResult } from './components/DiaryResult';
import { Calendar } from './components/Calendar';
import { Message, DiaryResult as DiaryResultType } from './types';
import { aiService } from './services/aiService';

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentView, setCurrentView] = useState<'chat' | 'result' | 'calendar'>('chat');
  const [diaryResult, setDiaryResult] = useState<DiaryResultType | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const addMessage = (content: string, isAI: boolean = false) => {
    const newMessage: Message = {
      id: Date.now().toString() + (isAI ? '_ai' : ''),
      content,
      timestamp: new Date(),
      isAI
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const finishDay = async () => {
    if (messages.length === 0) return;
    
    setIsProcessing(true);
    
    try {
      // Generate diary result directly from all messages
      const result = await aiService.generateDiaryResult(messages);
      setDiaryResult(result);
      
      // Save diary to localStorage
      const today = new Date().toISOString().split('T')[0];
      const savedDiaries = JSON.parse(localStorage.getItem('diaries') || '{}');
      savedDiaries[today] = {
        ...result,
        messages: messages.filter(m => !m.isAI), // Save only user messages
        createdAt: new Date().toISOString()
      };
      localStorage.setItem('diaries', JSON.stringify(savedDiaries));
      
      setCurrentView('result');
    } catch (error) {
      console.error('Failed to generate diary result:', error);
      // Handle error gracefully
    } finally {
      setIsProcessing(false);
    }
  };

  const startNewDay = () => {
    setMessages([]);
    setDiaryResult(null);
    setCurrentView('chat');
  };

  const switchView = (view: 'chat' | 'result' | 'calendar') => {
    setCurrentView(view);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-primary-50 font-korean">
      <Header currentView={currentView} onViewChange={switchView} />
      
      <main className="flex-1 h-[calc(100vh-120px)]">
        {currentView === 'chat' ? (
          <ChatInterface
            messages={messages}
            onAddMessage={addMessage}
            onFinishDay={finishDay}
            isProcessing={isProcessing}
            showAiResponses={false}
          />
        ) : currentView === 'calendar' ? (
          <Calendar />
        ) : (
          diaryResult && (
            <DiaryResult
              result={diaryResult}
              onStartNew={startNewDay}
            />
          )
        )}
      </main>
    </div>
  );
}

export default App;