import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { MessageBubble } from './MessageBubble';
import { EmotionIndicator } from './EmotionIndicator';
import { Message } from '../types';

interface ChatInterfaceProps {
  messages: Message[];
  onAddMessage: (content: string) => void;
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
  const [currentEmotion, setCurrentEmotion] = useState<string>('neutral');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, showAiResponses]);

  // Analyze emotion from input text
  useEffect(() => {
    if (inputValue.length > 5) {
      const emotion = analyzeInputEmotion(inputValue);
      setCurrentEmotion(emotion);
    } else {
      setCurrentEmotion('neutral');
    }
  }, [inputValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isProcessing) {
      onAddMessage(inputValue.trim());
      setInputValue('');
      setCurrentEmotion('neutral');
      inputRef.current?.focus();
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
      {/* Emotion Indicator */}
      <div className="px-4 py-2 bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <EmotionIndicator emotion={currentEmotion} />
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-primary-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2 font-korean">
              오늘 하루는 어떠셨나요?
            </h3>
            <p className="text-gray-500 text-sm font-korean max-w-sm mx-auto leading-relaxed">
              자유롭게 생각나는 것들을 이야기해보세요.<br />
              기쁜 일, 힘든 일, 무엇이든 좋아요.
            </p>
            <div className="mt-6 text-4xl animate-bounce-gentle">😊</div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                content={message.content}
                isUser={true}
                aiResponse={message.aiResponse}
                showAiResponse={showAiResponses}
              />
            ))}
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
              placeholder={messages.length === 0 ? "예: 오늘 일이 너무 많아서 피곤했어..." : "계속 이야기해보세요..."}
              disabled={isProcessing}
              className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent font-korean text-sm disabled:opacity-50"
            />
          </div>
          <button
            type="submit"
            disabled={!inputValue.trim() || isProcessing}
            className="px-6 py-3 bg-primary-500 text-white rounded-2xl hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span className="font-korean text-sm">전송</span>
          </button>
        </form>

        {messages.length > 0 && !showAiResponses && !isProcessing && (
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

// Helper function to analyze emotion from input text
const analyzeInputEmotion = (text: string): string => {
  const lowerText = text.toLowerCase();
  
  // Korean emotion keywords
  const emotionKeywords = {
    happy: ['좋아', '기뻐', '행복', '즐거', '웃음', '신나', '최고', '완벽', '사랑'],
    sad: ['슬퍼', '우울', '눈물', '힘들', '외로', '그리워', '아파', '속상'],
    angry: ['화나', '짜증', '열받', '분노', '미워', '싫어', '빡쳐'],
    anxious: ['불안', '걱정', '두려', '무서', '떨려', '긴장', '스트레스'],
    tired: ['피곤', '지쳐', '힘들', '졸려', '귀찮', '번거'],
    peaceful: ['평온', '차분', '편안', '조용', '여유', '휴식']
  };

  for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      return emotion;
    }
  }

  return 'neutral';
};