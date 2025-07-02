import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { MessageBubble } from './MessageBubble';
import { RiveEmotionDisplay } from './RiveEmotionDisplay';
import { Message } from '../types';
import { aiService } from '../services/aiService';

interface ChatInterfaceProps {
  messages: Message[];
  onAddMessage: (content: string, isAI?: boolean) => void;
  onFinishDay: () => void;
  isProcessing: boolean;
  showAiResponses: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  onAddMessage,
  onFinishDay,
  isProcessing,
  showAiResponses
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isGeneratingResponse, setIsGeneratingResponse] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<number>(1); // 기본값: 의문
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGeneratingResponse]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isProcessing && !isGeneratingResponse) {
      const userMessage = inputValue.trim();
      onAddMessage(userMessage);
      setInputValue('');
      
      // 메시지 감정 분석 및 캐릭터 업데이트
      setIsGeneratingResponse(true);
      try {
        // 감정 분석과 AI 응답을 병렬로 처리
        const [emotion, aiResponse] = await Promise.all([
          aiService.analyzeMessageEmotion(userMessage),
          aiService.generateFollowUpResponse(userMessage, messages.length)
        ]);
        
        // 감정 업데이트
        setCurrentEmotion(emotion);
        
        // AI 응답 추가
        setTimeout(() => {
          onAddMessage(aiResponse, true);
          setIsGeneratingResponse(false);
          inputRef.current?.focus();
        }, 1000);
      } catch (error) {
        console.error('Failed to process message:', error);
        setIsGeneratingResponse(false);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.length === 0 ? (
          <div className="space-y-6">
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-primary-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2 font-korean">
                오늘 하루는 어떠셨나요?
              </h3>
              <p className="text-gray-500 text-sm font-korean max-w-sm mx-auto leading-relaxed">
                자유롭게 생각나는 것들을 이야기해보세요.<br />
                AI가 당신의 감정을 분석해서 캐릭터가 반응할 거예요.
              </p>
            </div>
            
            {/* 감정 표시 캐릭터 */}
            <div className="max-w-sm mx-auto">
              <RiveEmotionDisplay 
                currentEmotion={currentEmotion}
                className="w-full h-32"
              />
            </div>
          </div>
        ) : (
          <>
            {/* 대화 중일 때도 감정 캐릭터 표시 */}
            <div className="flex justify-center mb-4">
              <RiveEmotionDisplay 
                currentEmotion={currentEmotion}
                className="w-24 h-24"
              />
            </div>
            
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                content={message.content}
                isUser={!message.isAI}
              />
            ))}
            {isGeneratingResponse && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-2">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                    <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce"></div>
                  </div>
                  <div className="px-4 py-3 bg-gray-100 rounded-2xl rounded-bl-md">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {isProcessing && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-2">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                    <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce"></div>
                  </div>
                  <div className="px-4 py-3 bg-gray-100 rounded-2xl rounded-bl-md">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-100 p-4 bg-white">
        <form onSubmit={handleSubmit} className="flex space-x-3">
          <div className="flex-1">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={messages.length === 0 ? "예: 오늘 너무 피곤했어..." : "더 이야기해주세요..."}
              disabled={isProcessing || isGeneratingResponse}
              className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent font-korean text-sm disabled:opacity-50"
            />
          </div>
          <button
            type="submit"
            disabled={!inputValue.trim() || isProcessing || isGeneratingResponse}
            className="px-6 py-3 bg-primary-500 text-white rounded-2xl hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span className="font-korean text-sm">전송</span>
          </button>
        </form>

        {messages.length > 2 && !isProcessing && !isGeneratingResponse && (
          <div className="flex justify-center mt-4">
            <button
              onClick={onFinishDay}
              className="px-8 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-full hover:from-primary-600 hover:to-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-300 transition-all duration-200 font-korean font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4" />
                <span>하루 마무리하기</span>
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};