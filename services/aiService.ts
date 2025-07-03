import { GoogleGenerativeAI } from "@google/generative-ai";

// Safely get API key from environment variables with fallback
const getAPIKey = (): string | null => {
  try {
    // Check if import.meta.env exists (Vite environment)
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      const apiKey = import.meta.env.VITE_GOOGLE_AI_API_KEY;
      console.log('🔑 API Key found:', apiKey ? `${apiKey.substring(0, 10)}...` : 'None');
      return apiKey || null;
    }
    console.log('❌ import.meta.env not available');
    return null;
  } catch (error) {
    console.warn('❌ Failed to access environment variables:', error);
    return null;
  }
};

const API_KEY = getAPIKey();

export interface MemoAnalysis {
  emotionDetected: 'impulse' | 'stress' | 'need' | 'happiness' | 'neutral';
  confidenceLevel: number; // 0-100
  persuasionMessage: string;
  shouldWarn: boolean;
}

class AIService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;
  private initializationError: string | null = null;

  constructor() {
    this.initializeAI();
  }

  private initializeAI() {
    console.log('🤖 Initializing AI Service...');
    console.log('🔍 API Key available:', !!API_KEY);
    console.log('🔍 API Key length:', API_KEY?.length || 0);
    console.log('🔍 API Key starts with AIza:', API_KEY?.startsWith('AIza') || false);

    try {
      if (API_KEY && API_KEY !== 'your_api_key_here' && API_KEY.length > 10) {
        console.log('✅ Valid API key detected, initializing Google AI...');
        this.genAI = new GoogleGenerativeAI(API_KEY);
        this.model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
        console.log('✅ AI Service initialized successfully');
        this.initializationError = null;
      } else {
        console.log('⚠️ AI Service running in demo mode - no valid API key provided');
        console.log('API Key details:', {
          exists: !!API_KEY,
          isPlaceholder: API_KEY === 'your_api_key_here',
          length: API_KEY?.length || 0
        });
        this.initializationError = 'No valid API key';
      }
    } catch (error) {
      console.error('❌ Failed to initialize AI Service:', error);
      this.genAI = null;
      this.model = null;
      this.initializationError = error instanceof Error ? error.message : 'Unknown error';
    }
  }

  // Clean response to remove quotes and unwanted formatting
  private cleanResponse(text: string): string {
    return text
      .replace(/^["']|["']$/g, '') // Remove quotes at start/end
      .replace(/^"|"$/g, '') // Remove double quotes at start/end
      .replace(/^'|'$/g, '') // Remove single quotes at start/end
      .trim();
  }

  // 메모 내용을 분석하여 구매 동기와 감정 상태를 파악
  async analyzeMemo(memo: string, emotionTag: 'need' | 'desire' | 'stress'): Promise<MemoAnalysis> {
    console.log('🔍 Analyzing memo:', { memo: memo.substring(0, 50) + '...', emotionTag, hasModel: !!this.model });

    if (!this.model) {
      console.log('⚠️ Using mock analysis - AI model not available');
      return this.getMockAnalysis(memo, emotionTag);
    }

    try {
      console.log('🤖 Sending request to Gemini AI...');
      const prompt = `다음 메모를 분석하여 구매 동기와 감정 상태를 파악해주세요:

메모: "${memo}"
감정 태그: ${emotionTag === 'need' ? '필요' : emotionTag === 'desire' ? '욕망' : '스트레스'}

분석 결과를 다음 형식으로 반환해주세요:
{
  "emotion": "impulse|stress|need|happiness|neutral 중 하나",
  "confidence": 0-100 사이의 숫자,
  "message": "친근하고 따뜻한 톤으로 2-3문장의 설득 메시지. 충동구매나 스트레스 구매가 의심되면 부드럽게 재고하도록 유도. 진짜 필요한 구매라면 긍정적으로 격려",
  "warn": true 또는 false (충동구매나 감정적 구매가 의심되면 true)
}

JSON 형식으로만 답변해주세요.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const responseText = this.cleanResponse(response.text());
      
      console.log('✅ Received AI response:', responseText.substring(0, 100) + '...');
      
      try {
        const parsed = JSON.parse(responseText);
        console.log('✅ Successfully parsed AI response:', parsed);
        return {
          emotionDetected: parsed.emotion || 'neutral',
          confidenceLevel: Math.max(0, Math.min(100, parsed.confidence || 50)),
          persuasionMessage: parsed.message || '신중하게 생각해보시는 건 어떨까요?',
          shouldWarn: parsed.warn || false
        };
      } catch (parseError) {
        console.error("❌ Failed to parse AI response:", parseError);
        console.log("Raw response:", responseText);
        return this.getFallbackAnalysis(memo, emotionTag);
      }
    } catch (error) {
      console.error("❌ AI analysis failed:", error);
      return this.getFallbackAnalysis(memo, emotionTag);
    }
  }

  // Mock analysis for demo purposes
  private getMockAnalysis(memo: string, emotionTag: 'need' | 'desire' | 'stress'): MemoAnalysis {
    console.log('🎭 Running mock analysis for demo...');
    const lowerMemo = memo.toLowerCase();
    
    // 더 정교한 키워드 분석
    const impulseKeywords = ['기분', '갑자기', '순간', '보자마자', '충동', '끌려서', '마음에 들어서'];
    const stressKeywords = ['스트레스', '힘들어서', '우울해서', '답답해서', '화가나서', '짜증', '속상해서', '기분전환'];
    const needKeywords = ['필요', '없으면', '부족', '필수', '꼭', '반드시', '써야', '부족해서', '필요해서'];
    const happyKeywords = ['기분좋', '행복', '기쁘', '좋은기분', '신나', '즐거워서', '기념', '축하'];
    const socialKeywords = ['다른사람', '친구', '남들', '인스타', 'sns', '보여주', '자랑'];
    const saleKeywords = ['할인', '세일', '저렴', '특가', '한정', '마지막', '놓치면'];

    const hasImpulse = impulseKeywords.some(keyword => lowerMemo.includes(keyword));
    const hasStress = stressKeywords.some(keyword => lowerMemo.includes(keyword));
    const hasNeed = needKeywords.some(keyword => lowerMemo.includes(keyword));
    const hasHappy = happyKeywords.some(keyword => lowerMemo.includes(keyword));
    const hasSocial = socialKeywords.some(keyword => lowerMemo.includes(keyword));
    const hasSale = saleKeywords.some(keyword => lowerMemo.includes(keyword));

    // 복합적인 감정 분석
    if (hasStress || emotionTag === 'stress') {
      const messages = [
        '스트레스 받을 때 쇼핑하고 싶은 마음, 충분히 이해해요. 하지만 이 구매가 스트레스를 근본적으로 해결해줄까요? 잠시 심호흡을 해보시는 건 어떨까요? 🤗',
        '힘든 일이 있으셨나 봐요. 쇼핑으로 기분전환을 하고 싶으신 마음은 이해하지만, 잠시 산책을 하거나 좋아하는 음악을 들어보시는 건 어떨까요? 💭',
        '스트레스성 구매는 순간적인 위안을 줄 수 있지만, 나중에 후회가 될 수도 있어요. 진정으로 마음을 달래줄 다른 방법은 없을까요? 🌸'
      ];
      const result = {
        emotionDetected: 'stress' as const,
        confidenceLevel: 85 + Math.floor(Math.random() * 10),
        persuasionMessage: messages[Math.floor(Math.random() * messages.length)],
        shouldWarn: true
      };
      console.log('🎭 Mock analysis result (stress):', result);
      return result;
    } else if ((hasImpulse || hasSale) && (hasHappy || emotionTag === 'desire')) {
      const messages = [
        '순간적인 끌림이나 할인 혜택 때문에 구매하시는 건 아닌가요? 정말 지금 필요한 것인지 한 번 더 생각해보세요. 내일도 같은 마음일까요? ✨',
        '기분 좋을 때의 구매는 더욱 신중하게! 이 행복한 기분이 구매 욕구를 부추기고 있지 않나요? 잠시 시간을 두고 다시 생각해보세요 🌟',
        '할인이나 특가 때문에 서두르고 계신가요? 진짜 필요한 것이라면 다른 기회도 있을 거예요. 차분히 생각해보시는 건 어떨까요? 💭'
      ];
      const result = {
        emotionDetected: 'impulse' as const,
        confidenceLevel: 80 + Math.floor(Math.random() * 15),
        persuasionMessage: messages[Math.floor(Math.random() * messages.length)],
        shouldWarn: true
      };
      console.log('🎭 Mock analysis result (impulse):', result);
      return result;
    } else if (hasSocial) {
      const result = {
        emotionDetected: 'impulse' as const,
        confidenceLevel: 75 + Math.floor(Math.random() * 10),
        persuasionMessage: '다른 사람들 때문에 갖고 싶어하시는 건 아닌가요? 남들과 비교하지 마시고, 정말 본인에게 필요한 것인지 생각해보세요. 당신만의 기준이 중요해요! 💪',
        shouldWarn: true
      };
      console.log('🎭 Mock analysis result (social):', result);
      return result;
    } else if (hasNeed || emotionTag === 'need') {
      const messages = [
        '실용적인 필요에 의한 구매 같네요! 다른 대안이나 더 좋은 가격의 제품은 없는지 한 번 더 살펴보시는 건 어떨까요? 현명한 선택이 될 것 같아요! 💡',
        '정말 필요한 것 같은데요? 그래도 다른 브랜드나 더 합리적인 가격의 제품과 비교해보시는 건 어떨까요? 꼼꼼히 따져보시는 모습이 멋져요! 👍',
        '필요에 의한 구매인 것 같아요. 사용 빈도나 품질을 고려해서 정말 이 제품이 최선의 선택인지 한 번 더 확인해보세요! 🔍'
      ];
      const result = {
        emotionDetected: 'need' as const,
        confidenceLevel: 70 + Math.floor(Math.random() * 15),
        persuasionMessage: messages[Math.floor(Math.random() * messages.length)],
        shouldWarn: false
      };
      console.log('🎭 Mock analysis result (need):', result);
      return result;
    } else if (hasHappy) {
      const result = {
        emotionDetected: 'happiness' as const,
        confidenceLevel: 70 + Math.floor(Math.random() * 10),
        persuasionMessage: '기분 좋을 때의 구매는 더욱 신중하게! 이 좋은 기분이 일시적일 수 있어요. 일주일 후에도 같은 마음일지 생각해보시는 건 어떨까요? 🌸',
        shouldWarn: true
      };
      console.log('🎭 Mock analysis result (happiness):', result);
      return result;
    } else {
      const messages = [
        '구매 전에 한 번 더 생각해보세요. 정말 필요한 것인지, 다른 대안은 없는지 차분히 고민해보시는 건 어떨까요? 🌱',
        '신중한 결정을 내리시는 모습이 보기 좋아요! 이 제품이 정말 당신의 삶을 더 나아지게 할지 생각해보세요 ✨',
        '구매하기 전에 잠시 멈춰서 생각해보는 시간을 가져보세요. 당신의 현명한 판단을 믿어요! 💭'
      ];
      const result = {
        emotionDetected: 'neutral' as const,
        confidenceLevel: 60 + Math.floor(Math.random() * 20),
        persuasionMessage: messages[Math.floor(Math.random() * messages.length)],
        shouldWarn: false
      };
      console.log('🎭 Mock analysis result (neutral):', result);
      return result;
    }
  }

  // API 실패 시 폴백 분석
  private getFallbackAnalysis(memo: string, emotionTag: 'need' | 'desire' | 'stress'): MemoAnalysis {
    console.log('🔄 Using fallback analysis due to API failure');
    return this.getMockAnalysis(memo, emotionTag);
  }

  // AI 서비스 사용 가능 여부 확인
  isAvailable(): boolean {
    return this.model !== null;
  }

  // API 키 상태 확인
  getStatus(): { hasApiKey: boolean; isInitialized: boolean; apiKeyLength: number; error: string | null } {
    const status = {
      hasApiKey: !!API_KEY && API_KEY !== 'your_api_key_here',
      isInitialized: !!this.model,
      apiKeyLength: API_KEY ? API_KEY.length : 0,
      error: this.initializationError
    };
    console.log('📊 AI Service status:', status);
    return status;
  }

  // 디버깅용 메서드
  getDebugInfo(): any {
    return {
      apiKey: API_KEY ? `${API_KEY.substring(0, 10)}...` : 'None',
      hasGenAI: !!this.genAI,
      hasModel: !!this.model,
      error: this.initializationError,
      env: typeof import.meta !== 'undefined' ? 'Vite' : 'Unknown'
    };
  }
}

export const aiService = new AIService();

// 디버깅을 위해 전역에서 접근 가능하도록
(window as any).aiService = aiService;