export interface Product {
  id: string;
  title: string;
  image: string;
  price: number;
  rating: number;
  category: string;
}

export interface WishItem extends Product {
  addedAt: Date;
  memo?: string;
  emotionTag: 'need' | 'desire' | 'stress';
}

export interface SpendingRecord {
  id: string;
  productId: string;
  productTitle: string;
  amount: number;
  emotionTag: 'need' | 'desire' | 'stress';
  date: Date;
}

export interface Settings {
  monthlyBudget: number;
  stressWarningThreshold: number;
  purchaseDelayMinutes: number; // 구매 대기 시간 (분)
}