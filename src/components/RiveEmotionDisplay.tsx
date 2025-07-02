import React, { useRef, useEffect, useState } from 'react';
import { useRive, useStateMachineInput } from '@rive-app/react-canvas';

interface RiveEmotionDisplayProps {
  currentEmotion: number;
  className?: string;
}

export const RiveEmotionDisplay: React.FC<RiveEmotionDisplayProps> = ({
  currentEmotion,
  className = ""
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const { rive, RiveComponent } = useRive({
    src: '/emotion-selector.riv',
    stateMachines: 'State Machine 1',
    autoplay: true,
    onLoad: () => {
      console.log('Rive file loaded successfully');
      setIsLoaded(true);
      setHasError(false);
    },
    onLoadError: (error) => {
      console.error('Rive file load error:', error);
      setHasError(true);
      setIsLoaded(false);
    },
  });

  // Mood Select input 연결
  const moodSelectInput = useStateMachineInput(
    rive,
    'State Machine 1',
    'Mood Select'
  );

  // 감정이 변경될 때마다 Rive 애니메이션 업데이트
  useEffect(() => {
    if (moodSelectInput && isLoaded) {
      console.log('Setting emotion to:', currentEmotion);
      moodSelectInput.value = currentEmotion;
    }
  }, [moodSelectInput, currentEmotion, isLoaded]);

  // 감정에 따른 폴백 이모지
  const getEmotionEmoji = (emotion: number) => {
    const emojiMap: { [key: number]: string } = {
      0: '😠', // 짜증
      1: '🤔', // 의문
      2: '😊', // 행복
      3: '😴', // 피곤
    };
    return emojiMap[emotion] || '😐';
  };

  const getEmotionLabel = (emotion: number) => {
    const labelMap: { [key: number]: string } = {
      0: '짜증',
      1: '의문',
      2: '행복',
      3: '피곤',
    };
    return labelMap[emotion] || '보통';
  };

  if (hasError) {
    // Rive 파일 로드 실패 시 폴백 UI
    return (
      <div className={`bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-6 text-center ${className}`}>
        <div className="text-4xl mb-2 animate-bounce">
          {getEmotionEmoji(currentEmotion)}
        </div>
        <p className="text-sm font-korean text-gray-600">
          {getEmotionLabel(currentEmotion)}
        </p>
      </div>
    );
  }

  return (
    <div className={`bg-gray-50 rounded-xl overflow-hidden relative ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-xs font-korean text-gray-500">로딩 중...</p>
          </div>
        </div>
      )}
      
      <RiveComponent 
        className="w-full h-full"
        style={{ 
          display: isLoaded ? 'block' : 'none',
          minHeight: '120px'
        }}
      />
      
      {isLoaded && (
        <div className="absolute bottom-2 right-2 bg-white/80 backdrop-blur-sm rounded-full px-2 py-1">
          <span className="text-xs font-korean text-gray-600">
            {getEmotionLabel(currentEmotion)}
          </span>
        </div>
      )}
    </div>
  );
};