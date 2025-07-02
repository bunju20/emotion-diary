import React, { useState } from 'react';
import { Header } from './components/Header';
import { ChatInterface } from './components/ChatInterface';
import { DiaryResult } from './components/DiaryResult';
import { Message, DiaryResult as DiaryResultType } from './types';
import { aiService } from './services/aiService';

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentView, setCurrentView] = useState<'chat' | 'result'>('chat');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-primary-50 font-korean">
      <Header />
      
      <main className="flex-1 h-[calc(100vh-120px)]">
        {currentView === 'chat' ? (
          <ChatInterface
            messages={messages}
            onAddMessage={addMessage}
            onFinishDay={finishDay}
            isProcessing={isProcessing}
            showAiResponses={false}
          />
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