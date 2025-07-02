import React from 'react';
import { User, Heart } from 'lucide-react';

interface MessageBubbleProps {
  content: string;
  isUser: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  content,
  isUser
}) => {
  return (
    <div className="animate-fade-in">
      {/* Message */}
      <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className="flex items-start space-x-2 max-w-xs sm:max-w-md lg:max-w-lg">
          {!isUser && (
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center mt-1">
              <Heart className="w-4 h-4 text-primary-500" />
            </div>
          )}
          <div
            className={`px-4 py-3 rounded-2xl ${
              isUser
                ? 'bg-primary-500 text-white rounded-br-md'
                : 'bg-gray-100 text-gray-800 rounded-bl-md'
            }`}
          >
            <p className="text-sm font-korean leading-relaxed">{content}</p>
          </div>
          {isUser && (
            <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center mt-1">
              <User className="w-4 h-4 text-white" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};