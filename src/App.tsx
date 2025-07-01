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
  const [showAiResponses, setShowAiResponses] = useState(false);

  const addMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const finishDay = async () => {
    if (messages.length === 0) return;
    
    setIsProcessing(true);
    
    try {
      // Generate AI responses for each message
      const messagesWithResponses = await Promise.all(
        messages.map(async (message) => {
          const aiResponse = await aiService.generateEmpathyResponse(message.content);
          return { ...message, aiResponse };
        })
      );
      
      setMessages(messagesWithResponses);
      setShowAiResponses(true);
      
      // Wait a bit for user to read AI responses
      setTimeout(async () => {
        try {
          const result = await aiService.generateDiaryResult(messagesWithResponses);
          setDiaryResult(result);
          setCurrentView('result');
        } catch (error) {
          console.error('Failed to generate diary result:', error);
          // Handle error gracefully
        } finally {
          setIsProcessing(false);
        }
      }, 3000);
      
    } catch (error) {
      console.error('Failed to process day:', error);
      setIsProcessing(false);
    }
  };

  const startNewDay = () => {
    setMessages([]);
    setDiaryResult(null);
    setCurrentView('chat');
    setShowAiResponses(false);
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
            showAiResponses={showAiResponses}
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