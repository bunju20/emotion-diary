import React, { useRef, useEffect, useState } from 'react';
import { useRive, useStateMachineInput } from '@rive-app/react-canvas';

interface RiveEmotionSelectorProps {
  onEmotionSelect: (emotion: number) => void;
  selectedEmotion?: number;
}

export const RiveEmotionSelector: React.FC<RiveEmotionSelectorProps> = ({
  onEmotionSelect,
  selectedEmotion = 1
}) => {
  const [currentEmotion, setCurrentEmotion] = useState(selectedEmotion);

  const { rive, RiveComponent } = useRive({
    src: '/emotion-selector.riv', // Rive 파일 경로
    stateMachines: 'State Machine 1', // 스테이트 머신 이름 (실제 이름으로 변경 필요)
    autoplay: true,
  });

  // Mood Select input 연결
  const moodSelectInput = useStateMachineInput(
    rive,
    'State Machine 1', // 스테이트 머신 이름
    'Mood Select' // input 이름
  );

  // 감정이 변경될 때마다 Rive 애니메이션 업데이트
  useEffect(() => {
    if (moodSelectInput) {
      moodSelectInput.value = currentEmotion;
    }
  }, [moodSelectInput, currentEmotion]);

  // 감정 선택 핸들러
  const handleEmotionSelect = (emotion: number) => {
    setCurrentEmotion(emotion);
    onEmotionSelect(emotion);
  };

  const emotions = [
    { value: 0, label: '짜증', emoji: '😠', color: 'bg-red-100 border-red-300' },
    { value: 1, label: '의문', emoji: '🤔', color: 'bg-yellow-100 border-yellow-300' },
    { value: 2, label: '행복', emoji: '😊', color: 'bg-green-100 border-green-300' },
    { value: 3, label: '피곤', emoji: '😴', color: 'bg-blue-100 border-blue-300' },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 font-korean text-center">
        지금 기분은 어떠신가요?
      </h3>
      
      {/* Rive 애니메이션 */}
      <div className="w-full h-48 mb-6 bg-gray-50 rounded-xl overflow-hidden">
        <RiveComponent className="w-full h-full" />
      </div>

      {/* 감정 선택 버튼들 */}
      <div className="grid grid-cols-2 gap-3">
        {emotions.map((emotion) => (
          <button
            key={emotion.value}
            onClick={() => handleEmotionSelect(emotion.value)}
            className={`
              p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105
              ${currentEmotion === emotion.value 
                ? `${emotion.color} border-opacity-100 shadow-md` 
                : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
              }
            `}
          >
            <div className="text-center">
              <div className="text-2xl mb-2">{emotion.emoji}</div>
              <span className="text-sm font-korean font-medium text-gray-700">
                {emotion.label}
              </span>
            </div>
          </button>
        ))}
      </div>

      <p className="text-xs text-gray-500 text-center mt-4 font-korean">
        감정을 선택하면 캐릭터가 반응해요
      </p>
    </div>
  );
};