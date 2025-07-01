import { GoogleGenerativeAI } from '@google/generative-ai';
import { Message, EmotionAnalysis, DiaryResult } from '../types';

// Get API key from environment variables
const API_KEY = import.meta.env.VITE_GOOGLE_AI_API_KEY;

class AIService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;

  constructor() {
    if (API_KEY) {
      this.genAI = new GoogleGenerativeAI(API_KEY);
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    }
  }

  async generateEmpathyResponse(message: string): Promise<string> {
    if (!this.model) {
      // Mock response for demo purposes
      const responses = [
        "정말 힘든 하루였겠네요. 고생 많았어요.",
        "그런 일이 있으셨군요. 마음이 많이 무거우셨을 것 같아요.",
        "충분히 이해해요. 때로는 그런 감정을 느끼는 것이 자연스러워요.",
        "당신의 마음을 들어주게 되어 고마워요. 혼자가 아니에요.",
        "오늘 하루도 잘 견뎌내신 당신이 정말 대단해요.",
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }

    try {
      const prompt = `다음 메시지에 대해 공감하고 위로하는 따뜻한 한 문장으로 답변해주세요. 너무 길지 않게, 자연스럽고 진심이 담긴 말로 해주세요: "${message}"`;
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } catch (error) {
      console.error('AI response generation failed:', error);
      return "당신의 마음을 이해해요. 함께 있어드릴게요.";
    }
  }

  async generateDiaryResult(messages: Message[]): Promise<DiaryResult> {
    if (!this.model) {
      // Mock result for demo purposes
      return {
        diary: `오늘은 여러 가지 일로 마음이 복잡한 하루였다. 때로는 힘들고 지쳤지만, 그럼에도 불구하고 하루를 견뎌내며 나 자신과 마주할 수 있었다. 

작은 것들에도 감사함을 느끼려 노력했고, 힘든 순간들 속에서도 나만의 작은 행복을 찾으려 했다. 완벽하지 않은 하루였지만, 그래도 나는 오늘도 최선을 다했다.

내일은 조금 더 나은 하루가 되기를 바라며, 오늘의 나 자신에게도 수고했다는 말을 전하고 싶다.`,
        emotions: {
          happy: 15,
          sad: 25,
          angry: 10,
          anxious: 20,
          peaceful: 10,
          tired: 20,
        },
        psychologyFeedback: "오늘은 다양한 감정을 경험한 하루였습니다. 특히 피로감과 우울감이 높게 나타났는데, 이는 스트레스가 누적된 상태일 가능성이 있어요. 자신의 감정을 인정하고 받아들이는 것이 첫 번째 단계입니다.",
        advice: "잠시 숨을 고르며 자신을 돌아보는 시간을 가져보세요. 충분한 휴식과 함께 좋아하는 활동을 통해 마음의 균형을 찾아가시길 바랍니다. 작은 성취라도 스스로를 칭찬해주는 것을 잊지 마세요."
      };
    }

    try {
      const conversationText = messages.map(m => m.content).join('\n');
      
      const diaryPrompt = `다음 대화 내용을 바탕으로 감성적이고 아름다운 일기를 작성해주세요. 3-4개 문단으로, 마치 소설처럼 서정적으로 써주세요. 하루의 감정과 경험을 따뜻하게 정리해주세요:\n\n${conversationText}`;
      
      const emotionPrompt = `다음 대화 내용의 감정을 분석하여 각 감정의 비율을 0-100 숫자로만 반환해주세요. 모든 비율의 합은 100이 되어야 합니다. 형식: happy:숫자,sad:숫자,angry:숫자,anxious:숫자,peaceful:숫자,tired:숫자\n\n${conversationText}`;
      
      const feedbackPrompt = `다음 대화 내용을 바탕으로 심리학적 관점에서 오늘의 감정 상태에 대한 따뜻하고 전문적인 피드백을 3-4문장으로 제공해주세요. 감정을 인정하고 이해하는 관점으로 작성해주세요:\n\n${conversationText}`;
      
      const advicePrompt = `다음 대화 내용을 바탕으로 마음의 치유와 회복을 위한 따뜻하고 실용적인 조언을 3-4문장으로 제공해주세요. 구체적이고 실행 가능한 조언으로 작성해주세요:\n\n${conversationText}`;

      const [diaryResult, emotionResult, feedbackResult, adviceResult] = await Promise.all([
        this.model.generateContent(diaryPrompt),
        this.model.generateContent(emotionPrompt),
        this.model.generateContent(feedbackPrompt),
        this.model.generateContent(advicePrompt),
      ]);

      const diary = (await diaryResult.response).text().trim();
      const emotionText = (await emotionResult.response).text().trim();
      const feedback = (await feedbackResult.response).text().trim();
      const advice = (await adviceResult.response).text().trim();

      // Parse emotion analysis
      const emotions: EmotionAnalysis = {
        happy: 20, sad: 20, angry: 10, anxious: 15, peaceful: 15, tired: 20
      };

      try {
        const emotionPairs = emotionText.split(',');
        emotionPairs.forEach(pair => {
          const [emotion, value] = pair.split(':');
          if (emotion && value && emotions.hasOwnProperty(emotion.trim())) {
            emotions[emotion.trim() as keyof EmotionAnalysis] = parseInt(value.trim());
          }
        });
      } catch (e) {
        console.log('Failed to parse emotions, using defaults');
      }

      return {
        diary,
        emotions,
        psychologyFeedback: feedback,
        advice
      };
    } catch (error) {
      console.error('Diary generation failed:', error);
      throw error;
    }
  }
}

export const aiService = new AIService();