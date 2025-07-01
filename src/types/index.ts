export interface Message {
  id: string;
  content: string;
  timestamp: Date;
  aiResponse?: string;
}

export interface EmotionAnalysis {
  happy: number;
  sad: number;
  angry: number;
  anxious: number;
  peaceful: number;
  tired: number;
}

export interface DiaryResult {
  diary: string;
  emotions: EmotionAnalysis;
  psychologyFeedback: string;
  advice: string;
}