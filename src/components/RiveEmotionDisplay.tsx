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
  const [isInitialized, setIsInitialized] = useState(false);

  const { rive, RiveComponent } = useRive({
    src: '/emotion-selector.riv',
    stateMachines: 'State Machine 1', // Rive 에디터에서 정확한 이름 확인 필요
    autoplay: true,
    onLoad: () => {
      console.log('Rive file loaded successfully');
      setIsLoaded(true);
      setHasError(false);
      // 로드 후 약간의 지연을 두어 완전한 초기화 대기
      setTimeout(() => {
        setIsInitialized(true);
      }, 200);
    },
    onLoadError: (error) => {
      console.error('Rive file load error:', error);
      setHasError(true);
      setIsLoaded(false);
    },
    onStateChange: (event) => {
      console.log('Rive state changed:', event);
    }
  });

  // Mood Select input 연결
  const moodSelectInput = useStateMachineInput(
    rive,
    'State Machine 1', // Rive 에디터에서 정확한 이름 확인 필요
    'Mood Select' // Rive 에디터에서 정확한 Input 이름 확인 필요
  );

  // 감정이 변경될 때마다 Rive 애니메이션 업데이트
  useEffect(() => {
    if (moodSelectInput && isLoaded && isInitialized && rive) {
      console.log('Setting emotion to:', currentEmotion);
      console.log('Input available:', moodSelectInput);
      
      // 값 설정 전 현재 상태 로그
      console.log('Current input value:', moodSelectInput.value);
      
      try {
        moodSelectInput.value = currentEmotion;
        console.log('Successfully set emotion value');
      } catch (error) {
        console.error('Error setting emotion value:', error);
      }
    } else {
      console.log('Waiting for initialization:', {
        moodSelectInput: !!moodSelectInput,
        isLoaded,
        isInitialized,
        rive: !!rive
      });
    }
  }, [moodSelectInput, currentEmotion, isLoaded, isInitialized, rive]);

  // 디버깅을 위한 useEffect
  useEffect(() => {
    if (rive && isLoaded) {
      console.log('Rive instance:', rive);
      console.log('Available state machines:', rive.stateMachineNames);
      if (rive.stateMachineNames.length > 0) {
        console.log('Using state machine:', rive.stateMachineNames[0]);
      }
    }
  }, [rive, isLoaded]);

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
        <p className="text-xs text-red-500 mt-2">
          애니메이션 로드 실패
        </p>
      </div>
    );
  }

  return (
    <div className={`bg-gray-50 rounded-xl overflow-hidden relative ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-xs font-korean text-gray-500">로딩 중...</p>
          </div>
        </div>
      )}
      
      <RiveComponent 
        className="w-full h-full"
        style={{ 
          display: 'block', // 항상 표시하되 로딩 오버레이로 가림
          minHeight: '120px',
          width: '100%',
          height: '120px', // 명시적 높이 설정
          backgroundColor: 'transparent' // 배경색 명시적 설정
        }}
      />
      
      {isLoaded && (
        <div className="absolute bottom-2 right-2 bg-white/80 backdrop-blur-sm rounded-full px-2 py-1 z-20">
          <span className="text-xs font-korean text-gray-600">
            {getEmotionLabel(currentEmotion)}
          </span>
        </div>
      )}
      
      {/* 디버깅 정보 (개발 시에만 사용) */}
      {process.env.NODE_ENV === 'development' && isLoaded && (
        <div className="absolute top-2 left-2 bg-black/50 text-white text-xs p-1 rounded">
          Input: {moodSelectInput ? 'Connected' : 'Not Connected'}
          <br />
          Value: {currentEmotion}
        </div>
      )}
    </div>
  );
};